import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CardPoolType, CardFaceStyle } from "@/features/tarot/types";
import { CARD_BACKS, CardBackId } from "@/features/tarot/constants/cardBacks";
import { CARD_FACE_STYLES, ORIGINAL_CARD_INSET_CLASS } from "@/features/tarot/constants/cardFaceStyles";
import {
  getDeckForPool,
  getCardImageUrl,
  CARD_ASPECT_CLASS,
} from "@/features/tarot/constants/cards";
import RitualCard from "./RitualCard";
import { useTranslation } from "react-i18next";
import CardBackSurface from "./CardBackSurface";

interface DeckLibraryProps {
  selectedCardId: number | null;
  isMobile: boolean;
  isTablet: boolean;
  onCardFocus: (id: number | null) => void;
  cardBackId: CardBackId;
  onCardBackChange: (id: CardBackId) => void;
  cardFaceStyle: CardFaceStyle;
  onCardFaceStyleChange: (style: CardFaceStyle) => void;
}

const DeckLibrary: React.FC<DeckLibraryProps> = ({
  selectedCardId,
  isMobile,
  isTablet,
  onCardFocus,
  cardBackId,
  onCardBackChange,
  cardFaceStyle,
  onCardFaceStyleChange,
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

          <section className="mb-14" aria-labelledby="card-face-title">
            <div className="mb-5 text-center">
              <h3 id="card-face-title" className="text-xs text-white/70 font-cinzel uppercase tracking-[0.28em]">
                {t("deck.cardFaces.title")}
              </h3>
              <p className="mt-2 text-xs text-neutral-500">
                {t("deck.cardFaces.subtitle")}
              </p>
            </div>
            <div className="mx-auto grid max-w-lg grid-cols-2 gap-4 sm:gap-8">
              {CARD_FACE_STYLES.map((styleOption) => {
                const isSelected = cardFaceStyle === styleOption.id;
                return (
                  <button
                    key={styleOption.id}
                    type="button"
                    onClick={() => onCardFaceStyleChange(styleOption.id)}
                    aria-pressed={isSelected}
                    className={`group relative text-left transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isSelected ? "scale-[1.02]" : "hover:-translate-y-1"
                    }`}
                  >
                    <div className={`relative ${CARD_ASPECT_CLASS} overflow-hidden border bg-neutral-950 p-1 transition-all duration-300 ${
                      isSelected
                        ? "border-amber-100/80 shadow-[0_0_24px_rgba(250,231,188,0.25)]"
                        : "border-white/10 group-hover:border-white/45"
                    }`}>
                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          src={getCardImageUrl(styleOption.previewImage, styleOption.id)}
                          alt={t(styleOption.nameKey)}
                          className={`object-cover ${
                            styleOption.id === "original"
                              ? `absolute ${ORIGINAL_CARD_INSET_CLASS}`
                              : "h-full w-full"
                          }`}
                        />
                      </div>
                      <div className={`pointer-events-none absolute inset-0 border transition-opacity ${
                        isSelected ? "border-amber-100/60 opacity-100" : "border-white/0 opacity-0 group-hover:opacity-100"
                      }`} />
                      {isSelected && (
                        <span className="absolute right-2 top-2 border border-amber-100/60 bg-black/75 px-1.5 py-1 text-[8px] text-amber-50 font-cinzel uppercase tracking-[0.14em] backdrop-blur-sm">
                          {t("deck.cardFaces.selected")}
                        </span>
                      )}
                    </div>
                    <span className="mt-3 block text-center text-[10px] text-white/75 font-cinzel uppercase tracking-[0.18em]">
                      {t(styleOption.nameKey)}
                    </span>
                    <span className="mt-1 block text-center text-[11px] text-neutral-500 leading-relaxed">
                      {t(styleOption.descriptionKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mb-14" aria-labelledby="card-back-title">
            <div className="mb-5 text-center">
              <h3 id="card-back-title" className="text-xs text-white/70 font-cinzel uppercase tracking-[0.28em]">
                {t("deck.cardBacks.title")}
              </h3>
              <p className="mt-2 text-xs text-neutral-500">
                {t("deck.cardBacks.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-6">
              {CARD_BACKS.map((cardBack, index) => {
                const isSelected = cardBackId === cardBack.id;
                return (
                  <button
                    key={cardBack.id}
                    type="button"
                    onClick={() => onCardBackChange(cardBack.id)}
                    aria-pressed={isSelected}
                    className={`group relative text-left transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isSelected ? "scale-[1.02]" : "hover:-translate-y-1"
                    } ${index === 0 ? "lg:col-start-2" : ""} ${
                      index === 3 ? "sm:col-start-2 md:col-start-auto" : ""
                    }`}
                  >
                    <div className={`relative ${CARD_ASPECT_CLASS} overflow-hidden border bg-black p-1 transition-all duration-300 ${
                      isSelected
                        ? "border-amber-100/80 shadow-[0_0_24px_rgba(250,231,188,0.25)]"
                        : "border-white/10 group-hover:border-white/45"
                    }`}>
                      <CardBackSurface cardBackId={cardBack.id} />
                      <div className={`pointer-events-none absolute inset-0 border transition-opacity ${
                        isSelected ? "border-amber-100/60 opacity-100" : "border-white/0 opacity-0 group-hover:opacity-100"
                      }`} />
                      {isSelected && (
                        <span className="absolute right-2 top-2 border border-amber-100/60 bg-black/65 px-1.5 py-1 text-[8px] text-amber-50 font-cinzel uppercase tracking-[0.14em] backdrop-blur-sm">
                          {t("deck.cardBacks.selected")}
                        </span>
                      )}
                    </div>
                    <span className="mt-3 block text-center text-[10px] text-white/75 font-cinzel uppercase tracking-[0.18em]">
                      {t(cardBack.nameKey)}
                    </span>
                    <span className="mt-1 block text-center text-[11px] text-neutral-500">
                      {t(cardBack.descriptionKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

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
                  cardBackId={cardBackId}
                  cardFaceStyle={cardFaceStyle}
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
