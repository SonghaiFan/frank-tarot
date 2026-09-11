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
import { TarotCard as TarotCardType, PickedCard } from "@/features/tarot/types";
import { getCardImageUrl } from "@/features/tarot/constants/cards";
import { getRomanNumeral } from "@/features/tarot/utils/getRomanNumeral";
import { useTranslation } from "react-i18next";
import { SILKY_EASE } from "@/shared/constants/ui";

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

const CARD_LAYOUT_TRANSITION = {
  type: "tween" as const,
  duration: 0.18,
  ease: [0.16, 1, 0.3, 1] as const,
};

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
  const sharedLayoutId = layoutId || `card-${card.id}`;

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

  const isPointerOverRef = React.useRef(false);

  // When the card flips to revealed while pointer is already over it, fire onHover immediately
  React.useEffect(() => {
    if (isRevealed && isPointerOverRef.current && !isDetailed) {
      onHover?.(card.id);
    }
  }, [isRevealed]); // eslint-disable-line react-hooks/exhaustive-deps

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
      layout={!isDetailed ? "position" : false}
      transition={{ layout: CARD_LAYOUT_TRANSITION }}
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
      onMouseEnter={() => {
        isPointerOverRef.current = true;
        !isDetailed && isRevealed && onHover?.(card.id);
      }}
      onMouseLeave={() => {
        isPointerOverRef.current = false;
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
          layoutId={!isDetailed ? sharedLayoutId : undefined}
          style={{ transformStyle: "preserve-3d" }}
          initial={false}
          animate={{
            rotateY: isRevealed ? 0 : 180,
          }}
          transition={{ layout: CARD_LAYOUT_TRANSITION, duration: 0.34, ease: "easeInOut" }}
        >
        {/* Front Face */}
        <div
          className={`absolute rounded-xs inset-0 overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] ${isDetailed ? "border border-white/15 bg-black" : "bg-white p-1"}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={`relative h-full w-full overflow-hidden ${isDetailed ? "bg-black" : "border border-black/80 bg-black"} ${isDetailed ? "flex flex-col md:flex-row" : "flex"}`}>
          {isDetailed ? (
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-neutral-950 md:flex-row">
              <div className="relative flex w-full items-center justify-center overflow-hidden border-b border-white/10 bg-black/80 px-6 py-8 md:w-[36%] md:border-b-0 md:border-r md:px-8 md:py-10">
                <img
                  src={getCardImageUrl(card.image)}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-125 object-cover opacity-20 blur-3xl pointer-events-none"
                />
                <div
                  className="relative z-10 flex w-full items-center justify-center"
                  onPointerMove={handleDetailPointerMove}
                  onPointerLeave={resetDetailTilt}
                >
                  <div className="absolute inset-x-[18%] bottom-[6%] h-[12%] rounded-full bg-black/60 blur-2xl opacity-80 pointer-events-none" />
                  <motion.div
                    className="relative w-full max-w-60 md:md:max-w-84 aspect-300/519"
                    layoutId={sharedLayoutId}
                    style={{
                      transformStyle: "preserve-3d",
                      rotateX: prefersReducedMotion ? 0 : smoothDetailTiltX,
                      rotateY: prefersReducedMotion ? 0 : smoothDetailTiltY,
                      willChange: "transform",
                    }}
                    transition={{ layout: CARD_LAYOUT_TRANSITION, duration: 0.18, ease: SILKY_EASE }}
                  >
                    <div
                      className="absolute rounded-xs inset-0 overflow-hidden bg-white p-1 shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
                      style={{ transform: "translateZ(24px)" }}
                    >
                      <div className="relative h-full w-full overflow-hidden border border-black/80 bg-neutral-950">
                        <img
                          src={getCardImageUrl(card.image)}
                          alt={card.nameEn}
                          loading="eager"
                          onLoad={() => setIsImageLoaded(true)}
                          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                          style={{ filter: imageFilter }}
                        />
                        {!isImageLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                          </div>
                        )}
                        <motion.div
                          aria-hidden
                          className="absolute inset-0 pointer-events-none mix-blend-screen"
                          style={{ background: detailSurface }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-black/40" />
                        <div className="absolute bottom-0 w-full p-4 text-center">
                          {getRomanNumeral(card.id) && (
                            <div className="mb-1 text-[10px] text-white/60 font-cinzel tracking-[0.2em]">
                              {getRomanNumeral(card.id)}
                            </div>
                          )}
                          <h2 className="mb-0.5 truncate text-sm text-white font-cinzel tracking-widest">
                            {primaryName}
                          </h2>
                          {(secondaryName || isReversed) && (
                            <p className="truncate text-[10px] text-neutral-400 font-serif">
                              {secondaryName}
                              {secondaryName && isReversed ? " " : ""}
                              {isReversed && (
                                <span className="ml-1 italic text-red-400/80 opacity-80">
                                  ({t("card.reversedShort")})
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden bg-neutral-950">
                <div className="flex h-full flex-col">
                  <div className="flex-none border-b border-white/5 px-6 pb-6 pt-8 text-center md:px-12 md:pb-8 md:pt-12">
                    {getRomanNumeral(card.id) && (
                      <div className="mb-2 text-sm md:text-base text-amber-50/60 font-cinzel tracking-[0.2em]">
                        {getRomanNumeral(card.id)}
                      </div>
                    )}
                    <h2 className="mb-3 text-3xl md:text-5xl text-amber-50/90 font-cinzel tracking-widest drop-shadow-md">
                      {primaryName}
                    </h2>
                    {(secondaryName || isReversed) && (
                      <p className="mb-5 text-sm md:text-lg text-neutral-400 font-serif tracking-wide">
                        {secondaryName}
                        {secondaryName && isReversed ? " " : ""}
                        {isReversed && (
                          <span className="ml-2 inline-block italic text-red-400/80 opacity-80">
                            ({t("card.reversedLong")})
                          </span>
                        )}
                      </p>
                    )}

                    {detailKeywords.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {detailKeywords.map((kw) => (
                          <span key={kw} className="rounded-sm border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] md:px-3 md:text-xs text-neutral-300 tracking-[0.15em] uppercase">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12 lg:p-14 overscroll-contain touch-pan-y">
                    <div className="mx-auto max-w-2xl space-y-8">
                      {(positiveMeaning || negativeMeaning) && (
                        <div>
                          <h4 className="mb-4 text-center text-[10px] text-neutral-500 uppercase tracking-[0.3em]">
                            {t("card.interpretationTitle")}
                          </h4>
                          <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed md:leading-loose text-justify tracking-wide">
                            {positiveMeaning && (
                              <span className="mb-2 block text-neutral-200">
                                <span className="mr-2 align-middle text-xs text-neutral-400">＋</span>
                                {positiveMeaning}
                              </span>
                            )}
                            {negativeMeaning && (
                              <span className="block text-neutral-400">
                                <span className="mr-2 align-middle text-xs text-neutral-500">－</span>
                                {negativeMeaning}
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      {descriptionContent && (
                        <div className="border-t border-white/5 pt-8">
                          <h4 className="mb-4 text-center text-[10px] text-neutral-500 uppercase tracking-[0.3em]">
                            {t("card.arcanaWisdom")}
                          </h4>
                          <p className={`text-sm md:text-base text-neutral-300 font-light leading-relaxed md:leading-loose text-justify tracking-wide ${isEnglish ? "italic" : ""}`}>
                            {descriptionContent}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Card View */
            <div className="relative h-full w-full overflow-hidden bg-neutral-950">
              <div className="absolute inset-0 overflow-hidden bg-neutral-950">
                <motion.img
                  src={getCardImageUrl(card.image)}
                  alt={card.nameEn}
                  loading={priority ? "eager" : "lazy"}
                  onLoad={() => setIsImageLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-700 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                  style={{ filter: imageFilter }}
                  initial={false}
                  animate={{
                    rotateZ: isReversed && !isDetailed ? 180 : 0,
                  }}
                  transition={{ duration: 0.34, ease: "easeInOut" }}
                />
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute  inset-0 bg-linear-to-t from-black/95 via-black/20 to-black/40" />
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
              </div>

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
        </div>

        {/* Back Face */}
        <div
          className={`absolute inset-0 overflow-hidden transition-all duration-300 ${isDetailed ? "border border-white/15 bg-black" : "bg-black"}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-neutral-950 ${isDetailed ? "" : "border border-black/80"}`}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
<div className="w-4 h-4 border border-white/10 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
          </div>
        </div>
        {!isDetailed && (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 z-10 border transition-all duration-300 ${
              isHovered
                ? "border-white/55 shadow-[0_0_24px_rgba(255,255,255,0.3),0_0_42px_rgba(255,255,255,0.12),inset_0_0_18px_rgba(255,255,255,0.08)]"
                : "border-white/0 shadow-none group-hover:border-white/55 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.3),0_0_42px_rgba(255,255,255,0.12),inset_0_0_18px_rgba(255,255,255,0.08)]"
            }`}
          />
        )}
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
