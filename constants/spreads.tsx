import React from "react";
import { SpreadType, CardPoolType, Locale } from "../types";

export interface SpreadPosition {
  x: number | string; // Tailwind spacing units for absolute layouts, where 1 = 0.25rem
  y: number | string; // Tailwind spacing units for absolute layouts, where 1 = 0.25rem
  label: string;
  rotation?: number; // Degrees
  labelPosition?: "top" | "bottom" | "left" | "right";
  zIndex?: number;
}

type SpreadPositionLayout = Omit<SpreadPosition, "label">;

// Single source of truth — all locale variants co-located per spread.
export interface SpreadData {
  id: SpreadType;
  name_en: string;
  name_cn: string;
  description_en: string;
  description_cn: string;
  cardCount: number;
  layoutType: "flex" | "absolute";
  positions?: SpreadPositionLayout[]; // For absolute layouts — shared geometry
  layoutOffset?: { x: number; y: number }; // Tailwind spacing units, where 1 = 0.25rem
  positionLabels_en?: string[]; // For absolute layouts — English labels
  positionLabels_cn?: string[]; // For absolute layouts — Chinese labels
  labels_en?: string[]; // For flex layouts — English labels
  labels_cn?: string[]; // For flex layouts — Chinese labels
  cardPools?: CardPoolType[]; // Specific pool per position. Defaults to FULL if undefined.
  cardSize: {
    mobile: string; // Tailwind classes
    desktop: string; // Tailwind classes
  };
  icon: (isActive: boolean) => React.ReactNode;
  interpretationInstruction_en: string;
  interpretationInstruction_cn: string;
  defaultQuestions_en?: string[];
  defaultQuestions_cn?: string[];
}

// Consumer-facing shape returned by getLocalizedSpread — unchanged so callers need no updates.
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
  icon: (isActive: boolean) => React.ReactNode;
  interpretationInstruction: string;
  defaultQuestions?: string[];
}

