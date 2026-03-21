import React, { useRef, useLayoutEffect, useState } from "react";
import { motion } from "motion/react";
import { PickedCard } from "../types";
import { useTranslation } from "react-i18next";

interface CardTooltipProps {
  x: number;
  y: number;
  isRevealed?: boolean;
  positionLabel?: string;
  card?: PickedCard;
}

const CardTooltip: React.FC<CardTooltipProps> = ({
  x,
  y,
  isRevealed = true,
  positionLabel,
  card,
}) => {
  const { t, i18n } = useTranslation();
  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language;
  const isEnglish = resolvedLanguage.startsWith("en");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });
  const keywords = isEnglish
    ? card?.keywordsEn?.slice(0, 6) || []
    : card?.keywords?.slice(0, 6) || [];
  const primaryName = isEnglish ? card?.nameEn : card?.nameCn;
  const secondaryName = isEnglish ? "" : card?.nameEn;

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      let newX = x;
      let newY = y;
      const padding = 10;

      // Check right edge
      if (newX + rect.width > window.innerWidth - padding) {
        newX = x - rect.width - 30; // Flip to left
      }

      // Check bottom edge
      if (newY + rect.height > window.innerHeight - padding) {
        newY = window.innerHeight - rect.height - padding;
      }

      // Check left edge
      if (newX < padding) {
        newX = padding;
      }

      // Check top edge
      if (newY < padding) {
        newY = padding;
      }

      setPos({ x: newX, y: newY });
    }
  }, [x, y, isRevealed, card, positionLabel, resolvedLanguage]);

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.9, x: 10, y: 10 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      className="bg-black/80 border border-white/10 rounded-md px-3 py-2.5 backdrop-blur-sm shadow-xl w-64 whitespace-normal"
    >
      <div className="space-y-1.5">
        {positionLabel && (
          <div className="text-[9px] uppercase tracking-[0.24em] text-white/50 flex items-center gap-2">
            <span className="h-px w-4 bg-white/20" />
            <span>{positionLabel}</span>
          </div>
        )}

        {isRevealed && card ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] text-white/70 tracking-[0.2em] uppercase font-light">
              <span className="text-white/80">{primaryName}</span>
              {secondaryName && (
                <span className="text-white/40">/ {secondaryName}</span>
              )}
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/80 bg-white/5 border border-white/10 rounded-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
            <p className="text-[9px] text-white/50 tracking-[0.18em] uppercase pt-0.5">
              {t("tooltip.clickForDetails")}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            <p className="text-[10px] text-white/80 tracking-[0.2em] uppercase font-light">
              {t("tooltip.clickToReveal")}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CardTooltip;
