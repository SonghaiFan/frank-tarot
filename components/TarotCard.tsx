import React from "react";
import {
  motion,
  HTMLMotionProps,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { TarotCard as TarotCardType, PickedCard } from "../types";
import { getCardImageUrl } from "../constants/cards";
import { getRomanNumeral } from "../utils/getRomanNumeral";
import { useTranslation } from "react-i18next";
import { SILKY_EASE } from "../constants/ui";

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

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

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
  const prefersReducedMotion = useReducedMotion();
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

  const cardTiltX = useMotionValue(0);
  const cardTiltY = useMotionValue(0);
  const detailTiltX = useMotionValue(0);
  const detailTiltY = useMotionValue(0);

  const smoothCardTiltX = useSpring(cardTiltX, {
    stiffness: 220,
    damping: 24,
    mass: 0.7,
  });
  const smoothCardTiltY = useSpring(cardTiltY, {
    stiffness: 220,
    damping: 24,
    mass: 0.7,
  });
  const smoothDetailTiltX = useSpring(detailTiltX, {
    stiffness: 180,
    damping: 22,
    mass: 0.8,
  });
  const smoothDetailTiltY = useSpring(detailTiltY, {
    stiffness: 180,
    damping: 22,
    mass: 0.8,
  });

  const cardSheenAngle = useTransform(
    () => `${118 + smoothCardTiltY.get() * 2.8 - smoothCardTiltX.get() * 1.6}deg`
  );
  const cardSheenStart = useTransform(
    () => `${6 + smoothCardTiltY.get() * 0.8 - smoothCardTiltX.get() * 0.45}%`
  );
  const cardSheenLead = useTransform(
    () => `${26 + smoothCardTiltY.get() * 0.95 - smoothCardTiltX.get() * 0.5}%`
  );
  const cardSheenPeak = useTransform(
    () => `${44 + smoothCardTiltY.get() * 1.2 - smoothCardTiltX.get() * 0.65}%`
  );
  const cardSheenFade = useTransform(
    () => `${82 + smoothCardTiltY.get() * 1.15 - smoothCardTiltX.get() * 0.35}%`
  );
  const cardSheenStrength = useTransform(() =>
    clamp((Math.abs(smoothCardTiltX.get()) + Math.abs(smoothCardTiltY.get())) / 28, 0.14, 0.4)
  );
  const cardGlare = useMotionTemplate`linear-gradient(${cardSheenAngle}, rgba(255,255,255,0) ${cardSheenStart}, rgba(255,248,229,0.16) ${cardSheenLead}, rgba(255,244,214,${cardSheenStrength}) ${cardSheenPeak}, rgba(255,255,255,0.14) ${cardSheenFade}, rgba(255,255,255,0) 100%)`;

  const detailSheenAngle = useTransform(
    () => `${112 + smoothDetailTiltY.get() * 2.6 - smoothDetailTiltX.get() * 1.4}deg`
  );
  const detailSheenStart = useTransform(
    () => `${4 + smoothDetailTiltY.get() * 0.7 - smoothDetailTiltX.get() * 0.35}%`
  );
  const detailSheenLead = useTransform(
    () => `${24 + smoothDetailTiltY.get() * 0.95 - smoothDetailTiltX.get() * 0.45}%`
  );
  const detailSheenPeak = useTransform(
    () => `${40 + smoothDetailTiltY.get() * 1.15 - smoothDetailTiltX.get() * 0.55}%`
  );
  const detailSheenFade = useTransform(
    () => `${84 + smoothDetailTiltY.get() * 1.05 - smoothDetailTiltX.get() * 0.25}%`
  );
  const detailSheenStrength = useTransform(() =>
    clamp((Math.abs(smoothDetailTiltX.get()) + Math.abs(smoothDetailTiltY.get())) / 24, 0.16, 0.44)
  );
  const detailSurface = useMotionTemplate`linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 34%, rgba(0, 0, 0, 0.18) 100%), linear-gradient(${detailSheenAngle}, rgba(255,255,255,0) ${detailSheenStart}, rgba(255,248,230,0.18) ${detailSheenLead}, rgba(246,223,177,${detailSheenStrength}) ${detailSheenPeak}, rgba(255,255,255,0.16) ${detailSheenFade}, rgba(255,255,255,0) 100%)`;

  const resetCardTilt = React.useCallback(() => {
    cardTiltX.set(0);
    cardTiltY.set(0);
  }, [cardTiltX, cardTiltY]);

  const resetDetailTilt = React.useCallback(() => {
    detailTiltX.set(0);
    detailTiltY.set(0);
  }, [detailTiltX, detailTiltY]);

  const handleCardPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || isDetailed || event.pointerType !== "mouse") {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      cardTiltX.set((0.5 - py) * 15);
      cardTiltY.set((px - 0.5) * 18);
    },
    [cardTiltX, cardTiltY, isDetailed, prefersReducedMotion]
  );

  const handleDetailPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || event.pointerType !== "mouse") {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      detailTiltX.set((0.5 - py) * 12);
      detailTiltY.set((px - 0.5) * 15);
    },
    [detailTiltX, detailTiltY, prefersReducedMotion]
  );

  return (
    <motion.div
      layoutId={!isDetailed ? (layoutId || `card-${card.id}`) : undefined}
      layout={!isDetailed}
      style={{
        transformStyle: "preserve-3d",
        perspective: isDetailed ? "2200px" : "1400px",
        rotate: isHorizontal ? 90 : 0,
        touchAction: isDetailed ? "auto" : undefined,
        ...style,
      }}
      onClick={onClick}
      onPointerMove={handleCardPointerMove}
      onPointerLeave={resetCardTilt}
      onMouseEnter={() => !isDetailed && onHover?.(card.id)}
      onMouseLeave={() => {
        resetCardTilt();
        !isDetailed && onHover?.(null);
      }}
      className={`relative ${!isDetailed ? "cursor-pointer group" : ""} ${width} ${height} ${className}`}
      {...motionProps}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
          rotateX: prefersReducedMotion ? 0 : smoothCardTiltX,
          rotateY: prefersReducedMotion ? 0 : smoothCardTiltY,
          willChange: "transform",
        }}
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
                <div
                  className="w-[45%] md:w-full h-full flex items-center justify-center p-4 md:p-8 relative z-10"
                  onPointerMove={handleDetailPointerMove}
                  onPointerLeave={resetDetailTilt}
                >
                  <div className="absolute inset-x-8 bottom-3 md:bottom-10 h-16 md:h-28 rounded-full bg-amber-100/10 blur-3xl opacity-40 pointer-events-none" />

                  <motion.div
                    className="relative w-full max-w-[17rem] md:max-w-[24rem] aspect-[300/519] flex-none"
                    style={{
                      transformStyle: "preserve-3d",
                      rotateX: prefersReducedMotion ? 0 : smoothDetailTiltX,
                      rotateY: prefersReducedMotion ? 0 : smoothDetailTiltY,
                      willChange: "transform",
                    }}
                    transition={{ duration: 0.45, ease: SILKY_EASE }}
                  >
                    <div
                      className="absolute inset-x-[14%] bottom-[3%] h-[10%] rounded-full bg-black/60 blur-2xl opacity-80 pointer-events-none"
                      style={{ transform: "translateZ(2px) translateY(18px)" }}
                    />

                    <div
                      className="relative w-full h-full overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
                      style={{ transform: "translateZ(24px)" }}
                    >
                      <img
                        src={getCardImageUrl(card.image)}
                        alt={card.nameEn}
                        loading="eager"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: imageFilter }}
                      />
                      <motion.div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none mix-blend-screen"
                        style={{ background: detailSurface }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/92 via-black/10 to-black/25 pointer-events-none" />
                      <div className="absolute inset-2 md:inset-3 border border-white/20 pointer-events-none" />
                    </div>
                  </motion.div>
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
              <motion.div
                aria-hidden
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                animate={{
                  opacity: isHovered ? 0.95 : 0,
                  scale: isHovered ? 1 : 0.96,
                }}
                transition={{ duration: 0.35, ease: SILKY_EASE }}
                style={{ background: cardGlare }}
              />
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