export const SPREADS: Record<SpreadType, SpreadData> = {
  AUTO: {
    id: "AUTO",
    name_en: "AI Recommendation",
    name_cn: "AI 推荐",
    description_en:
      "Not sure which spread fits? Tell me what is weighing on you, and I will choose the most suitable spread for your question.",
    description_cn:
      "不确定选哪个？\n直接告诉我你的困惑，让我为你选择最合适的牌阵。",
    cardCount: 1,
    layoutType: "flex",
    labels_en: ["Recommended"],
    labels_cn: ["推荐牌阵"],
    cardSize: {
      mobile: "w-64 aspect-[300/519]",
      desktop: "w-80 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill={isActive ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          className={`w-5 h-5 transition-all duration-500 ${isActive
            ? "text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            : "text-white/40"
            }`}
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>
    ),
    interpretationInstruction_en: "Auto-selected spread.",
    interpretationInstruction_cn: "自动推荐牌阵。",
    defaultQuestions_en: [
      "Help me make sense of the confusion I'm in right now.",
      "How should I approach this choice?",
      "What is likely to unfold next?",
    ],
    defaultQuestions_cn: [
      "帮我理清目前的混乱状况",
      "我应该如何做出选择？",
      "告诉我接下来会发生什么",
    ],
  },
  SINGLE: {
    id: "SINGLE",
    name_en: "One Card Draw",
    name_cn: "单张指引",
    description_en:
      "A simple and direct one-card reading. Instead of asking a strict yes-or-no question, try asking what you need to notice, shift, or understand right now.",
    description_cn:
      `这个牌阵是最简单直接的指引，只用到一张塔罗牌。\n建议避免单纯的"是/否"提问，而是用"我需要注意什么..."来获得更深层的当下指引。`,
    cardCount: 1,
    layoutType: "flex",
    labels_en: ["Insight"],
    labels_cn: ["核心启示"],
    cardSize: {
      mobile: "w-64 aspect-[300/519]",
      desktop: "w-80 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div
        className={`w-3 h-5 border rounded-[1px] transition-all duration-300 ${isActive
          ? "bg-white/90 border-transparent shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          : "border-white/40"
          }`}
      />
    ),
    interpretationInstruction_en: `
The One Card Draw" .
- Card 1: The Insight regarding the specific topic.
Synthesis Goal: Do NOT answer with a simple 'Yes' or 'No'. Focus on the 'appropriateness' of the card drawn . Interpret the card as the specific attitude, perspective, or circumstance the seeker needs to be aware of right now to make the day or situation more rewarding .
    `,
    interpretationInstruction_cn: `
单张牌阵。
- 牌 1：当下最重要的核心提示。
综合目标：不要给简单的是/否结论。请解释这张牌所指向的关键态度、注意事项或行动方向，并与求问者问题直接关联。
    `,
    defaultQuestions_en: [
      "What do I need to pay attention to here?",
      "What attitude would serve me best today?",
      "What insight is this situation offering me?",
    ],
    defaultQuestions_cn: [
      "关于这件事，我需要留意什么?",
      "今天采取什么样的态度最有用?",
      "这个问题能带给我什么启示?",
    ],
  },
  THREE: {
    id: "THREE",
    name_en: "Classic Trinity",
    name_cn: "经典三张",
    description_en:
      "A classic three-card spread for Past, Present, and Future. It works well when you want to understand a timeline, trace the roots of a situation, or see where things are heading.",
    description_cn:
      `这是很经典的三张塔罗牌的牌阵，分别代表"过去、现在、未来"。\n适合提问用来了解某个事件的时间线发展，或是探索某个问题的来龙去脉。`,
    cardCount: 3,
    layoutType: "flex",
    labels_en: ["Past", "Present", "Future"],
    labels_cn: ["过去", "现在", "未来"],
    cardSize: {
      mobile: "w-28 aspect-[300/519]",
      desktop: "w-56 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-0.5 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-3.5 border rounded-[1px] transition-all duration-300 ${isActive ? "bg-white/90 border-transparent" : "border-white/40"
              } ${i === 1 ? "-translate-y-0.5" : "translate-y-0.5"}`}
          />
        ))}
      </div>
    ),
    interpretationInstruction_en: `
The Three Card Spread" .
- Card 1: Past (Recent occurrences/influences) .
- Card 2: Present (Current happenings) .
- Card 3: Future (Situation unfolding) .
Synthesis Goal: Distill the interpretation to the most important events or influences within the timeframe . Connect the cards linearly: explain how the recent Past shaped the Present, and how the Present momentum flows into the Future.
    `,
    interpretationInstruction_cn: `
三张时间线牌阵。
- 牌 1：过去（近期影响与成因）。
- 牌 2：现在（当前主导能量）。
- 牌 3：未来（趋势与发展方向）。
综合目标：用连贯叙事说明过去如何塑造现在，以及现在如何推动未来。
    `,
    defaultQuestions_en: [
      "What do I need to understand about this relationship?",
      "How is my work likely to develop in the near future?",
      "What is the past, present, and future of this situation?",
    ],
    defaultQuestions_cn: [
      "关于这段关系，我需要了解什么?",
      "我的工作在未来一段时间会有什么发展?",
      "这件事的过去、现在和未来是怎样的?",
    ],
  },
    COURT: {
    id: "COURT",
    name_en: "Court Card Behavior",
    name_cn: "宫廷行为模式",
    description_en:
      "A three-card behavior pattern spread that reveals the situation, the role or persona you adopt, and the deeper cause behind it. It helps you understand your habitual reactions more clearly.",
    description_cn:
      "这是用到三张塔罗牌的牌阵，分别代表情境（小阿卡纳）、人格（宫廷牌）和原因（大阿卡纳）。\n适合提问用来了解自己在某类情境下的典型反应与行为模式，帮助你更好地认识自我。",
    cardCount: 3,
    layoutType: "flex",
    labels_en: ["Situation (Pip)", "Persona (Court)", "Cause (Major)"],
    labels_cn: ["情境(小阿卡纳)", "角色(宫廷牌)", "根因(大阿卡纳)"],
    cardPools: ["MINOR_PIP", "COURT", "MAJOR"],
    cardSize: {
      mobile: "w-24 aspect-[300/519]",
      desktop: "w-36 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-1 items-end">
        <div
          className={`w-1 h-2  transition-all duration-300 ${isActive ? "bg-white/90" : "bg-white/30"
            }`}
        />
        <div
          className={`w-1 h-2.5 transition-all duration-300 ${isActive ? "bg-white/90" : "bg-white/30"
            }`}
        />
        <div
          className={`w-1 h-3 transition-all duration-300 ${isActive ? "bg-white/90" : "bg-white/30"
            }`}
        />
      </div>
    ),
    interpretationInstruction_en: `
Court Card Spread" .
- Card 1 (Pip): The Situation (Daily life trigger) .
- Card 2 (Court): The Persona (The mask/role you adopt) .
- Card 3 (Major): The Cause (Deep psychological root) .
Synthesis Goal: Strictly follow this narrative formula: "When [Card 1 Situation] arises, you become [Card 2 Persona] because of [Card 3 Cause]." Focus on the psychological shift and the underlying root cause .
    `,
    interpretationInstruction_cn: `
三张行为模式牌阵。
- 牌 1：情境。
- 牌 2：你呈现的角色/行为。
- 牌 3：背后真实驱动。
综合目标：揭示你在特定压力下的惯性反应，并给出可替代的更成熟应对方式。
    `,
    defaultQuestions_en: [
      "What do I become when I am under pressure?",
      "Why do I react this way in this kind of situation?",
      "What is my usual pattern when handling everyday conflict?",
    ],
    defaultQuestions_cn: [
      "我在面对压力时会变成什么样?",
      "为什么我在这种情况下会这样反应?",
      "我处理日常冲突的典型模式是什么?",
    ],
  },
  FOUR: {
    id: "FOUR",
    name_en: "Simple Four Card",
    name_cn: "决策四张",
    description_en:
      "A clear decision-making spread that maps the current situation, what works against you, what helps you, and the final answer. Ideal when you need clarity before choosing.",
    description_cn:
      "这是用到4张塔罗牌的牌阵，具有非常清晰的逻辑结构：现状、阻碍(Cons)、助力(Pro)以及最终的答案。\n适合提问需要决策的情境，帮助你理清利弊得失，从而做出明智的选择。",
    cardCount: 4,
    layoutType: "flex",
    labels_en: ["Situation", "Cons", "Pro", "Answer"],
    labels_cn: ["现状", "阻碍", "助力", "答案"],
    cardSize: {
      mobile: "w-24 aspect-[300/519]",
      desktop: "w-36 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-0.5 items-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-3 border rounded-[1px] transition-all duration-300 ${isActive ? "bg-white/90 border-transparent" : "border-white/40"
              }`}
          />
        ))}
      </div>
    ),
    interpretationInstruction_en: `
Simple Four Card Spread" .
- Card 1: The Situation (Current reality/Relationship to question) .
- Card 2: Cons (Obstacles/What is against you) .
- Card 3: Pro (Helpful influences/What supports you) .
- Card 4: The Answer (The Outcome) .
Synthesis Goal: Perform a strategic analysis. Contrast the Cons (Card 2) against the Pros (Card 3) to explain why the current Situation (Card 1) evolves into the final Answer (Card 4) .
    `,
    interpretationInstruction_cn: `
四张决策牌阵。
- 牌 1：现状。
- 牌 2：阻碍（Cons）。
- 牌 3：助力（Pro）。
- 牌 4：结果/答案。
综合目标：对比阻碍与助力，解释现状为何会走向当前结果，并给出可执行建议。
    `,
    defaultQuestions_en: [
      "How might this new romance develop over the next three months?",
      "What do I need to know about my finances right now?",
      "How should I make this decision?",
    ],
    defaultQuestions_cn: [
      "未来三个月我的新恋情会如何发展?",
      "关于目前的财务状况，我需要知道什么?",
      "我该如何做出这个决定?",
    ],
  },
  FIVE: {
    id: "FIVE",
    name_en: "Five Card Spread",
    name_cn: "五张深入",
    description_en:
      "A five-card spread with a hidden center card that reveals unseen motives, subconscious patterns, or missing factors. It is useful when you want the deeper truth beneath the surface.",
    description_cn:
      `这是用到五张塔罗牌的牌阵，特色在于中间的"Hidden"牌，揭示了潜意识中你未察觉的驱动力。\n适合提问需要深入了解现状全貌的情境，帮助你发现隐藏的影响因素。`,
    cardCount: 5,
    layoutType: "flex",
    labels_en: ["Past", "Present", "Hidden", "Advice", "Outcome"],
    labels_cn: ["过去", "现在", "隐藏", "建议", "结果"],
    cardSize: {
      mobile: "w-20 aspect-[300/519]",
      desktop: "w-32 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-0.5 items-end">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1.5 border rounded-[1px] transition-all duration-300 ${isActive ? "bg-white/90 border-transparent" : "border-white/40"
              } ${i === 2 ? "h-2.5" : "h-3"}`}
          />
        ))}
      </div>
    ),
    interpretationInstruction_en: `
Five Card Spread" .
- Card 1: Past (Emotional/Intellectual shaping) .
- Card 2: Present (Significant current influence) .
- Card 3: What's Hidden (Unconscious driving forces/Unknown aspects - Crucial) .
- Card 4: Advice (Action required to overcome negative hidden aspects or capitalize on positive ones) .
- Card 5: Outcome (Possibility dependent on following Advice) .
Synthesis Goal: The pivot point is Card 3 (Hidden). Reveal this unknown factor to the seeker, then explain how following the Advice (Card 4) allows them to navigate from the Present to the desired Outcome .
    `,
    interpretationInstruction_cn: `
五张深入牌阵。
- 牌 1：过去。
- 牌 2：现在。
- 牌 3：隐藏因素（关键）。
- 牌 4：建议行动。
- 牌 5：结果可能。
综合目标：聚焦第 3 张隐藏因素，说明其如何影响现状，并指出遵循建议后的变化路径。
    `,
    defaultQuestions_en: [
      "What hidden influence am I missing in this situation?",
      "What action would improve my current circumstances?",
      "What do I most need to understand about where I am now?",
    ],
    defaultQuestions_cn: [
      "这件事背后有什么我没看到的隐性影响?",
      "我应该采取什么行动来改善现状?",
      "关于目前的处境，我需要知道什么?",
    ],
  },
  TIMELINE: {
    id: "TIMELINE",
    name_en: "Timeline Spread",
    name_cn: "时间轴",
    description_en:
      "A five-stage timeline spread that follows how a situation evolves across consecutive time points, such as days, weeks, or months. Helpful for planning and reading momentum over time.",
    description_cn:
      "这是用到五张塔罗牌的牌阵，分别代表五个连续的时间节点（如未来5天、5周或5个月）。\n适合查看事情随时间的演变趋势，帮助你做好长期规划和准备。",
    cardCount: 5,
    layoutType: "flex",
    labels_en: ["Time 1", "Time 2", "Time 3", "Time 4", "Time 5"],
    labels_cn: ["阶段 1", "阶段 2", "阶段 3", "阶段 4", "阶段 5"],
    cardSize: {
      mobile: "w-20 aspect-[300/519]",
      desktop: "w-32 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-0.5 items-center justify-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1 h-3 border rounded-[1px] transition-all duration-300 ${isActive ? "bg-white/90 border-transparent" : "border-white/40"
              } ${isActive ? "ml-0.5" : ""}`}
          />
        ))}
        <div
          className={`absolute w-full h-px bg-white/20 top-1/2 left-0 -z-10`}
        />
      </div>
    ),
    interpretationInstruction_en: `
Timeline Spread" .
- Card 1: Time Unit 1 (The beginning/Current day) .
- Card 2: Time Unit 2 (Progression).
- Card 3: Time Unit 3 (Middle phase).
- Card 4: Time Unit 4 (Later phase).
- Card 5: Time Unit 5 (Culmination/Final outcome) .
Synthesis Goal: Read the cards as a chronological story or sequence of events . Identify the flow of energy—where it starts, how it develops, and where it peaks or resolves in the final unit.
    `,
    interpretationInstruction_cn: `
时间轴牌阵。
- 牌 1-5：依次对应连续时间阶段（如未来 5 天/周/月）。
综合目标：按时间顺序解读能量如何演进，指出转折点、风险点与关键机会。
    `,
    defaultQuestions_en: [
      "How will my work situation change over the next five months?",
      "What should I watch for over the next five days?",
      "How is this project likely to develop from here?",
    ],
    defaultQuestions_cn: [
      "未来五个月我的工作情况会如何变化?",
      "接下来五天我需要注意什么?",
      "这个项目接下来的发展趋势如何?",
    ],
  },
  DIMENSION: {
    id: "DIMENSION",
    name_en: "Five Dimensions",
    name_cn: "五维扫描",
    description_en:
      "A five-dimension life scan covering emotions, money, mind, career, and spirit. It gives a broad overview of your current balance and shows where attention is most needed.",
    description_cn:
      "这是用到五种不同塔罗牌花色的牌阵，全面扫描生活的五个维度（情感、财务、思维、事业和灵性）。\n适合提问需要全方位了解当前生活状态的情境，帮助你找到各个维度的平衡点。",
    cardCount: 5,
    layoutType: "flex",
    labels_en: [
      "Romance (Cups)",
      "Finances (Pents)",
      "Mental (Swords)",
      "Career (Wands)",
      "Spiritual (Major)",
    ],
    labels_cn: ["情感(圣杯)", "财务(星币)", "思维(宝剑)", "事业(权杖)", "灵性(大阿卡纳)"],
    cardPools: [
      "SUIT_CUPS",
      "SUIT_PENTACLES",
      "SUIT_SWORDS",
      "SUIT_WANDS",
      "MAJOR",
    ],
    cardSize: {
      mobile: "w-20 aspect-[300/519]",
      desktop: "w-32 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="relative w-6 h-6">
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = i * 72;
          return (
            <div
              key={i}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-2 border rounded-[1px] transition-all duration-300 ${isActive ? "bg-white/90 border-transparent" : "border-white/40"
                }`}
              style={{
                transform: `rotate(${angle}deg) translateY(-8px)`,
              }}
            />
          );
        })}
      </div>
    ),
    interpretationInstruction_en: `
Mister Tarot's Five Dimensions Spread" .
- Card 1 (Cups): Relationships & Emotions .
- Card 2 (Pentacles): Finances, Assets & Physical Security .
- Card 3 (Swords): Mental State & Decision Making .
- Card 4 (Wands): Career, Energy & Work Effectiveness .
- Card 5 (Major Arcana): Spiritual Path & Higher Self .
Synthesis Goal: Provide a holistic life scan. Treat each card as a specific diagnosis for that 'dimension' of life. Check for harmony or conflict between the dimensions (e.g., career stress affecting relationships) .
    `,
    interpretationInstruction_cn: `
五维生活扫描牌阵。
- 牌 1：情感。
- 牌 2：财务。
- 牌 3：思维。
- 牌 4：事业。
- 牌 5：灵性。
综合目标：给出整体平衡评估，指出最需要优先调整的维度与现实行动。
    `,
    defaultQuestions_en: [
      "What should be the center of my life next month?",
      "Give me a full scan of my current energy.",
      "How balanced are the different areas of my life right now?",
    ],
    defaultQuestions_cn: [
      "我下个月的生活重心应该放在哪里?",
      "全面扫描我目前的能量状态。",
      "我在生活各方面的平衡做得如何?",
    ],
  },
  CELTIC: {
    id: "CELTIC",
    name_en: "Celtic Cross",
    name_cn: "凯尔特十字",
    description_en:
      "The classic Celtic Cross uses ten cards to examine a complex issue in depth. It is ideal when you need a comprehensive view of a major situation, along with its hidden pressures and likely outcome.",
    description_cn:
      "这是经典的凯尔特十字牌阵，总共用到十张牌，提供对复杂问题的深入洞察。\n适合提问需要全面分析某个重要议题的情境，帮助你理清思路，找到解决方案。",
    cardCount: 10,
    layoutType: "absolute",
    layoutOffset: { x: 0, y: -27 },
    positions: [
      { x: -42, y: 0, zIndex: 10 },
      { x: -42, y: 0, rotation: 90, zIndex: 20 },
      { x: -42, y: -98 },
      { x: -118, y: 0 },
      { x: -42, y: 98 },
      { x: 34, y: 0 },
      { x: 84, y: 98 },
      { x: 84, y: 33 },
      { x: 84, y: -33 },
      { x: 84, y: -98 },
    ],
    positionLabels_en: [
      "1. Issue",
      "2. Obstacle",
      "3. Past",
      "4. Present",
      "5. Near Future",
      "6. Far Future",
      "7. Yourself",
      "8. Environment",
      "9. Hopes/Fears",
      "10. Outcome",
    ],
    positionLabels_cn: [
      "1. 核心议题",
      "2. 阻碍",
      "3. 过去",
      "4. 现在",
      "5. 近期未来",
      "6. 远期未来",
      "7. 你自己",
      "8. 环境",
      "9. 希望/恐惧",
      "10. 结果",
    ],
    cardSize: {
      mobile: "w-12 aspect-[300/519]",
      desktop: "w-28 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-1 items-center">
        <div className="relative w-4 h-4">
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
              }`}
          />
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-1 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
              }`}
          />
        </div>
        <div className="flex flex-col gap-px">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
                }`}
            />
          ))}
        </div>
      </div>
    ),
    interpretationInstruction_en: `
