import { GoogleGenAI } from "@google/genai";
import { SpreadType, PickedCard, Locale } from "@/features/tarot/types";
import { SPREADS, getLocalizedSpread } from "@/features/tarot/constants/spreads";
import { buildTarotReadingPrompt } from "./promptBuilder";

/**
 * 获取 API Key（优先使用传入的 key，其次环境变量）
 */
export const getApiKey = (customKey?: string): string => {
  return (
    customKey?.trim() ||
    process.env.API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    ""
  );
};

export const hasApiKey = (customKey?: string): boolean => {
  return Boolean(getApiKey(customKey));
};

const getAiClient = (customKey?: string) => {
  const key = getApiKey(customKey);
  return new GoogleGenAI({ apiKey: key });
};

/**
 * 智能分析问卜者的问题，推荐最合适的牌阵
 */
export const predictBestSpread = async (
  question: string,
  locale: Locale = "zh-CN",
  apiKey?: string
): Promise<SpreadType> => {
  if (!hasApiKey(apiKey)) {
    return "SINGLE";
  }

  try {
    const ai = getAiClient(apiKey);

    const spreadList = Object.values(SPREADS)
      .map((s) => {
        const localized = getLocalizedSpread(s.id, "en");
        return `- ${localized.id}: ${localized.name} (${localized.description})`;
      })
      .join("\n");

    const prompt = `
      Role: You are a deeply intuitive Tarot Guide.
      Task: Analyze the user's question and select the ONE most appropriate Tarot Spread from the list below.
      
      User Question: "${question}"
      
      Available Spreads:
      ${spreadList}
      
      Instructions:
      - If the question involves time/trends, prefer TIMELINE or YEARLY.
      - If the question involves love/partnerships, prefer RELATION.
      - If the question is about self-discovery, prefer COURT, FIVE, or DIMENSION.
      - If the question is simple or broad, prefer SINGLE or THREE.
      - If the question is about decision making, prefer FOUR (Simple Four).
      - If the question is about goals or career, prefer GOALS, TIMELINE, or YEARLY.
      
      Return ONLY the ID of the spread (e.g. "RELATION"). Do not add any explanation or extra text.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    const text = response.text?.trim().toUpperCase() || "SINGLE";

    if (Object.keys(SPREADS).includes(text)) {
      return text as SpreadType;
    }
    return "SINGLE";
  } catch (error) {
    console.warn("Spread prediction failed, defaulting to SINGLE:", error);
    return "SINGLE";
  }
};

/**
 * 根据已抽出的卡牌、牌阵和问题，调用 Gemini 生成大师级解读
 */
export const generateTarotReading = async (
  cards: PickedCard[],
  spread: SpreadType,
  question: string,
  locale: Locale = "zh-CN",
  apiKey?: string
): Promise<string> => {
  if (!hasApiKey(apiKey)) {
    return locale === "en"
      ? "API Key missing. Unable to generate interpretation."
      : "缺少 API Key，无法生成命运解读。";
  }

  try {
    const ai = getAiClient(apiKey);
    const prompt = buildTarotReadingPrompt({ cards, spread, question, locale });

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          temperature: 1.0,
        },
      });
    } catch (primaryErr) {
      console.warn(
        "Primary model (gemini-3.1-pro-preview) failed, falling back to gemini-3.6-flash:",
        primaryErr
      );
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 1.0,
        },
      });
    }

    return (
      response.text ||
      (locale === "en"
        ? "The stars are quiet at this moment."
        : "星辰在此刻保持了沉默。")
    );
  } catch (error) {
    console.warn("Tarot text generation error:", error);
    return locale === "en"
      ? "An omen obscured the stars. Please try again."
      : "一阵迷雾遮蔽了星辰，请稍后再试。";
  }
};
