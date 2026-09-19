import React from "react";
import {
  HTMLMotionProps,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useTranslation } from "react-i18next";
import { CARD_ASPECT_CLASS, getCardImageUrl } from "@/features/tarot/constants/cards";
import { CardBackId } from "@/features/tarot/constants/cardBacks";
import { PickedCard, TarotCard as TarotCardData } from "@/features/tarot/types";
import { getRomanNumeral } from "@/features/tarot/utils/getRomanNumeral";
import { SILKY_EASE } from "@/shared/constants/ui";
import CardBackSurface from "./CardBackSurface";

interface RitualCardProps extends Omit<HTMLMotionProps<"div">, "onAnimationStart"> {
  card: PickedCard | TarotCardData;
  isRevealed: boolean;
  cardBackId: CardBackId;
  isDetailed: boolean;
  isDesktopDetail?: boolean;
  isHovered?: boolean;
  isHorizontal?: boolean;
  label?: string;
  labelPosition?: "top" | "bottom" | "left" | "right";
  width?: string;
  height?: string;
  onHover?: (id: number | null) => void;
  onDetailClose?: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const layoutTransition = {
  type: "tween" as const,
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1] as const,
};

const labelClasses = {
  top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
  bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  left: "right-full mr-2 top-1/2 -translate-y-1/2",
  right: "left-full ml-2 top-1/2 -translate-y-1/2",
};

