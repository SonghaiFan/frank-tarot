import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GameState,
  TarotCard,
  SpreadType,
  PickedCard,
  CardPoolType,
} from "./types";
import {
  FULL_DECK,
  STATIC_SCRIPTS,
  getDeckForPool,
  getCardImageUrl,
} from "./constants/cards";
import { SPREADS } from "./constants/spreads";
import { generateTarotReading, generateSpeech, predictBestSpread } from "./services/gemini";
import CosmicParticles from "./components/CosmicParticles";
import HeaderBar from "./components/HeaderBar";
import IntroSection from "./components/IntroSection";
import InputSection from "./components/InputSection";
import ShufflingSection from "./components/ShufflingSection";
import PickingSection from "./components/PickingSection";
import ReadingSection from "./components/ReadingSection";
import DeckLibrary from "./components/DeckLibrary";
import printTheReading from "./utils/printTheReading";

// --- Configuration ---
const BACKGROUND_VOLUME = 0.06;

// --- Ambient Sound Engine ---
class SoundEngine {
  private ctx: AudioContext;
  private audioElement: HTMLAudioElement | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private gain: GainNode | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  async startDrone() {
    if (this.audioElement) return; // Already playing

    try {
      // Create audio element for background music
      const baseUrl = import.meta.env.BASE_URL;
      this.audioElement = new Audio(`${baseUrl}audio/background.mp3`);
      this.audioElement.loop = true;

      // Create Web Audio nodes
      this.source = this.ctx.createMediaElementSource(this.audioElement);
      this.gain = this.ctx.createGain();

      this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.source.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      // Start playing
      await this.audioElement.play();

      // Fade in over 5 seconds
      this.gain.gain.linearRampToValueAtTime(
        BACKGROUND_VOLUME,
        this.ctx.currentTime + 5
      );

      console.log("Background music started");
    } catch (error) {
      console.error("Background music playback failed:", error);
    }
  }

  stop() {
    if (!this.gain || !this.audioElement) return;

    const t = this.ctx.currentTime;
    // Fade out over 2 seconds
    this.gain.gain.linearRampToValueAtTime(0.001, t + 2);

    setTimeout(() => {
      this.audioElement?.pause();
      this.audioElement = null;
      this.source = null;
      this.gain = null;
    }, 2000);
  }
}

