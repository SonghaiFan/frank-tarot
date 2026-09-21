import { SPREADS, getLocalizedSpread, SpreadDefinition } from "@/features/tarot/constants/spreads";
import { getDeckForPool, FULL_DECK } from "@/features/tarot/constants/cards";
import { SpreadType, PickedCard, CardPoolType, Locale, TarotCard } from "@/features/tarot/types";

/**
 * 根据牌阵规则和牌池限制，从牌库中抽取不重复的卡牌，并随机计算正逆位（默认 40% 逆位概率）。
 */
export function drawCards(
  spreadType: SpreadType,
  options?: {
    reversedProbability?: number; // 逆位概率 (0.0 ~ 1.0)，默认 0.4
  }
): PickedCard[] {
  const effectiveSpread = spreadType && SPREADS[spreadType] ? spreadType : "SINGLE";
  const spreadDef = SPREADS[effectiveSpread];
  const reversedProb = options?.reversedProbability ?? 0.4;
  const picked: PickedCard[] = [];

  for (let i = 0; i < spreadDef.cardCount; i++) {
    let poolType: CardPoolType = "FULL";
    if (spreadDef.cardPools && spreadDef.cardPools[i]) {
      poolType = spreadDef.cardPools[i];
    }

    const sourceDeck = getDeckForPool(poolType);
    const availableDeck = sourceDeck.filter((c) => !picked.some((p) => p.id === c.id));

    if (availableDeck.length === 0) {
      // 极端降级保底：从整套牌中选取剩余未抽到的牌
      const fallbackDeck = FULL_DECK.filter((c) => !picked.some((p) => p.id === c.id));
      const chosen = fallbackDeck[Math.floor(Math.random() * fallbackDeck.length)] || sourceDeck[0];
      picked.push({
        ...chosen,
        isReversed: Math.random() < reversedProb,
      });
      continue;
    }

    const chosen = availableDeck[Math.floor(Math.random() * availableDeck.length)];
    picked.push({
      ...chosen,
      isReversed: Math.random() < reversedProb,
    });
  }

  return picked;
}

/**
 * 获取特定语言下的牌阵定义详情
 */
export function getSpreadDefinition(
  spreadType: SpreadType,
  locale: Locale = "zh-CN"
): SpreadDefinition {
  const effectiveSpread = spreadType && SPREADS[spreadType] ? spreadType : "SINGLE";
  return getLocalizedSpread(effectiveSpread, locale);
}

/**
 * 获取所有支持的牌阵列表
 */
export function listAvailableSpreads(locale: Locale = "zh-CN"): Array<{
  id: SpreadType;
  name: string;
  description: string;
  cardCount: number;
}> {
  return (Object.keys(SPREADS) as SpreadType[]).map((spreadId) => {
    const localized = getLocalizedSpread(spreadId, locale);
    return {
      id: spreadId,
      name: localized.name,
      description: localized.description,
      cardCount: localized.cardCount,
    };
  });
}