const RitualCard: React.FC<RitualCardProps> = ({
  card,
  isRevealed,
  cardBackId,
  isDetailed,
  isDesktopDetail = false,
  isHovered = false,
  isHorizontal = false,
  label,
  labelPosition = "bottom",
  width = "w-full",
  height = CARD_ASPECT_CLASS,
  onHover,
  onDetailClose,
  className = "",
  style,
  onClick,
  layoutId,
  ...motionProps
}) => {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const isEnglish = i18n.language === "en";
  const artworkRef = React.useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const [hasImageError, setHasImageError] = React.useState(false);
  const scrollProgress = useMotionValue(0);
  const artworkScale = useTransform(scrollProgress, [0, 1], [1, 0.76]);
  const artworkY = useTransform(scrollProgress, [0, 1], [0, -72]);
  const artworkOpacity = useTransform(scrollProgress, [0, 1], [1, 0.16]);
  const blurAmount = useTransform(scrollProgress, [0, 1], [0, 18]);
  const artworkFilter = useMotionTemplate`blur(${blurAmount}px)`;
  const hintOpacity = useTransform(scrollProgress, [0, 0.18], [1, 0]);
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
    stiffness: 190,
    damping: 24,
    mass: 0.75,
  });
  const smoothDetailTiltY = useSpring(detailTiltY, {
    stiffness: 190,
    damping: 24,
    mass: 0.75,
  });
  const cardSheenAngle = useTransform(
    () => `${118 + smoothCardTiltY.get() * 2.8 - smoothCardTiltX.get() * 1.6}deg`
  );
  const cardSheenPeak = useTransform(
    () => `${44 + smoothCardTiltY.get() * 1.2 - smoothCardTiltX.get() * 0.65}%`
  );
  const cardSheenStrength = useTransform(() =>
    clamp(
      (Math.abs(smoothCardTiltX.get()) + Math.abs(smoothCardTiltY.get())) / 28,
      0.14,
      0.4
    )
  );
  const cardGlare = useMotionTemplate`linear-gradient(${cardSheenAngle}, rgba(255,255,255,0) 8%, rgba(255,248,229,0.16) 28%, rgba(255,244,214,${cardSheenStrength}) ${cardSheenPeak}, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0) 100%)`;
  const detailSheenAngle = useTransform(
    () => `${112 + smoothDetailTiltY.get() * 2.6 - smoothDetailTiltX.get() * 1.4}deg`
  );
  const detailSheenPeak = useTransform(
    () => `${40 + smoothDetailTiltY.get() * 1.15 - smoothDetailTiltX.get() * 0.55}%`
  );
  const detailSheenStrength = useTransform(() =>
    clamp(
      (Math.abs(smoothDetailTiltX.get()) + Math.abs(smoothDetailTiltY.get())) / 24,
      0.16,
      0.44
    )
  );
  const detailSurface = useMotionTemplate`linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 34%, rgba(0,0,0,0.16) 100%), linear-gradient(${detailSheenAngle}, rgba(255,255,255,0) 5%, rgba(255,248,230,0.17) 25%, rgba(246,223,177,${detailSheenStrength}) ${detailSheenPeak}, rgba(255,255,255,0.14) 84%, rgba(255,255,255,0) 100%)`;

  const primaryName = isEnglish ? card.nameEn : card.nameCn;
  const secondaryName = isEnglish ? "" : card.nameEn;
  const keywords = isEnglish ? card.keywordsEn ?? [] : card.keywords;
  const positiveMeaning = isEnglish ? card.positiveEn : card.positive;
  const negativeMeaning = isEnglish ? card.negativeEn : card.negative;
  const description = isEnglish ? card.descriptionEn : card.descriptionCn;
  const romanNumeral = getRomanNumeral(card.id);
  const isReversed = "isReversed" in card && card.isReversed;
  const [isSnappingToSpreadOrientation, setIsSnappingToSpreadOrientation] =
    React.useState(false);

  const requestDetailClose = React.useCallback(() => {
    if (!onDetailClose) return;

    if (isReversed) {
      // Restore the spread orientation on this frame, without rotating through it.
      setIsSnappingToSpreadOrientation(true);
      window.requestAnimationFrame(() => setIsSnappingToSpreadOrientation(false));
    }

    onDetailClose();
  }, [isReversed, onDetailClose]);

  const isArtworkReversed = isReversed && !isDetailed;
  const shouldSnapArtworkOrientation =
    isDetailed || isSnappingToSpreadOrientation;

  React.useLayoutEffect(() => {
    if (!isDetailed || isDesktopDetail) scrollProgress.set(0);
  }, [isDetailed, isDesktopDetail, scrollProgress]);

  React.useLayoutEffect(() => {
    if (!isDetailed || !isDesktopDetail) {
      detailTiltX.set(0);
      detailTiltY.set(0);
    }
  }, [detailTiltX, detailTiltY, isDetailed, isDesktopDetail]);

  React.useLayoutEffect(() => {
    if (isDetailed) {
      cardTiltX.set(0);
      cardTiltY.set(0);
    }
  }, [cardTiltX, cardTiltY, isDetailed]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isDesktopDetail) return;
    const { scrollTop, clientHeight } = event.currentTarget;
    scrollProgress.set(clamp(scrollTop / Math.max(1, clientHeight * 0.72), 0, 1));
  };

  const resetDetailTilt = React.useCallback(() => {
    detailTiltX.set(0);
    detailTiltY.set(0);
  }, [detailTiltX, detailTiltY]);

  const resetCardTilt = React.useCallback(() => {
    cardTiltX.set(0);
    cardTiltY.set(0);
  }, [cardTiltX, cardTiltY]);

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
      if (
        prefersReducedMotion ||
        !isDetailed ||
        !isDesktopDetail ||
        event.pointerType !== "mouse"
      ) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      detailTiltX.set((0.5 - py) * 10);
      detailTiltY.set((px - 0.5) * 12);
    },
    [detailTiltX, detailTiltY, isDetailed, isDesktopDetail, prefersReducedMotion]
  );

  const imageFilter = isHovered || isDetailed
    ? "grayscale(0%) contrast(1.1) brightness(1.05)"
    : "grayscale(100%) contrast(1.2) brightness(0.9)";

  const handleRootClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDetailed || !onDetailClose) {
      onClick?.(event);
      return;
    }

    const target = event.target instanceof Element ? event.target : null;
    const artworkBounds = artworkRef.current?.getBoundingClientRect();
    const clickedArtwork = artworkBounds
      ? event.clientX >= artworkBounds.left &&
        event.clientX <= artworkBounds.right &&
        event.clientY >= artworkBounds.top &&
        event.clientY <= artworkBounds.bottom
      : false;
    const clickedContent = !!target?.closest(
      "[data-card-detail-content], button, a"
    );

    if (!clickedArtwork && !clickedContent) {
      event.stopPropagation();
      requestDetailClose();
      return;
    }

    onClick?.(event);
  };

  return (
    <motion.div
      className={`${
        isDetailed
          ? isDesktopDetail
            ? "grid grid-cols-[48%_52%] items-center"
            : "flex items-center justify-center"
          : "relative cursor-pointer group"
      } ${width} ${height} ${className}`}
      style={{
        rotate: isDetailed ? undefined : isHorizontal ? 90 : 0,
        touchAction: isDetailed ? "pan-y" : undefined,
        ...style,
      }}
      onClick={handleRootClick}
      onPointerMove={!isDetailed ? handleCardPointerMove : undefined}
      onPointerLeave={!isDetailed ? resetCardTilt : undefined}
      onMouseEnter={() => !isDetailed && onHover?.(card.id)}
      onMouseLeave={() => {
        if (!isDetailed) {
          resetCardTilt();
          onHover?.(null);
        }
      }}
      {...motionProps}
    >
      {isDetailed && (
        <div
          className={isDesktopDetail
            ? "absolute inset-y-0 right-0 z-30 w-[52%] overflow-y-auto overscroll-y-contain bg-transparent outline-none"
            : "absolute inset-0 z-30 overflow-y-auto overscroll-y-contain bg-transparent outline-none touch-pan-y"}
          onScroll={handleScroll}
          tabIndex={0}
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        >
          <div className={isDesktopDetail ? "hidden" : "relative h-[100dvh] w-full"}>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40" />
            <motion.div
              className="pointer-events-none absolute bottom-[calc(var(--safe-bottom)+1.75rem)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/55"
              style={{ opacity: hintOpacity }}
            >
              <span className="h-8 w-px bg-linear-to-b from-white/0 to-white/65" />
              <span className="text-[9px] uppercase tracking-[0.28em]">{t("card.scrollToRead")}</span>
            </motion.div>
          </div>

          <div className={isDesktopDetail
            ? "relative z-30 flex min-h-full flex-col items-start justify-center bg-transparent py-[clamp(5rem,10vh,8rem)] pl-[clamp(2rem,4vw,5rem)] pr-[max(3rem,6vw)]"
            : "relative z-30 -mt-16 bg-linear-to-b from-transparent to-black"}>
            <div data-card-detail-content className={isDesktopDetail
              ? "w-full max-w-2xl text-left"
              : "px-6 pb-7 pt-24 text-center md:px-12 md:pb-10"}>
              {romanNumeral && (
                <div className="mb-2 text-sm text-amber-50/60 font-cinzel tracking-[0.2em] md:text-base">
                  {romanNumeral}
                </div>
              )}
              <h2 className="mb-3 text-3xl text-amber-50/90 font-cinzel tracking-widest md:text-5xl">
                {primaryName}
              </h2>
              {(secondaryName || isReversed) && (
                <p className="mb-5 text-sm text-neutral-400 font-serif tracking-wide md:text-lg">
                  {secondaryName}
                  {secondaryName && isReversed ? " " : ""}
                  {isReversed && (
                    <span className="ml-2 italic text-red-400/80">({t("card.reversedLong")})</span>
                  )}
                </p>
              )}
              {keywords.length > 0 && (
                <div className={`flex flex-wrap gap-2 md:gap-3 ${isDesktopDetail ? "justify-start" : "justify-center"}`}>
                  {keywords.map((keyword) => (
                    <span key={keyword} className="rounded-sm border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-neutral-300 tracking-[0.15em] uppercase md:px-3 md:text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>

              <div data-card-detail-content className={isDesktopDetail
                ? "mt-10 w-full max-w-2xl space-y-8"
                : "px-6 pb-[calc(var(--safe-bottom)+5rem)] pt-2 md:px-12 md:pb-20 lg:px-14"}>
              <div className={isDesktopDetail ? "space-y-8" : "mx-auto max-w-2xl space-y-8"}>
                {(positiveMeaning || negativeMeaning) && (
                  <div>
                    <h4 className={`mb-4 text-[10px] text-neutral-500 uppercase tracking-[0.3em] ${isDesktopDetail ? "text-left" : "text-center"}`}>
                      {t("card.interpretationTitle")}
                    </h4>
                    <p className="text-sm text-neutral-300 font-light leading-relaxed text-justify tracking-wide md:text-base md:leading-loose">
                      {positiveMeaning && (
                        <span className="mb-2 block text-neutral-200">
                          <span className="mr-2 text-xs text-neutral-400">＋</span>{positiveMeaning}
                        </span>
                      )}
                      {negativeMeaning && (
                        <span className="block text-neutral-400">
                          <span className="mr-2 text-xs text-neutral-500">－</span>{negativeMeaning}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {description && (
                  <div className="border-t border-white/5 pt-8">
                    <h4 className={`mb-4 text-[10px] text-neutral-500 uppercase tracking-[0.3em] ${isDesktopDetail ? "text-left" : "text-center"}`}>
                      {t("card.arcanaWisdom")}
                    </h4>
                    <p className={`text-sm text-neutral-300 font-light leading-relaxed text-justify tracking-wide md:text-base md:leading-loose ${isEnglish ? "italic" : ""}`}>
                      {description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <motion.div
        ref={artworkRef}
        layout
        layoutId={layoutId as string | undefined}
        className={isDetailed
          ? isDesktopDetail
            ? `relative z-20 col-start-1 justify-self-center w-[min(23rem,32vw,64dvh)] ${CARD_ASPECT_CLASS} pointer-events-auto`
            : `relative z-20 w-[min(22rem,72vw,44dvh)] ${CARD_ASPECT_CLASS} pointer-events-none`
          : "absolute inset-0 z-20"}
        transition={{ layout: layoutTransition }}
        onPointerMove={isDetailed && isDesktopDetail ? handleDetailPointerMove : undefined}
        onPointerLeave={isDetailed && isDesktopDetail ? resetDetailTilt : undefined}
        style={!prefersReducedMotion
          ? isDetailed && isDesktopDetail
            ? {
                scale: 1,
                y: 0,
                opacity: 1,
                filter: "none",
              }
            : {
                scale: artworkScale,
                y: artworkY,
                opacity: artworkOpacity,
                filter: artworkFilter,
              }
          : {
              scale: 1,
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
            }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{
            rotateX:
              !prefersReducedMotion && isDetailed && isDesktopDetail
                ? smoothDetailTiltX
                : !prefersReducedMotion && !isDetailed
                  ? smoothCardTiltX
                  : 0,
            rotateY:
              !prefersReducedMotion && isDetailed && isDesktopDetail
                ? smoothDetailTiltY
                : !prefersReducedMotion && !isDetailed
                  ? smoothCardTiltY
                  : 0,
            transformPerspective: 1400,
            transformStyle: "preserve-3d",
            willChange: isDetailed && isDesktopDetail ? "transform" : undefined,
          }}
        >
        <motion.div
          className="relative h-full w-full"
          initial={false}
          animate={{ rotateY: isDetailed || isRevealed ? 0 : 180 }}
          transition={{ duration: isDetailed ? 0 : 0.28, ease: SILKY_EASE }}
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[1.2%] bg-white p-[2%] shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <div className="relative h-full w-full overflow-hidden border border-black/80 bg-neutral-950">
              <motion.img
                src={getCardImageUrl(card.image)}
                alt={card.nameEn}
                loading="eager"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setIsImageLoaded(true);
                  setHasImageError(true);
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-[filter,opacity] duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                style={{ filter: imageFilter }}
                initial={false}
                animate={{ rotateZ: isArtworkReversed ? 180 : 0 }}
                transition={{
                  duration: shouldSnapArtworkOrientation ? 0 : 0.32,
                  ease: SILKY_EASE,
                }}
              />
              {hasImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 p-4 text-center text-xs text-white/40 font-cinzel tracking-widest uppercase">
                  {card.nameEn}
                </div>
              )}
              {!isImageLoaded && !hasImageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-black/40" />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-screen"
                animate={{
                  opacity: isDetailed && isDesktopDetail ? 0.92 : isHovered ? 0.95 : 0,
                  scale: isDetailed || isHovered ? 1 : 0.96,
                }}
                transition={{ duration: 0.35, ease: SILKY_EASE }}
                style={{ background: isDetailed ? detailSurface : cardGlare }}
              />
              <div className={`absolute bottom-0 w-full p-3 text-center transition-opacity duration-300 md:p-4 ${isRevealed ? "opacity-100" : "opacity-0"}`}>
                {romanNumeral && <div className="mb-0.5 text-[8px] text-white/60 font-cinzel tracking-[0.2em] md:text-[10px]">{romanNumeral}</div>}
                <h2 className="mb-0.5 truncate text-[10px] text-white font-cinzel tracking-widest md:text-sm">{primaryName}</h2>
                {(secondaryName || isReversed) && (
                  <p className="truncate text-[9px] text-neutral-400 font-serif md:text-[10px]">
                    {secondaryName}
                    {secondaryName && isReversed ? " " : ""}
                    {isReversed && <span className="ml-1 italic text-red-400/80">({t("card.reversedShort")})</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 overflow-hidden bg-black"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardBackSurface cardBackId={cardBackId} className="border border-black/80" />
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
      </motion.div>

      {isDetailed && onDetailClose && (
        <motion.button
          type="button"
          aria-label="Back"
          className="fixed left-[calc(var(--safe-left)+0.75rem)] top-[calc(var(--safe-top)+0.75rem)] z-[10001] flex items-center gap-2 p-2 text-white/60 transition-colors hover:text-white md:left-8 md:top-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={(event) => {
            event.stopPropagation();
            requestDetailClose();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="hidden text-[10px] uppercase tracking-widest md:inline">Back</span>
        </motion.button>
      )}

      {!isDetailed && label && (
        <div className={`absolute whitespace-nowrap text-[8px] text-neutral-600 tracking-[0.2em] uppercase pointer-events-none md:text-[9px] ${labelClasses[labelPosition]}`}>
          {label}
        </div>
      )}
    </motion.div>
  );
};

export default RitualCard;
