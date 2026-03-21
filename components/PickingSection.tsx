import React from "react";
import { motion } from "motion/react";
import { SpreadType, TarotCard as TarotCardType, PickedCard } from "../types";
import { SILKY_EASE } from "../constants/ui";
import { SPREADS } from "../constants/spreads";
import TarotCard from "./TarotCard";
import { useTranslation } from "react-i18next";

interface CloudCardRenderData {
  card: TarotCardType;
  x: number;
  y: number;
  randomRotate: number;
  cardWidth: string;
}

interface PickingCloudCardProps {
  card: TarotCardType;
  layoutId: string;
  isHovered: boolean;
  width: string;
  height: string;
  style: React.CSSProperties;
  onHover: (id: number | null) => void;
  onClick: () => void;
}

const PickingCloudCard: React.FC<PickingCloudCardProps> = React.memo(
  ({ card, layoutId, isHovered, width, height, style, onHover, onClick }) => {
    return (
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          ...style,
        }}
        className={`relative cursor-pointer group ${width} ${height}`}
        onMouseEnter={() => onHover(card.id)}
        onMouseLeave={() => onHover(null)}
        onClick={onClick}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isHovered ? 1.04 : 1, opacity: 1 }}
        transition={{ scale: { duration: 0.22, ease: SILKY_EASE }, opacity: { duration: 0.4 } }}
      >
        <motion.div
          className="w-full h-full relative"
          layoutId={layoutId}
          transition={{ layout: { type: "tween", duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 overflow-hidden bg-black border border-black/80">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "6px 6px",
              }}
            />
            <div className="w-4 h-4 border border-white/10 rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 z-10 border transition-all duration-200 ${
              isHovered
                ? "border-white/55 shadow-[0_0_18px_rgba(255,255,255,0.26)]"
                : "border-white/0"
            }`}
          />
        </motion.div>
      </motion.div>
    );
  }
);

PickingCloudCard.displayName = "PickingCloudCard";

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
}) => {
  const { t } = useTranslation();

  const pickedIdSet = React.useMemo(() => {
    return new Set(pickedCards.map((c) => c.id));
  }, [pickedCards]);

  const cloudCards = React.useMemo<CloudCardRenderData[]>(() => {
    let minRadius = 180;
    let maxRadius = 450;
    let stretchX = 1.4;

    if (isMobile) {
      minRadius = 80;
      maxRadius = 180;
      stretchX = 1;
    } else if (isTablet) {
      minRadius = 140;
      maxRadius = 320;
      stretchX = 1.25;
    }

    const cardWidth = isMobile ? "w-12" : isTablet ? "w-16" : "w-24";

    return activeDeck
      .filter((card) => !pickedIdSet.has(card.id))
      .map((card) => {
        const seed = card.id * 123.45;
        const r1 = Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
        const r2 = Math.cos(seed) * 10000 - Math.floor(Math.cos(seed) * 10000);
        const r3 =
          Math.sin(seed * 2) * 10000 - Math.floor(Math.sin(seed * 2) * 10000);

        const radius = Math.sqrt(r1) * (maxRadius - minRadius) + minRadius;
        const angle = r2 * 2 * Math.PI;

        return {
          card,
          x: Math.cos(angle) * radius * stretchX,
          y: Math.sin(angle) * radius,
          randomRotate: r3 * 360,
          cardWidth,
        };
      });
  }, [activeDeck, isMobile, isTablet, pickedIdSet]);

  return (
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
          {t("picking.instruction", { count: SPREADS[spread].cardCount })}
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
        {cloudCards.map(({ card, x, y, randomRotate, cardWidth }) => (
          <PickingCloudCard
            key={card.id}
            layoutId={`card-${card.id}`}
            card={card}
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
            onClick={() => onCardSelect(card)}
          />
        ))}
      </motion.div>
    </motion.div>

    {/* Slots - Persist on exit for layout transition */}
    <motion.div
      layoutRoot
      className="fixed bottom-12 flex gap-3 justify-center w-full pointer-events-none z-50"
    >
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
    </motion.div>
  </motion.div>
  );
};

export default PickingSection;
