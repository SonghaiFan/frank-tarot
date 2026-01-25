import React from "react";
import { motion } from "motion/react";
import { SpreadType, TarotCard as TarotCardType, PickedCard } from "../types";
import { SILKY_EASE } from "../constants/ui";
import { SPREADS } from "../constants/spreads";
import TarotCard from "./TarotCard";

interface PickingSectionProps {
  spread: SpreadType;
  activeDeck: TarotCardType[];
  pickedCards: PickedCard[];
  isMobile: boolean;
  isTablet: boolean;
  hoveredCardId: number | null;
  onCardHover: (id: number | null) => void;
  onCardSelect: (card: TarotCardType) => void;
}

const PickingSection: React.FC<PickingSectionProps> = ({
  spread,
  activeDeck,
  pickedCards,
  isMobile,
  isTablet,
  hoveredCardId,
  onCardHover,
  onCardSelect,
}) => (
  <motion.div
    key="picking"
    className="relative w-full h-full flex items-center justify-center"
  >
    {/* Background Elements - Fade out on exit */}
    <motion.div
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center space-y-2 px-6 z-50">
        <p className="text-xs text-neutral-300">
          轻点任意卡牌，直到下方格子亮满（共 {SPREADS[spread].cardCount} 张）
        </p>
        <div className="flex justify-center gap-2 flex-wrap max-w-md mx-auto px-4">
          {Array.from({
            length: SPREADS[spread].cardCount,
          }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 border border-white/30 rotate-45 transition-all duration-500 ${i < pickedCards.length
                ? "bg-white scale-110"
                : "bg-transparent scale-90"
                }`}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute w-0 h-0 flex items-center justify-center top-1/2 left-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 240, ease: "linear", repeat: Infinity }}
      >
        {activeDeck.map((card, i) => {
          const isPicked = pickedCards.some((c) => c.id === card.id);
          if (isPicked) return null; // Don't render picked cards in the cloud

          // Deterministic random based on card ID
          const seed = card.id * 123.45;
          const r1 =
            Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
          const r2 =
            Math.cos(seed) * 10000 - Math.floor(Math.cos(seed) * 10000);
          const r3 =
            Math.sin(seed * 2) * 10000 - Math.floor(Math.sin(seed * 2) * 10000);

          // Donut distribution to avoid clumping in center
          let minRadius = 180;
          let maxRadius = 450;
          let stretchX = 1.4; // Fill horizontal space in landscape

          if (isMobile) {
            minRadius = 80;
            maxRadius = 180;
            stretchX = 1; // Square for portrait mobile
          } else if (isTablet) {
            minRadius = 140;
            maxRadius = 320;
            stretchX = 1.25;
          }

          // Square root of random for uniform area distribution, scaled to donut range
          const radius = Math.sqrt(r1) * (maxRadius - minRadius) + minRadius;
          const angle = r2 * 2 * Math.PI;

          const x = Math.cos(angle) * radius * stretchX;
          const y = Math.sin(angle) * radius;
          const randomRotate = r3 * 360;

          const floatDuration = 4 + (seed % 4);
          const floatY = 10 + (seed % 10);

          const cardWidth = isMobile ? "w-12" : isTablet ? "w-16" : "w-24";

          return (
            <TarotCard
              key={card.id}
              layoutId={`card-${card.id}`}
              card={card}
              isRevealed={false}
              isHovered={hoveredCardId === card.id}
              onHover={onCardHover}
              width={cardWidth}
              height="aspect-[300/519]"
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                rotate: randomRotate,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -floatY, 0],
              }}
              transition={{
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                y: {
                  duration: floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              onClick={() => onCardSelect(card)}
            />
          );
        })}
      </motion.div>
    </motion.div>

    {/* Slots - Persist on exit for layout transition */}
    <div className="fixed bottom-12 flex gap-3 justify-center w-full pointer-events-none z-50">
      {pickedCards.map((c) => (
        <TarotCard
          key={`slot-${c.id}`}
          layoutId={`card-${c.id}`}
          card={c}
          isRevealed={false}
          width={isMobile ? "w-12" : isTablet ? "w-16" : "w-24"}
          height="aspect-[300/519]"
          className="shadow-2xl"
        />
      ))}
    </div>
  </motion.div>
);

export default PickingSection;
