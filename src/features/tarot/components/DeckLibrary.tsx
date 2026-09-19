import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CardPoolType } from "@/features/tarot/types";
import {
  getDeckForPool,
  CARD_ASPECT_CLASS,
} from "@/features/tarot/constants/cards";
import RitualCard from "./RitualCard";
import { useTranslation } from "react-i18next";

interface DeckLibraryProps {
  selectedCardId: number | null;
  isMobile: boolean;
  isTablet: boolean;
  onCardFocus: (id: number | null) => void;
}

const DeckLibrary: React.FC<DeckLibraryProps> = ({
  selectedCardId,
  isMobile,
  isTablet,
  onCardFocus,
}) => {
  const { t } = useTranslation();
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<CardPoolType>("FULL");
  const isDesktopDetail = !isMobile && !isTablet;

  const categories: { id: CardPoolType; label: string }[] = [
    { id: "FULL", label: t("deck.categories.FULL") },
    { id: "MAJOR", label: t("deck.categories.MAJOR") },
    { id: "SUIT_WANDS", label: t("deck.categories.SUIT_WANDS") },
    { id: "SUIT_CUPS", label: t("deck.categories.SUIT_CUPS") },
    { id: "SUIT_SWORDS", label: t("deck.categories.SUIT_SWORDS") },
    { id: "SUIT_PENTACLES", label: t("deck.categories.SUIT_PENTACLES") },
  ];

  const filteredCards = useMemo(
    () => getDeckForPool(activeCategory),
    [activeCategory]
  );

  return (
    <div className="w-full pb-12 pt-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          animate={{
            opacity: selectedCardId === null ? 1 : 0.12,
            filter: selectedCardId === null ? "blur(0px)" : "blur(10px)",
          }}
          className={selectedCardId === null ? "pointer-events-auto" : "pointer-events-none"}
        >
          <h2 className="mb-8 text-center text-2xl text-white/80 font-cinzel tracking-[0.2em]">
            {t("deck.title")}
          </h2>

          <div className="-mx-4 mb-8 flex flex-wrap justify-center gap-2 border-b border-white/5 bg-black/80 px-4 py-4 backdrop-blur-md">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`border px-3 py-1.5 text-[10px] uppercase tracking-widest transition-all duration-300 md:text-xs ${
                  activeCategory === category.id
                    ? "border-white bg-white text-black"
                    : "border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-6">
          {filteredCards.map((card) => {
            const isDetailed = selectedCardId === card.id;
            const isHovered = hoveredCardId === card.id && selectedCardId === null;

            return (
              <div
                key={card.id}
                className={`flex justify-center ${CARD_ASPECT_CLASS}`}
              >
                <RitualCard
                  layoutId={`card-${card.id}`}
                  card={card}
                  isRevealed={true}
                  isDetailed={isDetailed}
                  isDesktopDetail={isDesktopDetail}
                  isHovered={isHovered}
                  onHover={setHoveredCardId}
                  onDetailClose={() => onCardFocus(null)}
                  onClick={isDetailed
                    ? (event) => event.stopPropagation()
                    : () => {
                        setHoveredCardId(null);
                        onCardFocus(card.id);
                      }}
                  width="w-full"
                  height={isDetailed ? "h-[100dvh]" : CARD_ASPECT_CLASS}
                  className={isDetailed ? "cursor-default" : ""}
                  style={{
                    position: isDetailed ? "fixed" : "relative",
                    inset: isDetailed ? 0 : "auto",
                    zIndex: isDetailed ? 10000 : "auto",
                  }}
                  animate={isDetailed
                    ? { opacity: 1, filter: "blur(0px)" }
                    : {
                        opacity: selectedCardId === null ? 1 : 0.12,
                        filter: selectedCardId === null ? "blur(0px)" : "blur(10px)",
                      }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeckLibrary;
