import React from "react";
import { SpreadType, CardPoolType, Locale } from "../types";

export interface SpreadPosition {
  x: number | string; // Percentage (0-100) or specific unit (e.g. "50px")
  y: number | string; // Percentage (0-100) or specific unit (e.g. "50px")
  label: string;
  rotation?: number; // Degrees
  labelPosition?: "top" | "bottom" | "left" | "right";
  zIndex?: number;
}

export interface SpreadDefinition {
  id: SpreadType;
  name: string;
  description: string;
  cardCount: number;
  layoutType: "flex" | "absolute";
  positions?: SpreadPosition[]; // For absolute layouts
  labels?: string[]; // For flex layouts
  cardPools?: CardPoolType[]; // Specific pool for each position. Defaults to FULL if undefined.
  cardSize: {
    mobile: string; // Tailwind classes
    desktop: string; // Tailwind classes
  };
  icon: (isActive: boolean) => React.ReactNode;
  interpretationInstruction: string;
  defaultQuestions?: string[];
}

export const SPREADS: Record<SpreadType, SpreadDefinition> = {
  AUTO: {
    id: "AUTO",
    name: "AI Recommendation",
    description: "不确定选哪个？\n直接告诉我你的困惑，让我为你选择最合适的牌阵。",
    cardCount: 1, // Fallback/Placeholder
    layoutType: "flex",
    labels: ["Recommended"],
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
    interpretationInstruction: "Auto-selected spread.",
    defaultQuestions: [
      "帮我理清目前的混乱状况",
      "我应该如何做出选择？",
      "告诉我接下来会发生什么",
    ],
  },
  SINGLE: {
    id: "SINGLE",
    name: "One Card Draw",
    description:
      "这个牌阵是最简单直接的指引，只用到一张塔罗牌。\n建议避免单纯的“是/否”提问，而是用“我需要注意什么...”来获得更深层的当下指引。",
    cardCount: 1,
    layoutType: "flex",
    labels: ["Insight"],
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
    interpretationInstruction: `
The One Card Draw" .
- Card 1: The Insight regarding the specific topic.
Synthesis Goal: Do NOT answer with a simple 'Yes' or 'No'. Focus on the 'appropriateness' of the card drawn . Interpret the card as the specific attitude, perspective, or circumstance the seeker needs to be aware of right now to make the day or situation more rewarding .
    `,
    defaultQuestions: [
      "关于这件事，我需要留意什么?",
      "今天采取什么样的态度最有用?",
      "这个问题能带给我什么启示?",
    ],
  },
  THREE: {
    id: "THREE",
    name: "Classic Trinity",
    description:
      "这是很经典的三张塔罗牌的牌阵，分别代表“过去、现在、未来”。\n适合提问用来了解某个事件的时间线发展，或是探索某个问题的来龙去脉。",
    cardCount: 3,
    layoutType: "flex",
    labels: ["Past", "Present", "Future"],
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
    interpretationInstruction: `
The Three Card Spread" .
- Card 1: Past (Recent occurrences/influences) .
- Card 2: Present (Current happenings) .
- Card 3: Future (Situation unfolding) .
Synthesis Goal: Distill the interpretation to the most important events or influences within the timeframe . Connect the cards linearly: explain how the recent Past shaped the Present, and how the Present momentum flows into the Future.
    `,
    defaultQuestions: [
      "关于这段关系，我需要了解什么?",
      "我的工作在未来一段时间会有什么发展?",
      "这件事的过去、现在和未来是怎样的?",
    ],
  },
  FOUR: {
    id: "FOUR",
    name: "Simple Four Card",
    description:
      "这是用到4张塔罗牌的牌阵，具有非常清晰的逻辑结构：现状、阻碍（Cons）、助力（Pro）以及最终的答案。\n适合提问需要决策的情境，帮助你理清利弊得失，从而做出明智的选择。",
    cardCount: 4,
    layoutType: "flex",
    labels: ["Situation", "Cons", "Pro", "Answer"],
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
    interpretationInstruction: `
Simple Four Card Spread" .
- Card 1: The Situation (Current reality/Relationship to question) .
- Card 2: Cons (Obstacles/What is against you) .
- Card 3: Pro (Helpful influences/What supports you) .
- Card 4: The Answer (The Outcome) .
Synthesis Goal: Perform a strategic analysis. Contrast the Cons (Card 2) against the Pros (Card 3) to explain why the current Situation (Card 1) evolves into the final Answer (Card 4) .
    `,
    defaultQuestions: [
      "未来三个月我的新恋情会如何发展?",
      "关于目前的财务状况，我需要知道什么?",
      "我该如何做出这个决定?",
    ],
  },
  FIVE: {
    id: "FIVE",
    name: "Five Card Spread",
    description:
      "这是用到五张塔罗牌的牌阵，特色在于中间的“Hidden”牌，揭示了潜意识中你未察觉的驱动力。\n适合提问需要深入了解现状全貌的情境，帮助你发现隐藏的影响因素。",
    cardCount: 5,
    layoutType: "flex",
    labels: ["Past", "Present", "Hidden", "Advice", "Outcome"],
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
    interpretationInstruction: `
Five Card Spread" .
- Card 1: Past (Emotional/Intellectual shaping) .
- Card 2: Present (Significant current influence) .
- Card 3: What's Hidden (Unconscious driving forces/Unknown aspects - Crucial) .
- Card 4: Advice (Action required to overcome negative hidden aspects or capitalize on positive ones) .
- Card 5: Outcome (Possibility dependent on following Advice) .
Synthesis Goal: The pivot point is Card 3 (Hidden). Reveal this unknown factor to the seeker, then explain how following the Advice (Card 4) allows them to navigate from the Present to the desired Outcome .
    `,
    defaultQuestions: [
      "这件事背后有什么我没看到的隐性影响?",
      "我应该采取什么行动来改善现状?",
      "关于目前的处境，我需要知道什么?",
    ],
  },
  TIMELINE: {
    id: "TIMELINE",
    name: "Timeline Spread",
    description:
      "这是用到五张塔罗牌的牌阵，分别代表五个连续的时间节点（如未来5天、5周或5个月）。\n适合查看事情随时间的演变趋势，帮助你做好长期规划和准备。",
    cardCount: 5,
    layoutType: "flex",
    labels: ["Time 1", "Time 2", "Time 3", "Time 4", "Time 5"],
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
    interpretationInstruction: `
Timeline Spread" .
- Card 1: Time Unit 1 (The beginning/Current day) .
- Card 2: Time Unit 2 (Progression).
- Card 3: Time Unit 3 (Middle phase).
- Card 4: Time Unit 4 (Later phase).
- Card 5: Time Unit 5 (Culmination/Final outcome) .
Synthesis Goal: Read the cards as a chronological story or sequence of events . Identify the flow of energy—where it starts, how it develops, and where it peaks or resolves in the final unit.
    `,
    defaultQuestions: [
      "未来五个月我的工作情况会如何变化?",
      "接下来五天我需要注意什么?",
      "这个项目接下来的发展趋势如何?",
    ],
  },
  DIMENSION: {
    id: "DIMENSION",
    name: "Five Dimensions",
    description:
      "这是用到五种不同塔罗牌花色的牌阵，全面扫描生活的五个维度（情感、财务、思维、事业和灵性）。\n适合提问需要全方位了解当前生活状态的情境，帮助你找到各个维度的平衡点。",
    cardCount: 5,
    layoutType: "flex",
    labels: [
      "Romance (Cups)",
      "Finances (Pents)",
      "Mental (Swords)",
      "Career (Wands)",
      "Spiritual (Major)",
    ],
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
    interpretationInstruction: `
Mister Tarot's Five Dimensions Spread" .
- Card 1 (Cups): Relationships & Emotions .
- Card 2 (Pentacles): Finances, Assets & Physical Security .
- Card 3 (Swords): Mental State & Decision Making .
- Card 4 (Wands): Career, Energy & Work Effectiveness .
- Card 5 (Major Arcana): Spiritual Path & Higher Self .
Synthesis Goal: Provide a holistic life scan. Treat each card as a specific diagnosis for that 'dimension' of life. Check for harmony or conflict between the dimensions (e.g., career stress affecting relationships) .
    `,
    defaultQuestions: [
      "我下个月的生活重心应该放在哪里?",
      "全面扫描我目前的能量状态。",
      "我在生活各方面的平衡做得如何?",
    ],
  },
  CELTIC: {
    id: "CELTIC",
    name: "Celtic Cross",
    description:
      "这是经典的凯尔特十字牌阵，总共用到十张牌，提供对复杂问题的深入洞察。\n适合提问需要全面分析某个重要议题的情境，帮助你理清思路，找到解决方案。",
    cardCount: 10,
    layoutType: "absolute",
    positions: [
      // The Cross (Mister Tarot Geometry)
      { x: 35, y: 53, label: "1. Issue", zIndex: 10 },
      { x: 35, y: 53, label: "2. Obstacle", rotation: 90, zIndex: 20 },
      // Geometry based on Page 17 Diagram
      { x: 35, y: 20, label: "3. Past" }, // Top
      { x: 10, y: 53, label: "4. Present" }, // Left
      { x: 35, y: 85, label: "5. Near Future" }, // Bottom
      { x: 60, y: 53, label: "6. Far Future" }, // Right
      // The Staff
      { x: 85, y: 90, label: "7. Yourself" },
      { x: 85, y: 65, label: "8. Environment" },
      { x: 85, y: 40, label: "9. Hopes/Fears" },
      { x: 85, y: 15, label: "10. Outcome" },
    ],
    cardSize: {
      mobile: "w-12 aspect-[300/519]",
      desktop: "w-16 aspect-[300/519]",
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
    interpretationInstruction: `
Mister Tarot's Celtic Cross (Modified)" .
- The Cross: 1.Issue, 2.Obstacle (Crosses 1), 3.Past (Top), 4.Present (Left), 5.Near Future (Bottom), 6.Far Future (Right) .
- The Staff: 7.Yourself (Attitude), 8.Environment (Support), 9.Hopes/Fears, 10.Outcome .
Synthesis Goal: First, analyze the 'Cross' to see the event flow (Issue -> Past -> Present -> Future). Then use the 'Staff' to analyze the seeker's agency. Contrast Card 9 (Hopes/Fears) with Card 10 (Outcome). Note: Card 1 has an overriding effect on the whole spread .
    `,
    defaultQuestions: [
      "What should I be aware of regarding [complex situation]?",
      "我未来一年的职业发展全貌是怎样的?",
      "What is the outcome of my current path?",
    ],
  },
  RELATION: {
    id: "RELATION",
    name: "Relationship Spread",
    description:
      "这是需要是用到11张塔罗牌的牌阵，深入探索双方的潜意识、阻碍与优势。\n提问不限于情感关系，也适用于合作伙伴、亲子关系等。可以换位思考，帮助你理解对方的视角与需求。",
    cardCount: 11,
    layoutType: "absolute",
    positions: [
      // Left Column (You)
      { x: 20, y: 80, label: "1. You Now", labelPosition: "bottom" },
      { x: 20, y: 60, label: "2. Your Weakness", labelPosition: "right" },
      { x: 20, y: 40, label: "3. Your Strength", labelPosition: "right" },
      { x: 20, y: 20, label: "4. Your View", labelPosition: "top" },

      // Right Column (Them)
      { x: 80, y: 80, label: "5. Them Now", labelPosition: "bottom" },
      { x: 80, y: 60, label: "6. Their Weakness", labelPosition: "left" },
      { x: 80, y: 40, label: "7. Their Strength", labelPosition: "left" },
      { x: 80, y: 20, label: "8. Their View", labelPosition: "top" },

      // Center Column (Relationship)
      { x: 50, y: 80, label: "9. Relationship Now", labelPosition: "top" },
      { x: 50, y: 50, label: "10. Near Future", labelPosition: "top" },
      { x: 50, y: 20, label: "11. Outcome", labelPosition: "top" },
    ],
    cardSize: {
      mobile: "w-14 aspect-[300/519]",
      desktop: "w-20 aspect-[300/519]",
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
    interpretationInstruction: `
Mister Tarot's Relationship Spread" .
- Left Col (Seeker): 1.You Now, 2.Your Weakness, 3.Your Strength, 4.Your View .
- Right Col (Partner): 5.Them Now, 6.Their Weakness, 7.Their Strength, 8.Their View .
- Center (Bond): 9.Relationship Present, 10.Near Future, 11.Outcome .
Synthesis Goal: Compare parallel cards. Contrast 'Your View' (4) vs 'Their View' (8). Analyze how 'Your Weakness' (2) interacts with 'Their Strength' (7). Interpret the Center Column as the 'Third Entity'—the relationship itself .
    `,
    defaultQuestions: [
      "对方目前对这段关系最真实的看法是什么?",
      "我们未来的关系走向如何?",
      "在这段关系中，我们需要克服什么阻碍?",
    ],
  },
  COURT: {
    id: "COURT",
    name: "Court Card Behavior",
    description:
      "这是用到三张塔罗牌的牌阵，分别代表情境（小阿卡纳）、人格（宫廷牌）和原因（大阿卡纳）。\n适合提问用来了解自己在某类情境下的典型反应与行为模式，帮助你更好地认识自我。",
    cardCount: 3,
    layoutType: "flex",
    labels: ["Situation (Pip)", "Persona (Court)", "Cause (Major)"],
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
    interpretationInstruction: `
Court Card Spread" .
- Card 1 (Pip): The Situation (Daily life trigger) .
- Card 2 (Court): The Persona (The mask/role you adopt) .
- Card 3 (Major): The Cause (Deep psychological root) .
Synthesis Goal: Strictly follow this narrative formula: "When [Card 1 Situation] arises, you become [Card 2 Persona] because of [Card 3 Cause]." Focus on the psychological shift and the underlying root cause .
    `,
    defaultQuestions: [
      "我在面对压力时会变成什么样?",
      "为什么我在这种情况下会这样反应?",
      "我处理日常冲突的典型模式是什么?",
    ],
  },
  GOALS: {
    id: "GOALS",
    name: "Kicking Goals",
    description:
      "这是用到七张塔罗牌的牌阵，深入分析实现目标过程中的心理与行动要素。\n适合提问需要设定并实现具体目标的情境，帮助你识别关键的心理动力和提供实际的方法论。",
    cardCount: 7,
    layoutType: "absolute",
    positions: [
      // Column 1: Focus (1) & Hidden (2)
      { x: 20, y: 30, label: "1. Focus", labelPosition: "top", zIndex: 10 },
      {
        x: 20,
        y: 40,
        label: "2. Hidden",
        labelPosition: "bottom",
        rotation: 90,
        zIndex: 20,
      },

      // Column 2: Action (3) & Challenge (4)
      { x: 50, y: 30, label: "3. Action", labelPosition: "top", zIndex: 10 },
      {
        x: 50,
        y: 40,
        label: "4. Challenge",
        labelPosition: "bottom",
        rotation: 90,
        zIndex: 20,
      },

      // Column 3: Helpful (5) & Inspiration (6)
      { x: 80, y: 30, label: "5. Helpful", labelPosition: "top", zIndex: 10 },
      {
        x: 80,
        y: 40,
        label: "6. Inspiration",
        labelPosition: "bottom",
        rotation: 90,
        zIndex: 20,
      },

      // Footer: Outcome (7)
      { x: 50, y: 70, label: "7. Outcome", labelPosition: "bottom" },
    ],
    cardSize: {
      mobile: "w-14 aspect-[300/519]",
      desktop: "w-20 aspect-[300/519]",
    },
    // Updated Icon: Reflects the "Vertical card standing on/behind a Horizontal card" structure
    icon: (isActive) => (
      <div className="flex flex-col items-center justify-center w-6 h-6 gap-0.5">
        <div className="flex justify-between w-full px-0.5">
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className="relative w-1.5 h-3 flex items-center justify-center"
            >
              {/* Vertical Card (Back) */}
              <div
                className={`absolute top-0 w-1 h-2 rounded-[0.5px] ${isActive ? "bg-white/60" : "bg-white/20"
                  }`}
              />
              {/* Horizontal Card (Front/Bottom) - Represented as a wider, shorter block overlapping the bottom */}
              <div
                className={`absolute bottom-0 w-1.5 h-1 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/40"
                  }`}
              />
            </div>
          ))}
        </div>
        {/* Outcome Card */}
        <div
          className={`w-1 h-1.5 mt-0.5 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
            }`}
        />
      </div>
    ),
    interpretationInstruction: `
Mister Tarot's Kicking Goals Spread" .
- Top Row: 1.Focus (Present), 3.Action (To stay true), 5.Helpful Influence.
- Middle Row: 2.Hidden Self (What you need to know), 4.Challenge (To avoid), 6.Inspiration (Motivation).
- Bottom: 7.Outcome (after 1 year) .
Synthesis Goal: Reveal the psychological gap. Contrast the Conscious efforts (Top Row) with the Subconscious/Hidden factors (Middle Row). Explain how aligning these leads to the Outcome .
    `,
    defaultQuestions: [
      "我如何才能建立成功的副业?",
      "阻碍我达成目标的深层心理因素是什么?",
      "我需要知道什么才能实现这个愿望?",
    ],
  },
  YEARLY: {
    id: "YEARLY",
    name: "Yearly Wheel",
    description:
      "这是用到十五张塔罗牌的环形牌阵，预测未来一年的逐月运势。\n适合提问需要规划全年运势和重要时间节点的情境，帮助你把握节奏，优化决策。",
    cardCount: 15,
    layoutType: "absolute",
    positions: [
      // Center Cluster - Spread out slightly more (35->32, 65->68) to avoid overlap
      { x: 50, y: 50, label: "Trend" },
      { x: 32, y: 50, label: "Challenge" },
      { x: 68, y: 50, label: "Helpful" },

      // Outer Ring - Radius expanded to ~42% (was ~35%)
      // Top Hemisphere: labelPosition='bottom' (Default) to drop label into circle
      { x: 50, y: 8, label: "Month 1", labelPosition: "bottom" }, // 12 o'clock
      { x: 71, y: 13, label: "Month 2", labelPosition: "bottom" }, // 1 o'clock
      { x: 87, y: 29, label: "Month 3", labelPosition: "bottom" }, // 2 o'clock

      // Side:
      { x: 92, y: 50, label: "Month 4", labelPosition: "bottom" }, // 3 o'clock

      // Bottom Hemisphere: labelPosition='top' to raise label into circle
      { x: 87, y: 71, label: "Month 5", labelPosition: "bottom" }, // 4 o'clock
      { x: 71, y: 87, label: "Month 6", labelPosition: "top" }, // 5 o'clock
      { x: 50, y: 92, label: "Month 7", labelPosition: "top" }, // 6 o'clock
      { x: 29, y: 87, label: "Month 8", labelPosition: "top" }, // 7 o'clock
      { x: 13, y: 71, label: "Month 9", labelPosition: "bottom" }, // 8 o'clock

      // Side:
      { x: 8, y: 50, label: "Month 10", labelPosition: "bottom" }, // 9 o'clock

      // Top Hemisphere Return:
      { x: 13, y: 29, label: "Month 11", labelPosition: "bottom" }, // 10 o'clock
      { x: 29, y: 13, label: "Month 12", labelPosition: "bottom" }, // 11 o'clock
    ],
    cardSize: {
      mobile: "w-8 aspect-[300/519]",
      desktop: "w-12 aspect-[300/519]",
    },
    icon: (isActive) => (
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Center rectangle */}
        <div
          className={`w-1 h-1 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
            }`}
        />
        {/* Six outer rectangles forming a wheel */}
        {[...Array(6)].map((_, i) => {
          const angle = i * 60; // 0, 60, 120, 180, 240, 300 degrees
          return (
            <div
              key={i}
              className={`absolute w-1 h-2 rounded-[0.5px] ${isActive ? "bg-white/90" : "bg-white/30"
                }`}
              style={{
                transform: `rotate(${angle}deg) translateY(-7px)`,
              }}
            />
          );
        })}
      </div>
    ),
    interpretationInstruction: `
Mister Tarot's Yearly Spread" .
- Center: 1.Trend (Overall focus), 2.Challenge (Left), 3.Helpful (Right) .
- Outer Ring: Cards 4-15 represent Month 1 to Month 12 (Clockwise) .
Synthesis Goal: Start by defining the 'Trend' (Card 1) as the year's theme. Contrast the Challenge (2) and Help (3). Then, weave the monthly cards into a narrative of seasonal progression .
    `,
    defaultQuestions: [
      "我的年度运势如何?",
      "未来这一年我在哪些月份运气最好?",
      "今年我面临的最大挑战和机遇是什么?",
    ],
  },
};

