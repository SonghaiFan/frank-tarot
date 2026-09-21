import { buildTarotFollowUpPrompt } from "@/core";
import { Locale, PickedCard, SpreadType } from "@/features/tarot/types";

export default function buildFollowUpPrompt(
  pickedCards: PickedCard[],
  spread: SpreadType,
  question: string,
  readingText: string,
  locale: Locale
) {
  return buildTarotFollowUpPrompt({
    cards: pickedCards,
    spread,
    question,
    readingText,
    locale,
  });
}
