import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { preload } from "react-dom";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import {
  GameState,
  TarotCard,
  SpreadType,
  PickedCard,
  CardPoolType,
} from "@/features/tarot/types";
import {
  FULL_DECK,
  getDeckForPool,
  getCardImageUrl,
} from "@/features/tarot/constants/cards";
import { SPREADS } from "@/features/tarot/constants/spreads";
import {
  generateTarotReading,
  generateSpeech,
  hasAiKey,
  predictBestSpread,
} from "@/features/tarot/services/gemini";
import Galaxy from "@/app/components/Galaxy";
import HeaderBar from "@/app/components/HeaderBar";
import IntroSection from "@/features/tarot/components/IntroSection";
import InputSection from "@/features/tarot/components/InputSection";
import PickingSection from "@/features/tarot/components/PickingSection";
import ReadingSection from "@/features/tarot/components/ReadingSection";
import DeckLibrary from "@/features/tarot/components/DeckLibrary";
import printTheReading from "@/features/tarot/utils/printTheReading";
import { useTarotAudio } from "@/features/tarot/hooks/useTarotAudio";
import { useResponsive } from "@/shared/hooks/useResponsive";
import { useTranslation } from "react-i18next";
import { Locale } from "@/i18n/types";

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const aiEnabled = hasAiKey();

  const { isMobile, isTablet } = useResponsive();

  const staticScripts = useMemo(
    () => ({
      WELCOME: t("staticScripts.WELCOME"),
      ASK: t("staticScripts.ASK"),
      PICK: t("staticScripts.PICK"),
      REVEAL: t("staticScripts.REVEAL"),
    }),
    [t]
  );

  const {
    isAudioPlaying,
    audioContextRef,
    hasPlayedIntroWelcomeRef,
    initAudio,
    stopVoice,
    playBuffer,
    playVoice,
    waitForVoiceToFinish,
    playIntroWelcome,
    prefetchStaticAudio,
    startDrone,
    stopDrone,
  } = useTarotAudio(locale, staticScripts);

  // --- State ---
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [previousGameState, setPreviousGameState] = useState<GameState | null>(
    null
  );

  // Input State
  const [question, setQuestion] = useState("");
  const [spread, setSpread] = useState<SpreadType | null>("AUTO");

  // Game Data
  const [pickedCards, setPickedCards] = useState<PickedCard[]>([]);
  const [readingText, setReadingText] = useState<string>("");
  const [readingAudioBuffer, setReadingAudioBuffer] =
    useState<AudioBuffer | null>(null);
  const [revealedCardIds, setRevealedCardIds] = useState<Set<number>>(
    new Set()
  );
  const [hasPlayedReadingAudio, setHasPlayedReadingAudio] = useState(false);

  // System State
  const [isThinking, setIsThinking] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [thinkingKeywordIndex, setThinkingKeywordIndex] = useState(0);

  // --- Refs ---
  const readingPromiseRef = useRef<Promise<string> | null>(null);
  const readingReadyRef = useRef<boolean>(false);
  const ritualIdRef = useRef<number>(0);
  const predeterminedCardsRef = useRef<PickedCard[]>([]);
  const predeterminedCardsIndexRef = useRef<number>(0);
  const hiddenCardIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!isThinking) return;
    const interval = setInterval(() => {
      setThinkingKeywordIndex((prev) => prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [isThinking]);

  // --- Computed Deck ---
  const activeDeck = useMemo(() => {
    if (!spread) return FULL_DECK;

    const spreadDef = SPREADS[spread];

    if (pickedCards.length >= spreadDef.cardCount) {
      return [];
    }

    const currentStep = pickedCards.length;
    let poolType: CardPoolType = "FULL";
    if (spreadDef.cardPools && spreadDef.cardPools[currentStep]) {
      poolType = spreadDef.cardPools[currentStep];
    }

    return getDeckForPool(poolType);
  }, [spread, pickedCards.length]);

  // --- Flow Handlers ---
  const enterInputPhase = async () => {
    initAudio();
    setGameState(GameState.INPUT);
    prefetchStaticAudio();

    if (!hasPlayedIntroWelcomeRef.current) {
      await playIntroWelcome();
    } else {
      await waitForVoiceToFinish();
    }

    startDrone();
  };

  const startRitual = async () => {
    let selectedSpread = spread;
    if ((!selectedSpread || selectedSpread === "AUTO") && aiEnabled) {
      setIsThinking(true);
      try {
        selectedSpread = await predictBestSpread(question, locale);
        setSpread(selectedSpread);
      } catch (e) {
        console.error("Spread prediction failed", e);
        selectedSpread = "SINGLE";
        setSpread("SINGLE");
      }
      setIsThinking(false);
    }
    if ((!selectedSpread || selectedSpread === "AUTO") && !aiEnabled) {
      selectedSpread = "SINGLE";
      setSpread("SINGLE");
    }

    if (!selectedSpread) selectedSpread = "SINGLE";

    setGameState(GameState.PICKING);
    setPickedCards([]);
    setRevealedCardIds(new Set());
    setHasPlayedReadingAudio(false);
    setReadingText("");
    setReadingAudioBuffer(null);
    hiddenCardIdsRef.current.clear();
    readingReadyRef.current = false;

    const currentRitualId = ritualIdRef.current + 1;
    ritualIdRef.current = currentRitualId;

    const spreadDef = SPREADS[selectedSpread];
    const targets: PickedCard[] = [];

    for (let i = 0; i < spreadDef.cardCount; i++) {
      let poolType: CardPoolType = "FULL";
      if (spreadDef.cardPools && spreadDef.cardPools[i]) {
        poolType = spreadDef.cardPools[i];
      }

      const sourceDeck = getDeckForPool(poolType);
      const availableDeck = sourceDeck.filter(
        (c) => !targets.some((t) => t.id === c.id)
      );

      const picked =
        availableDeck[Math.floor(Math.random() * availableDeck.length)];

      targets.push({
        ...picked,
        isReversed: Math.random() > 0.4,
      });
    }

    predeterminedCardsRef.current = targets;
    predeterminedCardsIndexRef.current = 0;

    targets.forEach((card) => {
      const url = getCardImageUrl(card.image);
      preload(url, { as: "image" });
      const img = new Image();
      img.src = url;
    });

    if (aiEnabled) {
      readingPromiseRef.current = generateTarotReading(
        targets,
        selectedSpread,
        question,
        locale
      )
        .then((text) => {
          if (ritualIdRef.current !== currentRitualId) return text;

          readingReadyRef.current = true;

          if (audioContextRef.current) {
            const sentences = text
              .split(/[。！？.!?]/)
              .filter((s) => s.trim().length > 0);

            const lastSentence =
              sentences.length > 0 ? sentences[sentences.length - 1] : text;

            generateSpeech(
              lastSentence,
              audioContextRef.current,
              undefined,
              locale
            ).then((buffer) => {
              if (ritualIdRef.current === currentRitualId && buffer) {
                setReadingAudioBuffer(buffer);
              }
            });
          }
          return text;
        })
        .catch((err) => {
          console.error("Background generation failed", err);
          return t("errors.silentStars");
        });
    } else {
      readingReadyRef.current = true;
      readingPromiseRef.current = Promise.resolve(
        t("errors.missingApiKeyReading")
      );
    }

    playVoice(staticScripts.PICK, "PICK", "pick");
  };

  const handleCardSelect = async (visualCard: TarotCard) => {
    if (isThinking || gameState !== GameState.PICKING) return;

    const requiredCards = SPREADS[spread!].cardCount;
    if (pickedCards.length >= requiredCards) return;

    if (hiddenCardIdsRef.current.has(visualCard.id)) return;

    const targetIndex = predeterminedCardsIndexRef.current;
    if (targetIndex >= predeterminedCardsRef.current.length) return;

    const targetCard = predeterminedCardsRef.current[targetIndex];
    predeterminedCardsIndexRef.current++;

    const hybridCard: PickedCard = {
      ...targetCard,
      id: visualCard.id,
    };

    hiddenCardIdsRef.current.add(visualCard.id);

    const newPicked: PickedCard[] = [...pickedCards, hybridCard];
    setPickedCards(newPicked);

    if (newPicked.length === requiredCards) {
      setTimeout(() => startRevealProcess(newPicked), 1000);
    }
  };

  const startRevealProcess = async (finalCards: PickedCard[]) => {
    setGameState(GameState.READING);
    playVoice(staticScripts.REVEAL, "REVEAL", "reveal");

    if (!readingReadyRef.current) {
      setThinkingKeywordIndex(0);
      setIsThinking(true);
    }

    let text = "";
    if (readingPromiseRef.current) {
      text = await readingPromiseRef.current;
    } else {
      text = await generateTarotReading(finalCards, spread!, question, locale);
    }
    setReadingText(text);
    setIsThinking(false);
  };

  // Play audio when all cards are revealed and audio is ready
  useEffect(() => {
    if (
      gameState === GameState.READING &&
      !isThinking &&
      readingAudioBuffer &&
      pickedCards.length > 0 &&
      revealedCardIds.size === pickedCards.length &&
      !hasPlayedReadingAudio
    ) {
      playBuffer(readingAudioBuffer);
      setHasPlayedReadingAudio(true);
    }
  }, [
    gameState,
    isThinking,
    readingAudioBuffer,
    pickedCards.length,
    revealedCardIds.size,
    hasPlayedReadingAudio,
    playBuffer,
  ]);

  const resetRitual = () => {
    stopVoice();
    setGameState(GameState.INPUT);
    setPickedCards([]);
    setRevealedCardIds(new Set());
    setHasPlayedReadingAudio(false);
    setReadingText("");
    setReadingAudioBuffer(null);
    setQuestion("");
    setPreviousGameState(null);
    playVoice(staticScripts.ASK, "ASK", "ask");
  };

  const replayAudio = () => {
    if (readingAudioBuffer && !isAudioPlaying) {
      playBuffer(readingAudioBuffer);
    }
  };

  const downloadReading = printTheReading(
    question,
    spread!,
    pickedCards,
    readingText,
    locale
  );

  const toggleLibrary = () => {
    if (gameState === GameState.LIBRARY) {
      if (previousGameState) {
        setGameState(previousGameState);
        setPreviousGameState(null);
      } else {
        setGameState(GameState.INTRO);
      }
    } else {
      setPreviousGameState(gameState);
      setGameState(GameState.LIBRARY);
    }
  };

  const bgOpacity = gameState === GameState.INTRO ? 0.9 : 0.3;

  const renderPhase = () => {
    switch (gameState) {
      case GameState.INTRO:
        return <IntroSection onEnter={enterInputPhase} />;
      case GameState.LIBRARY:
        return <DeckLibrary onClose={toggleLibrary} />;
      case GameState.INPUT:
        return (
          <InputSection
            question={question}
            spread={spread}
            onQuestionChange={setQuestion}
            onSpreadChange={setSpread}
            onStartRitual={startRitual}
            isMobile={isMobile}
            isTablet={isTablet}
            isThinking={isThinking}
          />
        );
      case GameState.PICKING:
        return (
          <PickingSection
            spread={spread}
            activeDeck={activeDeck}
            pickedCards={pickedCards}
            isMobile={isMobile}
            isTablet={isTablet}
            hoveredCardId={hoveredCardId}
            onCardHover={setHoveredCardId}
            onCardSelect={handleCardSelect}
          />
        );
      case GameState.REVEAL:
      case GameState.READING:
        if (!pickedCards.length) return null;
        return (
          <ReadingSection
            spread={spread}
            isMobile={isMobile}
            isTablet={isTablet}
            pickedCards={pickedCards}
            revealedCardIds={revealedCardIds}
            onCardReveal={(id) =>
              setRevealedCardIds((prev) => new Set(prev).add(id))
            }
            hoveredCardId={hoveredCardId}
            onCardHover={setHoveredCardId}
            isThinking={isThinking}
            thinkingKeywordIndex={thinkingKeywordIndex}
            question={question}
            readingText={readingText}
            readingAudioBuffer={readingAudioBuffer}
            isAudioPlaying={isAudioPlaying}
            onReplayAudio={replayAudio}
            onDownload={downloadReading}
            onReset={resetRitual}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-neutral-200 font-serif select-none cursor-default overflow-hidden">
      {/* Galaxy Background (Persistent) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: bgOpacity }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Galaxy
          speed={
            gameState === GameState.PICKING
              ? 0.2
              : gameState === GameState.READING
              ? 0.15
              : gameState === GameState.REVEAL
              ? 0.8
              : 1.0
          }
          hueShift={260}
          saturation={
            hoveredCardId !== null && gameState === GameState.READING
              ? 0.9
              : 0.15
          }
          density={0.8}
          glowIntensity={
            hoveredCardId !== null && gameState === GameState.READING
              ? 0.5
              : 0.22
          }
          twinkleIntensity={0.18}
          rotationSpeed={0.08}
          mouseRepulsion={false}
          mouseInteraction={false}
          transparent={true}
        />
      </motion.div>

      {/* Header */}
      <HeaderBar
        gameState={gameState}
        isAudioPlaying={isAudioPlaying}
        onLibraryClick={toggleLibrary}
        onHomeClick={() => {
          stopDrone();
          setGameState(GameState.INTRO);
          setPreviousGameState(null);
        }}
      />

      {/* Main Content Area - No Scroll */}
      <motion.main
        layoutScroll
        className={`absolute inset-0 z-10 perspective-1000 overflow-hidden ${
          gameState === GameState.READING ||
          gameState === GameState.REVEAL ||
          gameState === GameState.INPUT ||
          gameState === GameState.LIBRARY
            ? "overflow-y-auto"
            : "overflow-hidden"
        }`}
      >
        {/* Inner Container - Full Height Centered */}
        <div
          className={`w-full flex flex-col items-center px-4 ${
            gameState === GameState.READING ||
            gameState === GameState.REVEAL ||
            gameState === GameState.INPUT ||
            gameState === GameState.LIBRARY
              ? "min-h-full py-12 justify-center"
              : "h-full justify-center py-24"
          }`}
        >
          <LayoutGroup id="ritual-cards">
            <AnimatePresence mode="sync">{renderPhase()}</AnimatePresence>
          </LayoutGroup>
        </div>
      </motion.main>

      {/* Creator Credit */}
      <div className="fixed bottom-4 right-6 z-50 text-[9px] text-neutral-600 font-sans tracking-widest opacity-50 select-none pointer-events-none mix-blend-difference">
        Created by 范松海frank
      </div>
    </div>
  );
};

export default App;
