import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Download, RefreshCw, Volume2, Copy, Check } from "lucide-react";
import { SpreadType, PickedCard } from "../types";
import { SILKY_EASE } from "../constants/ui";
import { SPREADS } from "../constants/spreads";
import TarotCard from "./TarotCard";
import CardTooltip from "./CardTooltip";

interface ReadingSectionProps {
  spread: SpreadType;
  isMobile: boolean;
  isTablet: boolean;
  pickedCards: PickedCard[];
  revealedCardIds: Set<number>;
  onCardReveal: (id: number) => void;
  hoveredCardId: number | null;
  onCardHover: (id: number | null) => void;
  isThinking: boolean;
  thinkingKeywordIndex: number;
  question: string;
  readingText: string;
  readingAudioBuffer: AudioBuffer | null;
  isAudioPlaying: boolean;
  onReplayAudio: () => void;
  onDownload: () => void;
  onReset: () => void;
}

const ReadingSection: React.FC<ReadingSectionProps> = ({
  spread,
  isMobile,
  isTablet,
  pickedCards,
  revealedCardIds,
  onCardReveal,
  hoveredCardId,
  onCardHover,
  isThinking,
  thinkingKeywordIndex,
  question,
  readingText,
  readingAudioBuffer,
  isAudioPlaying,
  onReplayAudio,
  onDownload,
  onReset,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const spreadConfig = SPREADS[spread];
  const displayedCards = pickedCards.slice(0, spreadConfig.cardCount);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCardClick = (id: number) => {
    if (!revealedCardIds.has(id)) {
      onCardReveal(id);
    } else {
      setSelectedCardId(id);
      onCardHover(null);
    }
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPrompt = async () => {
    const cardsList = displayedCards
      .map((card, index) => {
        const positionLabel =
          spreadConfig.layoutType === "absolute"
            ? spreadConfig.positions?.[index]?.label
            : spreadConfig.labels?.[index];

        return `${index + 1}. ${positionLabel || "Card"}: ${card.nameEn} (${card.isReversed ? "Reversed" : "Upright"
          }) - ${card.keywords.join(", ")}`;
      })
      .join("\n");

    const prompt = `I did a tarot reading using the "${spreadConfig.name}" spread.

Question: ${question || "General Reading"}

Cards Drawn:
${cardsList}

Initial Interpretation:
${readingText}

Please provide a deeper, more detailed analysis of this reading, focusing on hidden connections between the cards and practical advice.`;

    try {
      await navigator.clipboard.writeText(prompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const allCardsRevealed = revealedCardIds.size === pickedCards.length;
  const hoveredCard =
    hoveredCardId !== null
      ? displayedCards.find((c) => c.id === hoveredCardId)
      : null;
  const hoveredCardIndex =
    hoveredCardId !== null
      ? displayedCards.findIndex((c) => c.id === hoveredCardId)
      : -1;
  const hoveredCardLabel =
    hoveredCardIndex >= 0
      ? spreadConfig.layoutType === "absolute"
        ? spreadConfig.positions?.[hoveredCardIndex]?.label
        : spreadConfig.labels?.[hoveredCardIndex]
      : undefined;

  const renderThinkingPhrase = () => {
    const phrases = [
      "Consulting the Stars...",
      "Weaving the Threads of Fate...",
      "Listening to the Whispers...",
      "Aligning with the Cosmos...",
    ];
    return phrases[thinkingKeywordIndex % phrases.length];
  };

  return (
    <motion.div
      key="reading-layout"
      className="flex flex-col items-center w-full max-w-7xl gap-8 md:gap-16"
      layout
    >
      <div
        className={`${spreadConfig.layoutType === "absolute" && !isMobile
          ? "relative w-full h-[70vh] md:h-[80vh] max-w-4xl lg:max-w-6xl mx-auto"
          : "flex flex-wrap justify-center items-center gap-6 md:gap-12"
          }`}
      >
        <AnimatePresence mode="popLayout">
          {displayedCards.map((card, index) => {
            const isHovered =
              hoveredCardId === card.id && selectedCardId === null;
            const position = spreadConfig.positions?.[index];

            const cardWidthClass = isMobile
              ? spreadConfig.cardSize.mobile
              : spreadConfig.cardSize.desktop;

            const absoluteStyle =
              spreadConfig.layoutType === "absolute" && !isMobile && position
                ? {
                  position: "absolute" as const,
                  left: typeof position.x === "number" ? `${position.x}%` : position.x,
                  top: typeof position.y === "number" ? `${position.y}%` : position.y,
                  transform: "translate(-50%, -50%)",
                  zIndex: isHovered ? 100 : position.zIndex || 5,
                  rotate: position.rotation || 0,
                }
                : undefined;

            const label =
              spreadConfig.layoutType === "absolute"
                ? position?.label
                : spreadConfig.labels?.[index];

            const labelPosition =
              spreadConfig.layoutType === "absolute" && !isMobile
                ? position?.labelPosition || "bottom"
                : "bottom";

            return (
              <TarotCard
                key={card.id}
                layoutId={`card-${card.id}`}
                card={card}
                isRevealed={revealedCardIds.has(card.id)}
                isHovered={isHovered}
                isHorizontal={!!position?.rotation && !isMobile}
                onHover={onCardHover}
                onClick={() => handleCardClick(card.id)}
                style={absoluteStyle}
                label={label}
                labelPosition={labelPosition}
                width={cardWidthClass}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  zIndex: isHovered ? 100 : absoluteStyle?.zIndex || "auto",
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Tooltip Portal */}
      {createPortal(
        <AnimatePresence>
          {hoveredCardId !== null && (
            <CardTooltip
              x={mousePos.x + 15}
              y={mousePos.y + 15}
              isRevealed={revealedCardIds.has(hoveredCardId)}
              card={hoveredCard || undefined}
              positionLabel={hoveredCardLabel}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="w-full max-w-4xl min-h-[150px] flex flex-col items-center justify-center text-center pb-12">
        <AnimatePresence mode="wait">
          {!allCardsRevealed ? (
            <motion.div
              key="reveal-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-neutral-400 text-sm tracking-widest uppercase"
            >
              翻开每一张卡牌以显示解读
            </motion.div>
          ) : isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-8 items-center w-full max-w-xl px-4"
            >
              <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={thinkingKeywordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-xs tracking-[0.3em] text-neutral-400 uppercase"
                  >
                    {renderThinkingPhrase()}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="text-neutral-500"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      .
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              id="reading-content"
              key="text-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: SILKY_EASE }}
              className="relative px-4 md:px-0 w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col items-center"
            >
              <div className="w-full overflow-y-auto overscroll-y-auto mb-8 pr-4 ">
                {question && (
                  <p className="text-xs text-neutral-600 mb-4 tracking-widest uppercase text-center sticky top-0 bg-black/90 backdrop-blur-sm py-2 z-10">
                    Reflecting on: "{question}"
                  </p>
                )}
                <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
                <div className="text-base md:text-xl leading-loose text-neutral-300 font-light font-serif tracking-wide mb-12 text-center">
                  {readingText.split("**").map((part, idx) =>
                    idx % 2 === 1 ? (
                      <strong key={idx} className="font-bold text-white/90">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center w-full">
                <div className="flex items-center justify-center gap-4 mb-8">
                  {readingAudioBuffer && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                      onClick={onReplayAudio}
                      disabled={isAudioPlaying}
                      className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-neutral-600 hover:text-white transition-colors group px-4 py-2 border border-neutral-800 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="重播解读音频"
                    >
                      <Volume2
                        size={14}
                        className={isAudioPlaying ? "animate-pulse" : ""}
                      />
                      REPLAY 再念一次
                    </motion.button>
                  )}

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                    onClick={onDownload}
                    className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-neutral-600 hover:text-white transition-colors group px-4 py-2 border border-neutral-800 hover:border-white/20"
                    title="下载解读图片"
                  >
                    <Download size={14} />
                    SAVE 保存图文
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.4 }}
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-neutral-600 hover:text-white transition-colors group px-4 py-2 border border-neutral-800 hover:border-white/20"
                    title="Copy prompt for other AI"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? "COPIED 复制成功" : "PROMPT 提示词"}
                  </motion.button>
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                  onClick={onReset}
                  className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-neutral-600 hover:text-white transition-colors group px-6 py-2 border border-transparent hover:border-white/10"
                >
                  <RefreshCw
                    size={12}
                    className="group-hover:rotate-180 transition-transform duration-700"
                  />
                  SEEK AGAIN 再次探索
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Card Detail Overlay */}
      {createPortal(
        <AnimatePresence>
          {selectedCardId !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
              style={{ zIndex: 9999 }}
              onClick={() => setSelectedCardId(null)}
            >
              <TarotCard
                card={pickedCards.find((c) => c.id === selectedCardId)!}
                isRevealed={true}
                isDetailed={true}
                width="w-full max-w-md md:max-w-5xl"
                height="h-[80vh] md:h-[75vh]"
                className="shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default ReadingSection;