const EN_SPREAD_OVERRIDES: Record<
  SpreadType,
  Pick<SpreadDefinition, "description" | "defaultQuestions">
> = {
  AUTO: {
    description:
      "Not sure which spread fits? Tell me what is weighing on you, and I will choose the most suitable spread for your question.",
    defaultQuestions: [
      "Help me make sense of the confusion I'm in right now.",
      "How should I approach this choice?",
      "What is likely to unfold next?",
    ],
  },
  SINGLE: {
    description:
      "A simple and direct one-card reading. Instead of asking a strict yes-or-no question, try asking what you need to notice, shift, or understand right now.",
    defaultQuestions: [
      "What do I need to pay attention to here?",
      "What attitude would serve me best today?",
      "What insight is this situation offering me?",
    ],
  },
  THREE: {
    description:
      "A classic three-card spread for Past, Present, and Future. It works well when you want to understand a timeline, trace the roots of a situation, or see where things are heading.",
    defaultQuestions: [
      "What do I need to understand about this relationship?",
      "How is my work likely to develop in the near future?",
      "What is the past, present, and future of this situation?",
    ],
  },
  FOUR: {
    description:
      "A clear decision-making spread that maps the current situation, what works against you, what helps you, and the final answer. Ideal when you need clarity before choosing.",
    defaultQuestions: [
      "How might this new romance develop over the next three months?",
      "What do I need to know about my finances right now?",
      "How should I make this decision?",
    ],
  },
  FIVE: {
    description:
      "A five-card spread with a hidden center card that reveals unseen motives, subconscious patterns, or missing factors. It is useful when you want the deeper truth beneath the surface.",
    defaultQuestions: [
      "What hidden influence am I missing in this situation?",
      "What action would improve my current circumstances?",
      "What do I most need to understand about where I am now?",
    ],
  },
  TIMELINE: {
    description:
      "A five-stage timeline spread that follows how a situation evolves across consecutive time points, such as days, weeks, or months. Helpful for planning and reading momentum over time.",
    defaultQuestions: [
      "How will my work situation change over the next five months?",
      "What should I watch for over the next five days?",
      "How is this project likely to develop from here?",
    ],
  },
  DIMENSION: {
    description:
      "A five-dimension life scan covering emotions, money, mind, career, and spirit. It gives a broad overview of your current balance and shows where attention is most needed.",
    defaultQuestions: [
      "What should be the center of my life next month?",
      "Give me a full scan of my current energy.",
      "How balanced are the different areas of my life right now?",
    ],
  },
  CELTIC: {
    description:
      "The classic Celtic Cross uses ten cards to examine a complex issue in depth. It is ideal when you need a comprehensive view of a major situation, along with its hidden pressures and likely outcome.",
    defaultQuestions: [
      "What should I be aware of in this complex situation?",
      "What does the bigger picture of my career look like over the next year?",
      "What is the outcome of the path I am on now?",
    ],
  },
  RELATION: {
    description:
      "An eleven-card relationship spread that explores both sides of a connection, including hidden needs, strengths, blind spots, and the direction of the bond itself. It works for romance, family, friendship, or partnership.",
    defaultQuestions: [
      "What is their truest feeling about this relationship right now?",
      "Where is our relationship heading?",
      "What obstacle do we need to overcome together?",
    ],
  },
  COURT: {
    description:
      "A three-card behavior pattern spread that reveals the situation, the role or persona you adopt, and the deeper cause behind it. It helps you understand your habitual reactions more clearly.",
    defaultQuestions: [
      "What do I become when I am under pressure?",
      "Why do I react this way in this kind of situation?",
      "What is my usual pattern when handling everyday conflict?",
    ],
  },
  GOALS: {
    description:
      "A seven-card spread for goals, ambition, and execution. It highlights both the visible actions and the hidden psychological dynamics involved in making something real.",
    defaultQuestions: [
      "How can I build a successful side business?",
      "What deep psychological factor is blocking my goal?",
      "What do I need to understand in order to make this wish real?",
    ],
  },
  YEARLY: {
    description:
      "A fifteen-card wheel spread for the year ahead, including the central theme, major challenge, support, and a month-by-month forecast. Best for long-range planning and timing.",
    defaultQuestions: [
      "What does my year ahead look like?",
      "Which months of the coming year will be the luckiest for me?",
      "What are the biggest challenge and opportunity I will face this year?",
    ],
  },
};

