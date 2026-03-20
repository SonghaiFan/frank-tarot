export enum GameState {
  INTRO = "INTRO",
  INPUT = "INPUT",
  SHUFFLING = "SHUFFLING",
  PICKING = "PICKING",
  REVEAL = "REVEAL",
  READING = "READING",
  LIBRARY = "LIBRARY",
}

export type SpreadType =
  | "SINGLE"
  | "THREE"
  | "FOUR"
  | "TIMELINE"
  | "DIMENSION"
  | "FIVE"
  | "RELATION"
  | "CELTIC"
  | "COURT"
  | "ACTION"
  | "GOALS"
  | "YEARLY"
  | "AUTO";

export type Locale = "zh-CN" | "en";

export type CardPoolType =
  | "MAJOR"
  | "MINOR_PIP"
  | "COURT"
  | "FULL"
  | "SUIT_CUPS"
  | "SUIT_PENTACLES"
  | "SUIT_SWORDS"
  | "SUIT_WANDS";

export interface TarotCard {
  id: number;
  nameEn: string;
  nameCn: string;
  descriptionCn?: string;
  descriptionEn?: string;
  keywords: string[];
  image: string; // Local asset filename
  positive?: string;
  negative?: string;
}

export interface PickedCard extends TarotCard {
  isReversed: boolean;
}

export interface AudioMessage {
  id: string;
  text: string;
  buffer?: AudioBuffer; // Cached buffer
}

export interface TarotReadingResponse {
  text: string;
}
