import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronUp } from "lucide-react";
import { SpreadType } from "../types";
import { SILKY_EASE } from "../constants/ui";
import { SPREADS } from "../constants/spreads";

interface InputSectionProps {
  question: string;
  spread: SpreadType | null;
  onQuestionChange: (value: string) => void;
  onSpreadChange: (spread: SpreadType) => void;
  onStartRitual: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isThinking?: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  question,
  spread,
  onQuestionChange,
  onSpreadChange,
  onStartRitual,
  isMobile,
  isTablet,
  isThinking = false,
}) => {
  const [isSpreadConfirmed, setIsSpreadConfirmed] = useState(!!spread);
  const [direction, setDirection] = useState(0); // 0: initial, 1: forward, -1: backward

  // -- 占位符逻辑 --
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setPlaceholderIndex(0);
    const interval = setInterval(
      () => setPlaceholderIndex((prev) => prev + 1),
      3000
    );
    return () => clearInterval(interval);
  }, [spread]);

  const getPlaceholder = () => {
    if (!spread) return "在此输入你心中的疑惑...";
    const questions = SPREADS[spread].defaultQuestions;
    return questions && questions.length > 0
      ? questions[placeholderIndex % questions.length]
      : "在此输入你心中的疑惑...";
  };

  // -- 核心动效变体 (滚动飞出效果) --
  const pageVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 100 : -100, // 前进时从下入，后退时从上入
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: SILKY_EASE },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -100 : 100, // 前进时向上出，后退时向下出
      opacity: 0,
      filter: "blur(4px)",
      transition: { duration: 0.6, ease: SILKY_EASE },
    }),
  };

  const handleConfirm = () => {
    setDirection(1); // 前进
    setIsSpreadConfirmed(true);
  };

  const handleBack = () => {
    setDirection(-1); // 后退
    setIsSpreadConfirmed(false);
  };

  return (
    // 修改说明：
    // 1. min-h-[80vh] + justify-center: 实现垂直居中
    // 2. items-center: 实现水平居中
    // 3. overflow-hidden: 保持动画边界整洁
    <div className="w-full max-w-3xl px-4 flex flex-col justify-center items-center min-h-[80vh] overflow-hidden relative">
      <AnimatePresence mode="wait" custom={direction}>
        {/* === PHASE 1: SPREAD SELECTION (选牌阵) === */}
        {!isSpreadConfirmed ? (
          <motion.div
            key="selection-phase"
            custom={direction}
            variants={pageVariants}
            initial={direction === 0 ? "center" : "enter"}
            animate="center"
            exit="exit"
            className="w-full flex flex-col gap-8 md:gap-16 items-center"
          >

            {/* Spread Grid */}
            <div className="w-full space-y-6">
              <Label text="Choose your spread" />
              <SubLabel text="牌阵决定解读角度：感情、决策、全局扫描、关系镜像…先选对牌阵再发问。" />

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {Object.values(SPREADS).map((s) => (
                  <SpreadCard
                    key={s.id}
                    item={s}
                    isSelected={spread === s.id}
                    onClick={() => onSpreadChange(s.id)}
                  />
                ))}
              </div>

              {/* Description Panel (Phase 1) */}
              <DescriptionPanel spread={spread} />

              {/* Confirm Button */}
              <ActionButton
                disabled={!spread}
                onClick={handleConfirm}
                text={spread ? "CONFIRM SPREAD 确认牌阵" : "SELECT A SPREAD"}
              />
            </div>
          </motion.div>
        ) : (
          /* === PHASE 2: QUESTION INPUT (提问) === */
          <motion.div
            key="question-phase"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            // 增加 pt-20，给顶部带有文字的箭头留出足够空间
            className="w-full flex flex-col items-center relative pt-20 px-4"
          >
            {/* Back Arrow with Hint */}
            <motion.button
              onClick={handleBack}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              // 使用 group 让 hover 状态同时作用于图标和文字
              className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 group cursor-pointer py-4"
            >
              <div className="text-white/30 group-hover:text-white/80 transition-colors duration-500">
                <ChevronUp size={24} />
              </div>
              <span className="text-[9px] tracking-[0.2em] text-white/20 group-hover:text-white/60 transition-colors duration-500 uppercase">
                RESELECT 选择牌阵
              </span>
            </motion.button>

            {/* === 上下文区域：展示选定的牌阵信息 === */}
            <div className="flex flex-col items-center gap-3 w-full max-w-lg">
              {spread && SPREADS[spread] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: SILKY_EASE }}
                  className="flex justify-center"
                >
                  <div className="text-white/90 h-14 w-14 relative flex items-center justify-center glow-sm">
                    {SPREADS[spread].icon(true)}
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col items-center gap-2">
                <SubLabel text={`已选择 "${spread}" 牌阵`} />
                {/* Description Panel (Phase 2 - Reduced Opacity) */}
                <div className="h-20 opacity-60 transform scale-95">
                  <DescriptionPanel spread={spread} />
                </div>
              </div>
            </div>

            {/* === 交互区域：提问 === */}
            {/* mt-8 md:mt-12 拉开与上方牌阵信息的距离，强调现在的重点是提问 */}
            <div className="w-full mt-8 md:mt-12 space-y-6 relative">
              <div className="text-center space-y-2 md:space-y-4">
                <p className="text-base md:text-lg text-neutral-200 font-serif tracking-wide">
                  请闭上双眼，深呼吸三次<br />
                  在心中默念你的困惑，保持虔诚与专注
                </p>
                <Label text="Enter your question" />
              </div>

              {/* Input Field Container */}
              <div className="relative w-full mt-6 group">
                <AnimatePresence mode="wait">
                  {!question && !isFocused && (
                    <motion.div
                      key={getPlaceholder()}
                      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <span className="text-lg md:text-4xl lg:text-5xl text-white/10 font-serif tracking-wide text-center px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        {getPlaceholder()}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  type="text"
                  autoComplete="off"
                  value={question}
                  onChange={(e) => onQuestionChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent border-b border-white/10 py-4 md:py-8 text-center text-xl md:text-4xl lg:text-5xl text-white focus:outline-none focus:border-white/40 transition-all duration-700 font-serif tracking-wide relative z-10"
                />
              </div>

              <div className="flex justify-center mt-10">
                <ActionButton
                  disabled={!spread || isThinking}
                  onClick={onStartRitual}
                  text={isThinking ? "DIVINING... 感知中" : "BEGIN RITUAL 开始洗牌"}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Helper Components ---

const Label = ({ text }: { text: string }) => (
  <label className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase block text-center">
    {text}
  </label>
);

const SubLabel = ({ text }: { text: string }) => (
  <p className="text-center text-xs text-neutral-400">{text}</p>
);

const DescriptionPanel = ({ spread }: { spread: SpreadType | null }) => (
  <div className="h-8 text-center">
    <AnimatePresence mode="wait">
      <motion.p
        key={spread || "none"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="text-xs text-white/40 font-light tracking-wide whitespace-pre-line"
      >
        {spread ? SPREADS[spread].description : ""}
      </motion.p>
    </AnimatePresence>
  </div>
);

const SpreadCard = ({
  item,
  isSelected,
  onClick,
}: {
  item: any;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative p-1 md:p-4 border transition-all duration-500 flex flex-col items-center gap-1 md:gap-4 group ${isSelected
        ? "border-white/60 bg-white/5"
        : "border-white/10 hover:border-white/30"
      }`}
  >
    <div className="flex gap-1 items-center justify-center h-6 w-6 md:h-8 md:w-8 relative">
      {item.icon(isSelected)}
    </div>
    <span
      className={`text-[9px] md:text-[10px] tracking-widest uppercase transition-colors ${isSelected ? "text-white" : "text-white/40"
        }`}
    >
      {item.id}
    </span>
    <AnimatePresence>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute top-1 right-1 md:top-2 md:right-2 text-white/60"
        >
          <Check size={10} className="md:w-3 md:h-3" />
        </motion.div>
      )}
    </AnimatePresence>
  </button>
);

const ActionButton = ({
  disabled,
  onClick,
  text,
}: {
  disabled: boolean;
  onClick: () => void;
  text: string;
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    className={`block mx-auto mt-16 px-6 py-2 border text-xs tracking-[0.3em] transition-all ${!disabled
        ? "bg-white/5 hover:bg-white/10 border-white/20 text-white cursor-pointer"
        : "bg-transparent border-white/5 text-white/20 cursor-not-allowed"
      }`}
  >
    {text}
  </motion.button>
);

export default InputSection;
