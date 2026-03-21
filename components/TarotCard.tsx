import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { TarotCard as TarotCardType, PickedCard } from "../types";
import { getCardImageUrl } from "../constants/cards";
import { getRomanNumeral } from "../utils/getRomanNumeral";
import { useTranslation } from "react-i18next";

interface TarotCardProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "onAnimationStart"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onDragOver"
    | "onLayoutAnimationStart"
    | "onLayoutAnimationComplete"
  > {
  card: TarotCardType | PickedCard;
  isRevealed?: boolean;
  isReversed?: boolean;
  isHorizontal?: boolean;
  isHovered?: boolean;
  isDetailed?: boolean;
  onHover?: (id: number | null) => void;
  label?: string;
  labelPosition?: "top" | "bottom" | "left" | "right";
  width?: string;
  height?: string;
  priority?: boolean;
}

const TarotCard: React.FC<TarotCardProps> = ({
  card,
  isRevealed = false,
  isReversed: propIsReversed,
  isHorizontal = false,
  isHovered = false,
  isDetailed = false,
  onHover,
  label,
  labelPosition = "bottom",
  width = "w-28",
  height = "aspect-[300/519]",
  className = "",
  style,
  onClick,
  layoutId,
  priority = false,
  ...motionProps
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isEnglish = locale === "en";
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const isReversed =
    propIsReversed ??
    ("isReversed" in card ? (card as PickedCard).isReversed : false);
  const primaryName = isEnglish ? card.nameEn : card.nameCn;
  const secondaryName = isEnglish ? "" : card.nameEn;
  const detailKeywords = isEnglish ? card.keywordsEn ?? [] : card.keywords;
  const positiveMeaning = isEnglish ? card.positiveEn : card.positive;
  const negativeMeaning = isEnglish ? card.negativeEn : card.negative;
  const descriptionContent = isEnglish ? card.descriptionEn : card.descriptionCn;

  const labelClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const imageFilter = isHovered || isDetailed
    ? "grayscale(0%) contrast(1.1) brightness(1.05)"
    : "grayscale(100%) contrast(1.2) brightness(0.9)";

  return (
    <motion.div
      layoutId={!isDetailed ? (layoutId || `card-${card.id}`) : undefined}
      layout={!isDetailed}
      style={{
        transformStyle: "preserve-3d",
        rotate: isHorizontal ? 90 : 0,
        touchAction: isDetailed ? "auto" : undefined,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => !isDetailed && onHover?.(card.id)}
      onMouseLeave={() => !isDetailed && onHover?.(null)}
      className={`relative ${!isDetailed ? "cursor-pointer group" : ""} ${width} ${height} ${className}`}
      {...motionProps}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        initial={{
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed && !isDetailed ? 180 : 0,
        }}
        animate={{
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed && !isDetailed ? 180 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 bg-black border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden ${isDetailed ? "flex flex-col md:flex-row" : "flex"}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {isDetailed ? (
            <>
              {/* Image & Header Section */}
              <div className="flex flex-row md:flex-col w-full md:w-[42%] h-[40%] md:h-full shrink-0 border-b md:border-b-0 md:border-r border-white/10 bg-black relative overflow-hidden">
                {/* Background Glow */}
                <img
                  src={getCardImageUrl(card.image)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-125 pointer-events-none"
                />

                {/* Card Art Panel */}
                <div className="w-[45%] md:w-full h-full flex items-center justify-center p-4 md:p-8 relative z-10">
                  <img
                    src={getCardImageUrl(card.image)}
                    alt={card.nameEn}
                    loading="eager"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    style={{ filter: imageFilter }}
                  />
                </div>

                {/* Mobile Meta (Visible next to art on mobile, hidden on desktop) */}
                <div className="flex-1 md:hidden flex flex-col justify-center px-4 py-6 bg-neutral-950/40 relative z-10 border-l border-white/5">
                  {getRomanNumeral(card.id) && (
                    <div className="text-[10px] mb-1 text-amber-50/60 font-cinzel tracking-[0.2em]">{getRomanNumeral(card.id)}</div>
                  )}
                  <h3 className="text-xl font-cinzel text-amber-50/90 tracking-widest leading-tight mb-2">{primaryName}</h3>
                  {(secondaryName || isReversed) && (
                    <p className="text-[10px] text-neutral-400 font-serif mb-4 uppercase tracking-widest">
                      {secondaryName}
                      {secondaryName && isReversed ? " " : ""}
                      {isReversed && (
                        <span className="text-red-400/80 ml-1 italic">
                          ({t("card.reversedShort")})
                        </span>
                      )}
                    </p>
                  )}
                  {detailKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {detailKeywords.slice(0, 3).map((kw) => (
                        <span key={kw} className="text-[7px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-neutral-400 uppercase tracking-tighter">{kw}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Info Section (Scrollable Area) */}
              <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden relative">
                {/* Desktop Header (Only md+) */}
                <div className="hidden md:flex flex-none flex-col items-center text-center px-12 pt-16 pb-8 border-b border-white/5">
                  {getRomanNumeral(card.id) && (
                    <div className="text-sm md:text-base mb-2 text-amber-50/60 font-cinzel tracking-[0.2em]">{getRomanNumeral(card.id)}</div>
                  )}
                  <h2 className="text-4xl md:text-5xl mb-3 text-amber-50/90 font-cinzel tracking-widest drop-shadow-md">{primaryName}</h2>
                  {(secondaryName || isReversed) && (
                    <p className="text-sm md:text-lg mb-6 text-neutral-400 font-serif tracking-wide">
                      {secondaryName}
                      {secondaryName && isReversed ? " " : ""}
                      {isReversed && (
                        <span className="text-red-400/80 opacity-80 inline-block ml-2 italic">
                          ({t("card.reversedLong")})
                        </span>
                      )}
                    </p>
                  )}

                  {detailKeywords.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                      {detailKeywords.map((kw) => (
                        <span key={kw} className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-neutral-300 tracking-[0.15em] uppercase">{kw}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shared Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-16 space-y-8 overscroll-contain touch-pan-y relative z-10 pointer-events-auto">
                  <div className="max-w-lg mx-auto space-y-8">
            
                    {(positiveMeaning || negativeMeaning) && (
                      <div className="pt-8 ">
                        <h4 className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] mb-4 text-center">
                          {t("card.interpretationTitle")}
                        </h4>
                        <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed md:leading-loose text-justify tracking-wide">
                          {positiveMeaning && (
                            <span className="block mb-2 text-neutral-200">
                              <span className="mr-2 text-xs text-neutral-400 align-middle">＋</span>
                              {positiveMeaning}
                            </span>
                          )}
                          {negativeMeaning && (
                            <span className="block text-neutral-400">
                              <span className="mr-2 text-xs text-neutral-500 align-middle">－</span>
                              {negativeMeaning}
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {descriptionContent && (
                      <div className="pt-8 border-t border-white/5">
                        <h4 className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] mb-4 text-center">
                          {t("card.arcanaWisdom")}
                        </h4>
                        <p className={`text-sm md:text-base text-neutral-300 font-light leading-relaxed md:leading-loose text-justify tracking-wide ${isEnglish ? 'italic' : ''}`}>
                          {descriptionContent}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Standard Card View */
            <div className="relative w-full h-full bg-neutral-900">
              <img
                src={getCardImageUrl(card.image)}
                alt={card.nameEn}
                loading={priority ? "eager" : "lazy"}
                onLoad={() => setIsImageLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-700 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                style={{ filter: imageFilter }}
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-black/40" />
              <div className="absolute inset-2 md:inset-3 border border-white/20 pointer-events-none" />

              <div className={`absolute bottom-0 w-full p-3 md:p-4 text-center transition-opacity duration-500 ${isRevealed ? "opacity-100" : "opacity-0"}`}>
                {getRomanNumeral(card.id) && (
                  <div className="text-[8px] md:text-[10px] mb-0.5 text-white/60 font-cinzel tracking-[0.2em]">{getRomanNumeral(card.id)}</div>
                )}
                <h2 className="text-[10px] md:text-sm mb-0.5 text-white font-cinzel tracking-widest truncate">{primaryName}</h2>
                {(secondaryName || isReversed) && (
                  <p className="text-[9px] md:text-[10px] text-neutral-400 font-serif truncate">
                    {secondaryName}
                    {secondaryName && isReversed ? " " : ""}
                    {isReversed && (
                      <span className="text-red-400/80 ml-1 italic opacity-80">
                        ({t("card.reversedShort")})
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 bg-neutral-950 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-white/40 transition-all duration-300"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
          <div className="absolute inset-1 border-[0.5px] border-white/5" />
          <div className="w-4 h-4 border border-white/10 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
        </div>
      </motion.div>

      {label && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`absolute text-[8px] md:text-[9px] tracking-[0.2em] text-neutral-600 uppercase whitespace-nowrap pointer-events-none ${labelClasses[labelPosition]}`}
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TarotCard;
