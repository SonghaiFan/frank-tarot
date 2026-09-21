import { SpreadType, PickedCard, Locale, TarotCard } from "@/features/tarot/types";
import { drawCards, getSpreadDefinition, listAvailableSpreads } from "./tarotEngine";
import {
  buildTarotReadingPrompt,
  buildTarotFollowUpPrompt,
  TarotReadingPromptOptions,
  TarotFollowUpPromptOptions,
} from "./promptBuilder";
import {
  predictBestSpread,
  generateTarotReading,
  hasApiKey,
  getApiKey,
} from "./services";

export interface TarotRequest {
  /** 问卜者的问题 */
  question: string;
  /** 指定牌阵 ID，若传入 "AUTO" 或为空，且有 API Key 时将由 LLM 智能推断 */
  spread?: SpreadType | "AUTO";
  /** 语言偏好，默认 "zh-CN" */
  locale?: Locale;
  /** 自定义卡牌（若需要外部指定抽牌结果，而非内部随机抽牌） */
  customCards?: PickedCard[];
  /** Gemini API Key，如果不填则自动读取环境变量 GEMINI_API_KEY / API_KEY */
  apiKey?: string;
  /** 是否调用 LLM 生成解读文本（默认 true，若为 false 则仅输出抽牌与 Prompt） */
  generateReading?: boolean;
  /** 逆位概率 (0.0 ~ 1.0)，默认 0.4 */
  reversedProbability?: number;
}

export interface TarotPositionCard {
  positionIndex: number;
  positionLabel: string;
  card: PickedCard;
}

export interface TarotResponse {
  /** 问卜者的问题 */
  question: string;
  /** 语言 */
  locale: Locale;
  /** 牌阵元信息 */
  spread: {
    id: SpreadType;
    name: string;
    description: string;
    cardCount: number;
  };
  /** 抽取的卡牌及位置信息 */
  cards: TarotPositionCard[];
  /** 组装的提示词 */
  prompts: {
    /** 喂给大模型的完整解读 Prompt */
    readingPrompt: string;
    /** 供第三方多轮对话或继续追问的上下文 Prompt */
    followUpPrompt?: string;
  };
  /** 大模型生成的解读文本（若 generateReading=false 则为 undefined） */
  reading?: string;
}

/**
 * 一站式端到端塔罗牌预测流水线
 */
export async function runTarotPipeline(options: TarotRequest): Promise<TarotResponse> {
  const {
    question = "",
    locale = "zh-CN",
    apiKey,
    generateReading = true,
    reversedProbability = 0.4,
  } = options;

  // 1. 确定牌阵
  let targetSpread: SpreadType =
    options.spread && options.spread !== "AUTO" ? options.spread : "SINGLE";

  if ((!options.spread || options.spread === "AUTO") && hasApiKey(apiKey) && question.trim()) {
    try {
      targetSpread = await predictBestSpread(question, locale, apiKey);
    } catch {
      targetSpread = "SINGLE";
    }
  }

  // 2. 抽牌或使用指定卡牌
  const pickedCards: PickedCard[] =
    options.customCards && options.customCards.length > 0
      ? options.customCards
      : drawCards(targetSpread, { reversedProbability });

  const spreadConfig = getSpreadDefinition(targetSpread, locale);

  const cardsWithPositions: TarotPositionCard[] = pickedCards.map((card, idx) => {
    const positionLabel =
      spreadConfig.layoutType === "absolute"
        ? spreadConfig.positions?.[idx]?.label || (locale === "en" ? `Position ${idx + 1}` : `位置 ${idx + 1}`)
        : spreadConfig.labels?.[idx] || (locale === "en" ? `Position ${idx + 1}` : `位置 ${idx + 1}`);

    return {
      positionIndex: idx + 1,
      positionLabel,
      card,
    };
  });

  // 3. 组装 Prompt
  const readingPrompt = buildTarotReadingPrompt({
    cards: pickedCards,
    spread: targetSpread,
    question,
    locale,
  });

  // 4. 生成解读
  let readingText: string | undefined;
  if (generateReading && hasApiKey(apiKey)) {
    readingText = await generateTarotReading(
      pickedCards,
      targetSpread,
      question,
      locale,
      apiKey
    );
  }

  // 5. 组装追问上下文 Prompt
  const followUpPrompt = readingText
    ? buildTarotFollowUpPrompt({
        cards: pickedCards,
        spread: targetSpread,
        question,
        readingText,
        locale,
      })
    : undefined;

  return {
    question,
    locale,
    spread: {
      id: targetSpread,
      name: spreadConfig.name,
      description: spreadConfig.description,
      cardCount: spreadConfig.cardCount,
    },
    cards: cardsWithPositions,
    prompts: {
      readingPrompt,
      followUpPrompt,
    },
    reading: readingText,
  };
}

// 导出所有核心子模块
export {
  drawCards,
  getSpreadDefinition,
  listAvailableSpreads,
  buildTarotReadingPrompt,
  buildTarotFollowUpPrompt,
  predictBestSpread,
  generateTarotReading,
  hasApiKey,
  getApiKey,
};

export type {
  SpreadType,
  PickedCard,
  TarotCard,
  Locale,
  TarotReadingPromptOptions,
  TarotFollowUpPromptOptions,
};
