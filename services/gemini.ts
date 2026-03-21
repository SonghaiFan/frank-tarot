import { GoogleGenAI } from "@google/genai";
import { SpreadType, PickedCard, Locale } from "../types";
import { SPREADS, getLocalizedSpread } from "../constants/spreads";
import i18n from "../i18n/config";

// Helper to create a fresh client instance (important for key updates)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Audio Helper Functions ---

// Decode Base64 string to Uint8Array
const base64ToBytes = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Convert raw PCM (Int16) to AudioBuffer
// Gemini 2.5 Flash TTS returns raw PCM 16-bit mono at 24kHz
const pcmToAudioBuffer = (
  pcmData: Uint8Array,
  audioContext: AudioContext,
  sampleRate: number = 24000
): AudioBuffer => {
  // Convert 16-bit PCM to Float32
  const float32Data = new Float32Array(pcmData.length / 2);
  const dataView = new DataView(pcmData.buffer);

  for (let i = 0; i < pcmData.length / 2; i++) {
    // Little endian
    const int16 = dataView.getInt16(i * 2, true);
    // Normalize to [-1, 1]
    float32Data[i] = int16 / 32768;
  }

  const audioBuffer = audioContext.createBuffer(
    1,
    float32Data.length,
    sampleRate
  );
  audioBuffer.getChannelData(0).set(float32Data);
  return audioBuffer;
};

// Load pre-generated MP3 audio from local file
const loadLocalAudio = async (
  filename: string,
  audioContext: AudioContext
): Promise<AudioBuffer | null> => {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    const response = await fetch(`${baseUrl}audio/${filename}`);
    if (!response.ok) {
      console.warn(`本地音频文件不存在: ${filename}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    // Decode MP3 using Web Audio API
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.warn(`加载本地音频失败: ${filename}`, error);
    return null;
  }
};

// --- API Functions ---

export const generateTarotReading = async (
  cards: PickedCard[],
  spread: SpreadType,
  question: string,
  locale: Locale
): Promise<string> => {
  try {
    const ai = getAiClient();
    const spreadConfig = getLocalizedSpread(spread, "en");
    const t = i18n.getFixedT(locale);
    const outputLanguage =
      locale === "en" ? "English" : "Simplified Chinese";

    const cardDetails = cards
      .map((c, i) => {
        let position = `Position ${i + 1}`;
        if (spreadConfig.layoutType === "absolute" && spreadConfig.positions) {
          position = spreadConfig.positions[i]?.label || position;
        } else if (spreadConfig.labels) {
          position = spreadConfig.labels[i] || position;
        }

        const meaningHints =
          locale === "en"
            ? c.descriptionEn || c.descriptionCn || ""
            : (c.isReversed ? c.negative : c.positive) ||
              c.descriptionCn ||
              c.descriptionEn ||
              "";

        const orientation = c.isReversed ? "REVERSED" : "UPRIGHT";

        const title =
          locale === "en"
            ? c.nameEn
            : c.nameCn;

        const keywordLine =
          locale === "en"
            ? `\n        - Core Keywords: ${(c.keywordsEn || []).join(", ")}`
            : `\n        - Core Keywords: ${c.keywords.join("、")}`;

        return `Card ${i + 1} [${position}]: ${title}
        - Orientation: ${orientation}${keywordLine}
        ${meaningHints ? `- Meaning Hints: ${meaningHints}` : ""}`;
      })
      .join("\n");

    const spreadContext = spreadConfig.interpretationInstruction;

    const userQuestion = question.trim()
      ? `Seeker's Question: "${question}"`
      : "Seeker's Question: General guidance for the path ahead.";

    const prompt = `
      Role: You are a Grand Tarot Master and ancient sage.
      Your voice is mystical, emotionally intelligent, and grounded rather than theatrical.
      You interpret spreads by how the card positions interact, not by listing separate dictionary meanings.

      Task: Provide a Tarot reading for the seeker based on the following details.

      Spread: ${spreadConfig.name}
      ${userQuestion}

      ${spreadContext}

      Cards Drawn:
      ${cardDetails}

      Strict Interpretation Guidelines:
      1. Upright vs. Reversed:
         - Upright means energy that is active, direct, or clearly manifest.
         - Reversed does NOT automatically mean bad. It may indicate blocked energy, delay, inner conflict, internalization, or excess.

      2. Context:
         - Connect the reading directly to the seeker's specific question.
         - Avoid generic textbook meanings.

      3. **Narrative Flow & Synthesis:**
         - Do not list cards one by one like a dictionary.
         - Weave them into a single, fluid story or message.
         - Mention elemental harmony or tension only if it naturally helps the reading.

      4. Tone & Format:
         - Output language: ${outputLanguage}.
         - Format: One cohesive paragraph. No bullet points. No card-by-card numbering.
         - Speak directly to "you" if the output language is English, or directly to "你" if the output language is Simplified Chinese.
         - End with a short empowering line or mantra, without a label.
         - Length: ${locale === "en" ? "130-180 words" : "120-180 Chinese characters"}.

      Start your interpretation immediately in ${outputLanguage}.
    `;

    console.log("Tarot Reading Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      // model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0,
      },
    });
    return response.text || t("errors.readingSoftFail");
  } catch (error) {
    console.warn("Text generation warning:", error);
    return i18n.getFixedT(locale)("errors.readingHardFail");
  }
};

export const generateSpeech = async (
  text: string,
  audioContext: AudioContext,
  staticKey?: string,
  locale: Locale = "zh-CN"
): Promise<AudioBuffer | null> => {
  if (!text) return null;

  if (staticKey && locale === "zh-CN") {
    const localAudio = await loadLocalAudio(`${staticKey}.mp3`, audioContext);
    if (localAudio) {
      return localAudio;
    }
    console.warn(`本地音频不可用: ${staticKey}`);
  }

  // 2. Try Gemini TTS
  try {
    const ai = getAiClient();
    // Use the specific TTS model

    console.log("Gemini TTS text:", text);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-ttss",
      contents: [
        {
          parts: [
            {
              // Add the voice description to your text prompt
              text:
                locale === "en"
                  ? "Use a deep, mystical, empathetic English voice suitable for an ancient sage/tarot master. Speak in English and deliver the following reading with wisdom and calm presence: " + text
                  : "使用深沉、神秘、富有同理心的中文声音，模拟古老智者/塔罗大师的风格。请用普通话流畅地诵读以下解读，传递智慧和沉静的气场：" + text,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Enceladus" },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      const pcmBytes = base64ToBytes(base64Audio);
      // Ensure we pass the correct sample rate for the model (24000Hz)
      return pcmToAudioBuffer(pcmBytes, audioContext, 24000);
    }
    console.warn("No audio data in response");
    return null;
  } catch (error) {
    // Log warning for quota/server errors, return null so app stays silent
    console.warn(
      "Gemini TTS unavailable (quota or server busy). Staying silent.",
      error
    );
    return null;
  }
};

export const predictBestSpread = async (
  question: string,
  locale: Locale
): Promise<SpreadType> => {
  try {
    const ai = getAiClient();

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
    `;

    console.log("Predict Spread Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
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
    console.warn("Spread prediction failed, defaulting to SINGLE", error);
    return "SINGLE";
  }
};
