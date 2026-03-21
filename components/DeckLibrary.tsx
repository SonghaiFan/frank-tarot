import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CardPoolType } from "../types";
import { FULL_DECK, getDeckForPool } from "../constants/cards";
import TarotCard from "./TarotCard";
import { useTranslation } from "react-i18next";

interface DeckLibraryProps {
  onClose: () => void;
}

const DeckLibrary: React.FC<DeckLibraryProps> = (_props) => {
  const { t } = useTranslation();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<CardPoolType>("FULL");
  const categories: { id: CardPoolType; label: string }[] = [
    { id: "FULL", label: t("deck.categories.FULL") },
    { id: "MAJOR", label: t("deck.categories.MAJOR") },
    { id: "SUIT_WANDS", label: t("deck.categories.SUIT_WANDS") },
    { id: "SUIT_CUPS", label: t("deck.categories.SUIT_CUPS") },
    { id: "SUIT_SWORDS", label: t("deck.categories.SUIT_SWORDS") },
    { id: "SUIT_PENTACLES", label: t("deck.categories.SUIT_PENTACLES") },
  ];

  const selectedCard =
    selectedCardId !== null
      ? FULL_DECK.find((c) => c.id === selectedCardId)
      : null;

  const filteredCards = useMemo(() => {
    return getDeckForPool(activeCategory);
  }, [activeCategory]);
  return (
    <div className="w-full pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-cinzel text-center mb-8 tracking-[0.2em] text-white/80">
          {t("deck.title")}
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 top-24 z-30 py-4 bg-black/80 backdrop-blur-md -mx-4 px-4 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-3 py-1.5 text-[10px] md:text-xs tracking-widest uppercase border transition-all duration-300
                ${
                  activeCategory === cat.id
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-neutral-300"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="flex justify-center"
              onClick={() => setSelectedCardId(card.id)}
            >
              <TarotCard
                card={card}
                isRevealed={true}
                isHovered={hoveredCardId === card.id}
                onHover={setHoveredCardId}
                width="w-full"
                height="aspect-[300/519]"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card Detail Overlay */}
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
              card={selectedCard!}
              isRevealed={true}
              isDetailed={true}
              width="w-full max-w-md md:max-w-5xl"
              height="h-[80vh] md:h-[75vh]"
              className="shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckLibrary;
