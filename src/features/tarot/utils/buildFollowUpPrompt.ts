import { getLocalizedSpread } from "@/features/tarot/constants/spreads";
import { Locale, PickedCard, SpreadType } from "@/features/tarot/types";
import i18n from "@/i18n/config";

export default function buildFollowUpPrompt(
  pickedCards: PickedCard[],
  spread: SpreadType,
  question: string,
  readingText: string,
  locale: Locale
) {
  const t = i18n.getFixedT(locale);
  const spreadConfig = getLocalizedSpread(spread, locale);

  const cardsList = pickedCards
    .slice(0, spreadConfig.cardCount)
    .map((card, index) => {
      const positionLabel =
        spreadConfig.layoutType === "absolute"
          ? spreadConfig.positions?.[index]?.label
          : spreadConfig.labels?.[index];
      const localizedKeywords = locale === "zh-CN" ? card.keywords : card.keywordsEn || [];
      const keywordText =
        localizedKeywords.length > 0 ? ` - ${localizedKeywords.join(", ")}` : "";
      const orientation = locale === "zh-CN"
        ? card.isReversed
          ? "逆位"
          : "正位"
        : card.isReversed
          ? "Reversed"
          : "Upright";
      const cardName = locale === "zh-CN" ? card.nameCn : card.nameEn;

      return `${index + 1}. ${
        positionLabel || t("reading.copyPrompt.positionFallback")
      }: ${cardName} (${orientation})${keywordText}`;
    })
    .join("\n");

  return `${t("reading.copyPrompt.title", { spreadName: spreadConfig.name })}

${t("reading.copyPrompt.question", {
  question: question || t("reading.copyPrompt.defaultQuestion"),
})}

${t("reading.copyPrompt.cardsDrawn")}
${cardsList}

${t("reading.copyPrompt.initialInterpretation")}
${readingText}

${t("reading.copyPrompt.request")}`;
}
