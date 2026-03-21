import {
  Library,
  ArrowLeft,
  Maximize2,
  Minimize2,
} from "lucide-react";
import React, { useState } from "react";
import AudioVisualizer from "./AudioVisualizer";
import { GameState } from "../types";
import { LANGUAGE_LABELS } from "../constants/i18n";
import { useTranslation } from "react-i18next";
import { Locale } from "../types";

interface HeaderBarProps {
  gameState: GameState;
  isAudioPlaying: boolean;
  onLibraryClick: () => void;
  onHomeClick: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  gameState,
  isAudioPlaying,
  onLibraryClick,
  onHomeClick,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const setLocale = (l: Locale) => i18n.changeLanguage(l);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  const getStateLabel = () => {
    return t(`header.stateLabels.${gameState}`) || "";
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-12 md:h-24 px-6 md:px-8 flex justify-between items-center z-40 pointer-events-none bg-linear-to-b from-black/80 to-transparent">
      {/* Left: Logo / Home */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <button onClick={onHomeClick} className="flex flex-col gap-1 group">
          <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">

            <h1 className="text-xs font-cinzel tracking-[0.4em] font-bold">
              {t("header.brand")}
            </h1>
          </div>
          <div className="w-full h-px bg-white/10 group-hover:bg-white/30 transition-colors" />
        </button>

        {/* State Breadcrumb */}
        {gameState !== GameState.INTRO && (
          <div className="hidden md:flex items-center gap-2 text-neutral-500 text-[10px] tracking-widest uppercase animate-in fade-in slide-in-from-left-4">
            <span className="w-px h-4 bg-white/10" />
            <span>{getStateLabel()}</span>
          </div>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex items-center gap-1 border border-white/10 p-1">
          {(Object.keys(LANGUAGE_LABELS) as Array<keyof typeof LANGUAGE_LABELS>).map(
            (option) => (
              <button
                key={option}
                onClick={() => setLocale(option)}
                className={`px-2 py-1 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                  locale === option
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {LANGUAGE_LABELS[option]}
              </button>
            )
          )}
        </div>
        <AudioVisualizer isPlaying={isAudioPlaying} />
        <div className="w-px h-4 bg-white/10 hidden md:block" />
        <button
          onClick={onLibraryClick}
          className={`text-white/50 hover:text-white transition-colors flex items-center gap-2 ${
            gameState === GameState.LIBRARY ? "text-white" : ""
          }`}
          title={
            gameState === GameState.LIBRARY
              ? t("header.closeLibraryTitle")
              : t("header.openLibraryTitle")
          }
        >
          {gameState === GameState.LIBRARY ? (
            <ArrowLeft size={16} />
          ) : (
            <Library size={16} />
          )}
          <span className="text-[10px] uppercase tracking-widest hidden md:inline">
            {gameState === GameState.LIBRARY
              ? t("header.back")
              : t("header.library")}
          </span>
        </button>
        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreen}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-2"
          title={
            isFullscreen
              ? t("header.exitFullscreen")
              : t("header.fullscreen")
          }
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span className="text-[10px] uppercase tracking-widest hidden md:inline">
            {isFullscreen
              ? t("header.exitFullscreen")
              : t("header.fullscreen")}
          </span>
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