const ZH_SPREAD_OVERRIDES: Record<
  SpreadType,
  Pick<
    SpreadDefinition,
    "name" | "interpretationInstruction" | "labels" | "positions"
  >
> = {
  AUTO: {
    name: "AI 推荐",
    labels: ["推荐牌阵"],
    interpretationInstruction: "自动推荐牌阵。",
  },
  SINGLE: {
    name: "单张指引",
    labels: ["核心启示"],
    interpretationInstruction: `
单张牌阵。
- 牌 1：当下最重要的核心提示。
综合目标：不要给简单的是/否结论。请解释这张牌所指向的关键态度、注意事项或行动方向，并与求问者问题直接关联。
    `,
  },
  THREE: {
    name: "经典三张",
    labels: ["过去", "现在", "未来"],
    interpretationInstruction: `
三张时间线牌阵。
- 牌 1：过去（近期影响与成因）。
- 牌 2：现在（当前主导能量）。
- 牌 3：未来（趋势与发展方向）。
综合目标：用连贯叙事说明过去如何塑造现在，以及现在如何推动未来。
    `,
  },
  FOUR: {
    name: "简易四张",
    labels: ["现状", "阻碍", "助力", "答案"],
    interpretationInstruction: `
四张决策牌阵。
- 牌 1：现状。
- 牌 2：阻碍（Cons）。
- 牌 3：助力（Pro）。
- 牌 4：结果/答案。
综合目标：对比阻碍与助力，解释现状为何会走向当前结果，并给出可执行建议。
    `,
  },
  FIVE: {
    name: "五张深入",
    labels: ["过去", "现在", "隐藏", "建议", "结果"],
    interpretationInstruction: `
五张深入牌阵。
- 牌 1：过去。
- 牌 2：现在。
- 牌 3：隐藏因素（关键）。
- 牌 4：建议行动。
- 牌 5：结果可能。
综合目标：聚焦第 3 张隐藏因素，说明其如何影响现状，并指出遵循建议后的变化路径。
    `,
  },
  TIMELINE: {
    name: "时间轴",
    labels: ["阶段 1", "阶段 2", "阶段 3", "阶段 4", "阶段 5"],
    interpretationInstruction: `
时间轴牌阵。
- 牌 1-5：依次对应连续时间阶段（如未来 5 天/周/月）。
综合目标：按时间顺序解读能量如何演进，指出转折点、风险点与关键机会。
    `,
  },
  DIMENSION: {
    name: "五维扫描",
    labels: ["情感（圣杯）", "财务（星币）", "思维（宝剑）", "事业（权杖）", "灵性（大阿卡纳）"],
    interpretationInstruction: `
五维生活扫描牌阵。
- 牌 1：情感。
- 牌 2：财务。
- 牌 3：思维。
- 牌 4：事业。
- 牌 5：灵性。
综合目标：给出整体平衡评估，指出最需要优先调整的维度与现实行动。
    `,
  },
  CELTIC: {
    name: "凯尔特十字",
    positions: [
      { x: 35, y: 53, label: "1. 核心议题", zIndex: 10 },
      { x: 35, y: 53, label: "2. 阻碍", rotation: 90, zIndex: 20 },
      { x: 35, y: 20, label: "3. 过去" },
      { x: 10, y: 53, label: "4. 现在" },
      { x: 35, y: 85, label: "5. 近期未来" },
      { x: 60, y: 53, label: "6. 远期未来" },
      { x: 85, y: 90, label: "7. 你自己" },
      { x: 85, y: 65, label: "8. 环境" },
      { x: 85, y: 40, label: "9. 希望/恐惧" },
      { x: 85, y: 15, label: "10. 结果" },
    ],
    interpretationInstruction: `
凯尔特十字牌阵（10 张）。
- 核心：现状与挑战。
- 内圈：意识/潜意识、过去/未来。
- 外圈：自我、外在环境、希望与恐惧、最终趋势。
综合目标：先定义问题核心，再整合内外因素，形成完整的因果与走向判断。
    `,
  },
  RELATION: {
    name: "关系牌阵",
    positions: [
      { x: 20, y: 80, label: "1. 你当下", labelPosition: "bottom" },
      { x: 20, y: 60, label: "2. 你的弱点", labelPosition: "right" },
      { x: 20, y: 40, label: "3. 你的优势", labelPosition: "right" },
      { x: 20, y: 20, label: "4. 你的视角", labelPosition: "top" },
      { x: 80, y: 80, label: "5. 对方当下", labelPosition: "bottom" },
      { x: 80, y: 60, label: "6. 对方弱点", labelPosition: "left" },
      { x: 80, y: 40, label: "7. 对方优势", labelPosition: "left" },
      { x: 80, y: 20, label: "8. 对方视角", labelPosition: "top" },
      { x: 50, y: 80, label: "9. 关系现况", labelPosition: "top" },
      { x: 50, y: 50, label: "10. 近期发展", labelPosition: "top" },
      { x: 50, y: 20, label: "11. 结果", labelPosition: "top" },
    ],
    interpretationInstruction: `
关系牌阵（11 张）。
- 覆盖双方表层状态、深层需求、关系动力与未来方向。
综合目标：同时看见双方立场与互动模式，指出误区、潜力与可改善的沟通/行动策略。
    `,
  },
  COURT: {
    name: "宫廷行为模式",
    labels: ["情境（小阿卡纳）", "角色（宫廷牌）", "根因（大阿卡纳）"],
    interpretationInstruction: `
三张行为模式牌阵。
- 牌 1：情境。
- 牌 2：你呈现的角色/行为。
- 牌 3：背后真实驱动。
综合目标：揭示你在特定压力下的惯性反应，并给出可替代的更成熟应对方式。
    `,
  },
  GOALS: {
    name: "目标推进",
    positions: [
      { x: 20, y: 30, label: "1. 焦点", labelPosition: "top", zIndex: 10 },
      {
        x: 20,
        y: 40,
        label: "2. 隐藏面",
        labelPosition: "bottom",
        rotation: 90,
        zIndex: 20,
      },
      { x: 50, y: 30, label: "3. 行动", labelPosition: "top", zIndex: 10 },
      {
        x: 50,
        y: 40,
        label: "4. 挑战",
        labelPosition: "bottom",
        rotation: 90,
        zIndex: 20,
      },
      { x: 80, y: 30, label: "5. 助力", labelPosition: "top", zIndex: 10 },
      {
        x: 80,
        y: 40,
        label: "6. 灵感",
        labelPosition: "bottom",
        rotation: 90,
        zIndex: 20,
      },
      { x: 50, y: 70, label: "7. 结果", labelPosition: "bottom" },
    ],
    interpretationInstruction: `
七张目标实现牌阵。
- 上层：当下焦点、行动方向、助力。
- 中层：隐藏自我、挑战、灵感动机。
- 下层：一年后的结果。
综合目标：对照“显性努力”与“隐性心理”，说明怎样对齐两者以提升达成率。
    `,
  },
  YEARLY: {
    name: "年度轮盘",
    positions: [
      { x: 50, y: 50, label: "年度主轴" },
      { x: 32, y: 50, label: "挑战" },
      { x: 68, y: 50, label: "助力" },
      { x: 50, y: 8, label: "1 月", labelPosition: "bottom" },
      { x: 71, y: 13, label: "2 月", labelPosition: "bottom" },
      { x: 87, y: 29, label: "3 月", labelPosition: "bottom" },
      { x: 92, y: 50, label: "4 月", labelPosition: "bottom" },
      { x: 87, y: 71, label: "5 月", labelPosition: "bottom" },
      { x: 71, y: 87, label: "6 月", labelPosition: "top" },
      { x: 50, y: 92, label: "7 月", labelPosition: "top" },
      { x: 29, y: 87, label: "8 月", labelPosition: "top" },
      { x: 13, y: 71, label: "9 月", labelPosition: "bottom" },
      { x: 8, y: 50, label: "10 月", labelPosition: "bottom" },
      { x: 13, y: 29, label: "11 月", labelPosition: "bottom" },
      { x: 29, y: 13, label: "12 月", labelPosition: "bottom" },
    ],
    interpretationInstruction: `
年度轮盘牌阵（15 张）。
- 中央 3 张：年度主轴、挑战、助力。
- 外圈 12 张：按顺时针对应 1-12 月。
综合目标：先定全年主题，再串联每月节奏，指出关键月份与策略重点。
    `,
  },
};

export const getLocalizedSpread = (
  spread: SpreadType,
  locale: Locale
): SpreadDefinition => {
  const base = SPREADS[spread];

  if (locale === "en") {
    return {
      ...base,
      ...EN_SPREAD_OVERRIDES[spread],
    };
  }

  if (locale === "zh-CN") {
    return {
      ...base,
      ...ZH_SPREAD_OVERRIDES[spread],
    };
  }

  return {
    ...base,
  };
};