const App: React.FC = () => {
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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [thinkingKeywordIndex, setThinkingKeywordIndex] = useState(0);

  // --- Refs ---
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEngineRef = useRef<SoundEngine | null>(null);
  const audioCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const voiceSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const readingPromiseRef = useRef<Promise<string> | null>(null);
  const readingReadyRef = useRef<boolean>(false);
  const ritualIdRef = useRef<number>(0);
  const predeterminedCardsRef = useRef<PickedCard[]>([]);
  const predeterminedCardsIndexRef = useRef<number>(0);
  const hiddenCardIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    // If we've picked all cards, return empty deck to prevent flashing new cards
    if (pickedCards.length >= spreadDef.cardCount) {
      return [];
    }

    const currentStep = pickedCards.length;

    // Determine pool type for current step
    let poolType: CardPoolType = "FULL";
    if (spreadDef.cardPools && spreadDef.cardPools[currentStep]) {
      poolType = spreadDef.cardPools[currentStep];
    }

    return getDeckForPool(poolType);
  }, [spread, pickedCards.length]); // --- Audio Initialization ---
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      soundEngineRef.current = new SoundEngine(ctx);
      console.log("AudioContext created");
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().then(() => {
        console.log("AudioContext resumed");
      });
    }
  }, []);

  // --- Playback Logic ---

  const playBuffer = useCallback((buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;

    // Stop previous voice if any
    if (voiceSourceRef.current) {
      try {
        voiceSourceRef.current.stop();
      } catch (e) { }
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;

    // Voice Gain (louder than drone)
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = 1.0;

    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    voiceSourceRef.current = source;
    setIsAudioPlaying(true);
    source.start();
    source.onended = () => setIsAudioPlaying(false);
  }, []);

  const playVoice = useCallback(
    async (
      text: string,
      cacheKey?: string,
      staticKey?: string
    ): Promise<void> => {
      if (!audioContextRef.current) return;

      // 1. Check Cache
      if (cacheKey && audioCacheRef.current.has(cacheKey)) {
        playBuffer(audioCacheRef.current.get(cacheKey)!);
        return;
      }

      // 2. Generate with Gemini (will try local first if staticKey provided)
      try {
        const buffer = await generateSpeech(
          text,
          audioContextRef.current,
          staticKey
        );
        if (buffer) {
          if (cacheKey) audioCacheRef.current.set(cacheKey, buffer);
          playBuffer(buffer);
        } else {
          // Silence on error/timeout (No Fallback)
          console.warn("TTS unavailable. Staying silent.");
        }
      } catch (err) {
        console.error("Voice generation exception", err);
      }
    },
    [playBuffer]
  );

  // Prefetch static scripts silently (tries local first, then Gemini)
  const prefetchStaticAudio = useCallback(async () => {
    if (!audioContextRef.current) return;
    const scripts = [
      { k: "ASK", t: STATIC_SCRIPTS.ASK },
      { k: "SHUFFLE", t: STATIC_SCRIPTS.SHUFFLE },
      { k: "PICK", t: STATIC_SCRIPTS.PICK },
      { k: "REVEAL", t: STATIC_SCRIPTS.REVEAL },
    ];
    for (const s of scripts) {
      if (!audioCacheRef.current.has(s.k)) {
        generateSpeech(s.t, audioContextRef.current, s.k.toLowerCase())
          .then((buf) => {
            if (buf) audioCacheRef.current.set(s.k, buf);
          })
          .catch(() => {
            /* Ignore prefetch errors */
          });
      }
    }
  }, []);

  // --- Flow Handlers ---

  const enterInputPhase = async () => {
    initAudio();

    // Wait a bit for AudioContext to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    soundEngineRef.current?.startDrone();
    setGameState(GameState.INPUT);
    prefetchStaticAudio();

    // Play WELCOME first, then ASK after a delay
    await playVoice(STATIC_SCRIPTS.WELCOME, "WELCOME", "welcome");
    setTimeout(() => playVoice(STATIC_SCRIPTS.ASK, "ASK", "ask"), 1500);
  };

  const startRitual = async () => {
    // 0. Auto-Select Spread
    let selectedSpread = spread;
    if (!selectedSpread || selectedSpread === "AUTO") {
        setIsThinking(true);
        try {
            selectedSpread = await predictBestSpread(question);
            setSpread(selectedSpread);
        } catch (e) {
            console.error("Spread prediction failed", e);
            selectedSpread = "SINGLE"; // Safety fallback
            setSpread("SINGLE");
        }
        setIsThinking(false);
    }
    
    // Safety check mostly for TypeScript, practically handled above
    if (!selectedSpread) selectedSpread = "SINGLE";

    setGameState(GameState.SHUFFLING);
    setPickedCards([]);
    setRevealedCardIds(new Set());
    setHasPlayedReadingAudio(false);
    setReadingText("");
    setReadingAudioBuffer(null);
    hiddenCardIdsRef.current.clear();
    readingReadyRef.current = false;

    // Increment Ritual ID to invalidate old promises
    const currentRitualId = ritualIdRef.current + 1;
    ritualIdRef.current = currentRitualId;

    // 1. Pre-determine cards based on spread rules
    const spreadDef = SPREADS[selectedSpread];
    const targets: PickedCard[] = [];

    // Generate cards for each position
    for (let i = 0; i < spreadDef.cardCount; i++) {
      let poolType: CardPoolType = "FULL";

      // Determine pool type
      if (spreadDef.cardPools && spreadDef.cardPools[i]) {
        poolType = spreadDef.cardPools[i];
      }

      const sourceDeck = getDeckForPool(poolType);

      // Simple random pick (allowing duplicates across positions if decks overlap,
      // but usually we want unique cards. For now, simple random is fine as decks are large enough,
      // but ideally we should filter out already picked cards if from same deck)
      // Improved: Filter out already picked IDs
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

    // Preload images for the selected cards
    targets.forEach((card) => {
      const img = new Image();
      img.src = getCardImageUrl(card.image);
    });

    // 2. Start Gemini Generation in Background
    readingPromiseRef.current = generateTarotReading(targets, selectedSpread, question)
      .then((text) => {
        // Check if this result is for the current ritual
        if (ritualIdRef.current !== currentRitualId) return text;

        readingReadyRef.current = true;

        if (audioContextRef.current) {
          const sentences = text
            .split(/[。！？.!?]/)
            .filter((s) => s.trim().length > 0);

          const firstSentence = sentences.length > 0 ? sentences[0] : text;
          const lastSentence =
            sentences.length > 0 ? sentences[sentences.length - 1] : text;

          // Fire and forget TTS prefetch
          generateSpeech(lastSentence, audioContextRef.current).then(
            (buffer) => {
              if (ritualIdRef.current === currentRitualId && buffer) {
                setReadingAudioBuffer(buffer);
              }
            }
          );
        }
        return text;
      })
      .catch((err) => {
        console.error("Background generation failed", err);
        return "The stars are silent...";
      });

    await playVoice(STATIC_SCRIPTS.SHUFFLE, "SHUFFLE", "shuffle");

    // Auto advance after shuffle (5s)
    setTimeout(() => {
      setGameState(GameState.PICKING);
      playVoice(STATIC_SCRIPTS.PICK, "PICK", "pick");
    }, 5000);
  };

  const handleCardSelect = async (visualCard: TarotCard) => {
    if (isThinking || gameState !== GameState.PICKING) return;

    const requiredCards = SPREADS[spread].cardCount;
    if (pickedCards.length >= requiredCards) return;

    // Prevent picking duplicate visual cards (though hiddenCardIds should handle this)
    if (hiddenCardIdsRef.current.has(visualCard.id)) return;

    // Get the next predetermined target
    const targetIndex = predeterminedCardsIndexRef.current;
    if (targetIndex >= predeterminedCardsRef.current.length) return;

    const targetCard = predeterminedCardsRef.current[targetIndex];
    predeterminedCardsIndexRef.current++;

    // Create Hybrid Card:
    // Visual ID: From the card user clicked (so it disappears from cloud)
    // Data: From the target card (so the reading is correct)
    const hybridCard: PickedCard = {
      ...targetCard,
      id: visualCard.id, // Use visual ID to satisfy unique key requirements and animations
    };

    // Mark visual ID as hidden so it disappears from cloud
    hiddenCardIdsRef.current.add(visualCard.id);

    const newPicked: PickedCard[] = [...pickedCards, hybridCard];
    setPickedCards(newPicked);

    // If we have all cards, proceed to reveal
    if (newPicked.length === requiredCards) {
      // Short delay to let the pick animation play
      setTimeout(() => startRevealProcess(newPicked), 1000);
    }
  };

  const startRevealProcess = async (finalCards: PickedCard[]) => {
    // Transition to Reading state immediately so user can flip cards
    setGameState(GameState.READING);
    playVoice(STATIC_SCRIPTS.REVEAL, "REVEAL", "reveal");

    // Start Thinking Process (for the text generation)
    if (!readingReadyRef.current) {
      setThinkingKeywordIndex(0);
      setIsThinking(true);
    }

    // 1. Get Text Reading (Should be ready or almost ready)
    let text = "";
    if (readingPromiseRef.current) {
      text = await readingPromiseRef.current;
    } else {
      // Fallback if something went wrong
      text = await generateTarotReading(finalCards, spread, question);
    }
    setReadingText(text);

    // 2. Audio should have been prefetched in the promise chain
    // If not (e.g. promise resolved before TTS finished), we wait or it will update via state
    // We don't need to do anything here if we set state in the promise chain.

    // Stop thinking state
    setIsThinking(false);
  };

  // Effect to play audio when all cards are revealed and audio is ready
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
    if (voiceSourceRef.current) {
      try {
        voiceSourceRef.current.stop();
      } catch (e) { }
    }
    setGameState(GameState.INPUT);
    setPickedCards([]);
    setRevealedCardIds(new Set());
    setHasPlayedReadingAudio(false);
    setReadingText("");
    setReadingAudioBuffer(null);
    setQuestion("");
    setPreviousGameState(null);
    // Keep drone playing
    playVoice(STATIC_SCRIPTS.ASK, "ASK", "ask");
  };

  // Replay reading audio
  const replayAudio = () => {
    if (readingAudioBuffer && !isAudioPlaying) {
      playBuffer(readingAudioBuffer);
    }
  };

  // Download reading as image
  const downloadReading = printTheReading(
    question,
    spread,
    pickedCards,
    readingText
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

  // --- Render Helpers ---

  // Dynamic Background Opacity: High in Intro, Low otherwise
  const bgOpacity = gameState === GameState.INTRO ? 0.9 : 0.3;

  const renderPhase = () => {
    const fallbackSpread: SpreadType = spread || "THREE";
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
      case GameState.SHUFFLING:
        return (
          <ShufflingSection
            cardCount={SPREADS[fallbackSpread].cardCount}
            spread={fallbackSpread}
            isMobile={isMobile}
            isTablet={isTablet}
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
      {/* Cosmic Particle Background (Persistent) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: bgOpacity }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <CosmicParticles gameState={gameState} />
      </motion.div>

      {/* Header */}
      <HeaderBar
        gameState={gameState}
        isAudioPlaying={isAudioPlaying}
        onLibraryClick={toggleLibrary}
        onHomeClick={() => {
          setGameState(GameState.INTRO);
          setPreviousGameState(null);
        }}
      />

      {/* Main Content Area - No Scroll */}
      <main
        className={`absolute inset-0 z-10 perspective-1000 overflow-hidden ${gameState === GameState.READING ||
          gameState === GameState.REVEAL ||
          gameState === GameState.INPUT ||
          gameState === GameState.LIBRARY
          ? "overflow-y-auto"
          : "overflow-hidden"
          }`}
      >
        {/* Inner Container - Full Height Centered */}
        <div
          className={`w-full flex flex-col items-center px-4 ${gameState === GameState.READING ||
            gameState === GameState.REVEAL ||
            gameState === GameState.INPUT ||
            gameState === GameState.LIBRARY
            ? "min-h-full py-12 justify-center"
            : "h-full justify-center py-24"
            }`}
        >
          <AnimatePresence mode="popLayout">{renderPhase()}</AnimatePresence>
        </div>
      </main>

      {/* Creator Credit */}
      <div className="fixed bottom-4 right-6 z-50 text-[9px] text-neutral-600 font-sans tracking-widest opacity-50 select-none pointer-events-none mix-blend-difference">
        Created by 范松海frank
      </div>
    </div>
  );
};

export default App;