Mister Tarot's Celtic Cross (Modified)" .
- The Cross: 1.Issue, 2.Obstacle (Crosses 1), 3.Past (Top), 4.Present (Left), 5.Near Future (Bottom), 6.Far Future (Right) .
- The Staff: 7.Yourself (Attitude), 8.Environment (Support), 9.Hopes/Fears, 10.Outcome .
Synthesis Goal: First, analyze the 'Cross' to see the event flow (Issue -> Past -> Present -> Future). Then use the 'Staff' to analyze the seeker's agency. Contrast Card 9 (Hopes/Fears) with Card 10 (Outcome). Note: Card 1 has an overriding effect on the whole spread .
    `,
    interpretationInstruction_cn: `
凯尔特十字牌阵（10 张）。
- 核心：现状与挑战。
- 内圈：意识/潜意识、过去/未来。
- 外圈：自我、外在环境、希望与恐惧、最终趋势。
综合目标：先定义问题核心，再整合内外因素，形成完整的因果与走向判断。
    `,
    defaultQuestions_en: [
      "What should I be aware of in this complex situation?",
      "What does the bigger picture of my career look like over the next year?",
      "What is the outcome of the path I am on now?",
    ],
    defaultQuestions_cn: [
      "What should I be aware of regarding [complex situation]?",
      "我未来一年的职业发展全貌是怎样的?",
      "What is the outcome of my current path?",
    ],
  },
  RELATION: {
    id: "RELATION",
    name_en: "Relationship Spread",
    name_cn: "关系牌阵",
    description_en:
      "An eleven-card relationship spread that explores both sides of a connection, including hidden needs, strengths, blind spots, and the direction of the bond itself. It works for romance, family, friendship, or partnership.",
    description_cn:
      "这是需要用到11张塔罗牌的牌阵，深入探索双方的潜意识、阻碍与优势。\n提问不限于情感关系，也适用于合作伙伴、亲子关系等。可以换位思考，帮助你理解对方的视角与需求。",
    cardCount: 11,
    layoutType: "absolute",
    layoutOffset: { x: 0, y: -30 },
    positions: [
      { x: -80, y: 77, labelPosition: "bottom" },
      { x: -80, y: 26, labelPosition: "right" },
      { x: -80, y: -26, labelPosition: "right" },
      { x: -80, y: -77, labelPosition: "top" },
      { x: 80, y: 77, labelPosition: "bottom" },
      { x: 80, y: 26, labelPosition: "left" },
      { x: 80, y: -26, labelPosition: "left" },
      { x: 80, y: -77, labelPosition: "top" },
      { x: 0, y: 77, labelPosition: "top" },
      { x: 0, y: 0, labelPosition: "top" },
      { x: 0, y: -77, labelPosition: "top" },
    ],
    positionLabels_en: [
      "1. You Now",
      "2. Your Weakness",
      "3. Your Strength",
      "4. Your View",
      "5. Them Now",
      "6. Their Weakness",
      "7. Their Strength",
      "8. Their View",
      "9. Relationship Now",
      "10. Near Future",
      "11. Outcome",
    ],
    positionLabels_cn: [
      "1. 你当下",
      "2. 你的弱点",
      "3. 你的优势",
      "4. 你的视角",
      "5. 对方当下",
      "6. 对方弱点",
      "7. 对方优势",
      "8. 对方视角",
      "9. 关系现况",
      "10. 近期发展",
      "11. 结果",
    ],
    cardSize: {
      mobile: "w-14 aspect-[300/519]",
      desktop: "w-25 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex gap-0.5 justify-center items-end h-5">
        <div className="flex flex-col gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
                }`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-0.5 justify-center pb-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
                }`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
                }`}
            />
          ))}
        </div>
      </div>
    ),
    interpretationInstruction_en: `
Mister Tarot's Relationship Spread" .
- Left Col (Seeker): 1.You Now, 2.Your Weakness, 3.Your Strength, 4.Your View .
- Right Col (Partner): 5.Them Now, 6.Their Weakness, 7.Their Strength, 8.Their View .
- Center (Bond): 9.Relationship Present, 10.Near Future, 11.Outcome .
Synthesis Goal: Compare parallel cards. Contrast 'Your View' (4) vs 'Their View' (8). Analyze how 'Your Weakness' (2) interacts with 'Their Strength' (7). Interpret the Center Column as the 'Third Entity'—the relationship itself .
    `,
    interpretationInstruction_cn: `
关系牌阵（11 张）。
- 覆盖双方表层状态、深层需求、关系动力与未来方向。
综合目标：同时看见双方立场与互动模式，指出误区、潜力与可改善的沟通/行动策略。
    `,
    defaultQuestions_en: [
      "What is their truest feeling about this relationship right now?",
      "Where is our relationship heading?",
      "What obstacle do we need to overcome together?",
    ],
    defaultQuestions_cn: [
      "对方目前对这段关系最真实的看法是什么?",
      "我们未来的关系走向如何?",
      "在这段关系中，我们需要克服什么阻碍?",
    ],
  },

  GOALS: {
    id: "GOALS",
    name_en: "Kicking Goals",
    name_cn: "目标推进",
    description_en:
      "A seven-card spread for goals, ambition, and execution. It highlights both the visible actions and the hidden psychological dynamics involved in making something real.",
    description_cn:
      "这是用到七张塔罗牌的牌阵，深入分析实现目标过程中的心理与行动要素。\n适合提问需要设定并实现具体目标的情境，帮助你识别关键的心理动力和提供实际的方法论。",
    cardCount: 7,
    layoutType: "absolute",
    layoutOffset: { x: 0, y: -50 },
    positions: [
      { x: -80, y: -27, labelPosition: "top", zIndex: 10 },
      { x: -80, y: 0, labelPosition: "bottom", rotation: 90, zIndex: 20 },
      { x: 0, y: -27, labelPosition: "top", zIndex: 10 },
      { x: 0, y: 0, labelPosition: "bottom", rotation: 90, zIndex: 20 },
      { x: 80, y: -27, labelPosition: "top", zIndex: 10 },
      { x: 80, y: 0, labelPosition: "bottom", rotation: 90, zIndex: 20 },
      { x: 0, y: 80, labelPosition: "bottom" },
    ],
    positionLabels_en: [
      "1. Focus",
      "2. Hidden",
      "3. Action",
      "4. Challenge",
      "5. Helpful",
      "6. Inspiration",
      "7. Outcome",
    ],
    positionLabels_cn: [
      "1. 焦点",
      "2. 隐藏面",
      "3. 行动",
      "4. 挑战",
      "5. 助力",
      "6. 灵感",
      "7. 结果",
    ],
    cardSize: {
      mobile: "w-14 aspect-[300/519]",
      desktop: "w-28 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="flex flex-col items-center justify-center w-6 h-6 gap-0.5">
        <div className="flex justify-between w-full px-0.5">
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className="relative w-1.5 h-3 flex items-center justify-center"
            >
              <div
                className={`absolute top-0 w-1 h-2 rounded-[0.5px] ${isActive ? "bg-white/60" : "bg-white/20"
                  }`}
              />
              <div
                className={`absolute bottom-0 w-1.5 h-1 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/40"
                  }`}
              />
            </div>
          ))}
        </div>
        <div
          className={`w-1 h-1.5 mt-0.5 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
            }`}
        />
      </div>
    ),
    interpretationInstruction_en: `
Mister Tarot's Kicking Goals Spread" .
- Top Row: 1.Focus (Present), 3.Action (To stay true), 5.Helpful Influence.
- Middle Row: 2.Hidden Self (What you need to know), 4.Challenge (To avoid), 6.Inspiration (Motivation).
- Bottom: 7.Outcome (after 1 year) .
Synthesis Goal: Reveal the psychological gap. Contrast the Conscious efforts (Top Row) with the Subconscious/Hidden factors (Middle Row). Explain how aligning these leads to the Outcome .
    `,
    interpretationInstruction_cn: `
七张目标实现牌阵。
- 上层：当下焦点、行动方向、助力。
- 中层：隐藏自我、挑战、灵感动机。
- 下层：一年后的结果。
综合目标：对照"显性努力"与"隐性心理"，说明怎样对齐两者以提升达成率。
    `,
    defaultQuestions_en: [
      "How can I build a successful side business?",
      "What deep psychological factor is blocking my goal?",
      "What do I need to understand in order to make this wish real?",
    ],
    defaultQuestions_cn: [
      "我如何才能建立成功的副业?",
      "阻碍我达成目标的深层心理因素是什么?",
      "我需要知道什么才能实现这个愿望?",
    ],
  },
  YEARLY: {
    id: "YEARLY",
    name_en: "Yearly Wheel",
    name_cn: "年度轮盘",
    description_en:
      "A fifteen-card wheel spread for the year ahead, including the central theme, major challenge, support, and a month-by-month forecast. Best for long-range planning and timing.",
    description_cn:
      "这是用到十五张塔罗牌的环形牌阵，预测未来一年的逐月运势。\n适合提问需要规划全年运势和重要时间节点的情境，帮助你把握节奏，优化决策。",
    cardCount: 15,
    layoutType: "absolute",
    layoutOffset: { x: 0, y: -30 },
    positions: [
      { x: 0, y: 0 },
      { x: -42, y: 0 },
      { x: 42, y: 0 },
      { x: 0, y: -104, labelPosition: "bottom" },
      { x: 52, y: -92, labelPosition: "bottom" },
      { x: 90, y: -52, labelPosition: "bottom" },
      { x: 102, y: 0, labelPosition: "bottom" },
      { x: 90, y: 52, labelPosition: "bottom" },
      { x: 52, y: 92, labelPosition: "top" },
      { x: 0, y: 104, labelPosition: "top" },
      { x: -52, y: 92, labelPosition: "top" },
      { x: -90, y: 52, labelPosition: "bottom" },
      { x: -102, y: 0, labelPosition: "bottom" },
      { x: -90, y: -52, labelPosition: "bottom" },
      { x: -52, y: -92, labelPosition: "bottom" },
    ],
    positionLabels_en: [
      "Trend",
      "Challenge",
      "Helpful",
      "Month 1",
      "Month 2",
      "Month 3",
      "Month 4",
      "Month 5",
      "Month 6",
      "Month 7",
      "Month 8",
      "Month 9",
      "Month 10",
      "Month 11",
      "Month 12",
    ],
    positionLabels_cn: [
      "年度主轴",
      "挑战",
      "助力",
      "1 月",
      "2 月",
      "3 月",
      "4 月",
      "5 月",
      "6 月",
      "7 月",
      "8 月",
      "9 月",
      "10 月",
      "11 月",
      "12 月",
    ],
    cardSize: {
      mobile: "w-12 aspect-[300/519]",
      desktop: "w-26 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="relative w-6 h-6 flex items-center justify-center">
        {[
          "top-0 left-1/2 -translate-x-1/2",
          "top-[2px] right-[5px]",
          "top-1/2 right-0 -translate-y-1/2",
          "bottom-[2px] right-[5px]",
          "bottom-0 left-1/2 -translate-x-1/2",
          "bottom-[2px] left-[5px]",
          "top-1/2 left-0 -translate-y-1/2",
          "top-[2px] left-[5px]",
        ].map((position, i) => (
          <div
            key={i}
            className={`absolute ${position} w-1 h-1 rounded-[0.5px] ${
              isActive ? "bg-white/80" : "bg-white/30"
            }`}
          />
        ))}

        {[
          "top-[4px] left-1/2 -translate-x-1/2",
          "top-1/2 right-[4px] -translate-y-1/2",
          "bottom-[4px] left-1/2 -translate-x-1/2",
          "top-1/2 left-[4px] -translate-y-1/2",
        ].map((position, i) => (
          <div
            key={`major-${i}`}
            className={`absolute ${position} w-1 h-2 rounded-[0.5px] ${
              isActive ? "bg-white/55" : "bg-white/20"
            } ${i % 2 === 1 ? "rotate-90" : ""}`}
          />
        ))}

        <div className="relative flex items-center justify-center gap-[2px] z-10">
          <div
            className={`w-[3px] h-[8px] rounded-[1px] transition-all duration-300 ${
              isActive ? "bg-white/55" : "bg-white/20"
            }`}
          />
          <div
            className={`w-[3px] h-[10px] rounded-[1px] transition-all duration-300 ${
              isActive ? "bg-white/95" : "bg-white/40"
            }`}
          />
          <div
            className={`w-[3px] h-[8px] rounded-[1px] transition-all duration-300 ${
              isActive ? "bg-white/55" : "bg-white/20"
            }`}
          />
        </div>
      </div>
    ),
    interpretationInstruction_en: `
Mister Tarot's Yearly Spread" .
- Center: 1.Trend (Overall focus), 2.Challenge (Left), 3.Helpful (Right) .
- Outer Ring: Cards 4-15 represent Month 1 to Month 12 (Clockwise) .
Synthesis Goal: Start by defining the 'Trend' (Card 1) as the year's theme. Contrast the Challenge (2) and Help (3). Then, weave the monthly cards into a narrative of seasonal progression .
    `,
    interpretationInstruction_cn: `
年度轮盘牌阵（15 张）。
- 中央 3 张：年度主轴、挑战、助力。
- 外圈 12 张：按顺时针对应 1-12 月。
综合目标：先定全年主题，再串联每月节奏，指出关键月份与策略重点。
    `,
    defaultQuestions_en: [
      "What does my year ahead look like?",
      "Which months of the coming year will be the luckiest for me?",
      "What are the biggest challenge and opportunity I will face this year?",
    ],
    defaultQuestions_cn: [
      "我的年度运势如何?",
      "未来这一年我在哪些月份运气最好?",
      "今年我面临的最大挑战和机遇是什么?",
    ],
  },
};

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
