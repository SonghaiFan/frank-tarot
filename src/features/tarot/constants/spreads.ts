import type { ReactNode } from "react";
import groundTruth from "@/features/tarot/data/ground-truth.json";
import { SpreadType, CardPoolType, Locale } from "@/features/tarot/types";
import {
  SpreadPosition,
  SpreadPositionLayout,
  makeSpreadIcon,
} from "@/features/tarot/components/icons/SpreadIcons";

export type { SpreadPosition, SpreadPositionLayout };

type GroundTruthSpreadRecord = {
  id: SpreadType;
  name: { en: string; "zh-CN": string };
  description: { en: string; "zh-CN": string };
  cardCount: number;
  layout: {
    type: "flex" | "absolute";
    offset?: { x: number; y: number };
    positions?: SpreadPositionLayout[] | null;
    labels?: { en?: string[] | null; "zh-CN"?: string[] | null };
    positionLabels?: { en?: string[] | null; "zh-CN"?: string[] | null };
    cardSize: { mobile: string; desktop: string };
  };
  cardPools?: CardPoolType[] | null;
  interpretationInstruction: { en: string; "zh-CN": string };
  defaultQuestions?: { en?: string[] | null; "zh-CN"?: string[] | null };
};

type GroundTruthSpreads = {
  allIds: SpreadType[];
  byId: Record<SpreadType, GroundTruthSpreadRecord>;
};

const spreadsData = (groundTruth as { spreads: GroundTruthSpreads }).spreads;

export interface SpreadData {
  id: SpreadType;
  name_en: string;
  name_cn: string;
  description_en: string;
  description_cn: string;
  cardCount: number;
  layoutType: "flex" | "absolute";
  positions?: SpreadPositionLayout[];
  layoutOffset?: { x: number; y: number };
  positionLabels_en?: string[];
  positionLabels_cn?: string[];
  labels_en?: string[];
  labels_cn?: string[];
  cardPools?: CardPoolType[];
  cardSize: {
    mobile: string;
    desktop: string;
  };
  icon: (isActive: boolean) => ReactNode;
  interpretationInstruction_en: string;
  interpretationInstruction_cn: string;
  defaultQuestions_en?: string[];
  defaultQuestions_cn?: string[];
}

export interface SpreadDefinition {
  id: SpreadType;
  name: string;
  description: string;
  cardCount: number;
  layoutType: "flex" | "absolute";
  positions?: SpreadPosition[];
  layoutOffset?: { x: number; y: number };
  labels?: string[];
  cardPools?: CardPoolType[];
  cardSize: {
    mobile: string;
    desktop: string;
  };
  icon: (isActive: boolean) => ReactNode;
  interpretationInstruction: string;
  defaultQuestions?: string[];
}

const toSpreadData = (spread: GroundTruthSpreadRecord): SpreadData => ({
  id: spread.id,
  name_en: spread.name.en,
  name_cn: spread.name["zh-CN"],
  description_en: spread.description.en,
  description_cn: spread.description["zh-CN"],
  cardCount: spread.cardCount,
  layoutType: spread.layout.type,
  positions: spread.layout.positions ?? undefined,
  layoutOffset: spread.layout.offset ?? undefined,
  positionLabels_en: spread.layout.positionLabels?.en ?? undefined,
  positionLabels_cn: spread.layout.positionLabels?.["zh-CN"] ?? undefined,
  labels_en: spread.layout.labels?.en ?? undefined,
  labels_cn: spread.layout.labels?.["zh-CN"] ?? undefined,
  cardPools: spread.cardPools ?? undefined,
  cardSize: spread.layout.cardSize,
  icon: makeSpreadIcon(spread),
  interpretationInstruction_en: spread.interpretationInstruction.en,
  interpretationInstruction_cn: spread.interpretationInstruction["zh-CN"],
  defaultQuestions_en: spread.defaultQuestions?.en ?? undefined,
  defaultQuestions_cn: spread.defaultQuestions?.["zh-CN"] ?? undefined,
});

export const SPREADS: Record<SpreadType, SpreadData> = spreadsData.allIds.reduce(
  (acc, spreadId) => {
    acc[spreadId] = toSpreadData(spreadsData.byId[spreadId]);
    return acc;
  },
  {} as Record<SpreadType, SpreadData>
);

const localizePositions = (
  positions: SpreadPositionLayout[] | undefined,
  labels: string[] | undefined
): SpreadPosition[] | undefined => {
  if (!positions || !labels) return undefined;
  return positions.map((position, index) => ({
    ...position,
    label: labels[index] ?? "",
  }));
};

export const getLocalizedSpread = (
  spread: SpreadType,
  locale: Locale
): SpreadDefinition => {
  const data = SPREADS[spread];
  const isCn = locale === "zh-CN";
  const positionLabels = isCn ? data.positionLabels_cn : data.positionLabels_en;

  return {
    id: data.id,
    name: isCn ? data.name_cn : data.name_en,
    description: isCn ? data.description_cn : data.description_en,
    cardCount: data.cardCount,
    layoutType: data.layoutType,
    positions: localizePositions(data.positions, positionLabels),
    layoutOffset: data.layoutOffset,
    labels: isCn ? data.labels_cn : data.labels_en,
    cardPools: data.cardPools,
    cardSize: data.cardSize,
    icon: data.icon,
    interpretationInstruction: isCn
      ? data.interpretationInstruction_cn
      : data.interpretationInstruction_en,
    defaultQuestions: isCn ? data.defaultQuestions_cn : data.defaultQuestions_en,
  };
};
