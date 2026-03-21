import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import TrueFocus from "../utils/TrueFocus";
import { useTranslation } from "react-i18next";

interface IntroSectionProps {
  onEnter: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onEnter }) => {
  const { t } = useTranslation();

  return (
    <motion.div
    key="intro"
    className="h-screen w-full flex flex-col items-center justify-center text-center space-y-12 z-20"
    exit={{
      opacity: 0,
      filter: "blur(20px)",
      transition: { duration: 1 },
    }}
  >
    <div className="relative">
      <TrueFocus
        sentence={t("intro.focus")}
        manualMode={true}
        blurAmount={5}
        animationDuration={2}
        pauseBetweenAnimations={1}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="absolute -bottom-6 left-0 w-full text-center text-[10px] md:text-xs tracking-[1.2em] text-neutral-500 font-cinzel"
      >
        {t("intro.subtitle")}
      </motion.p>
    </div>

    <div className="flex flex-col items-center gap-6">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={onEnter}
        className="group relative px-10 py-4 border border-white/10 hover:border-white/40 transition-all duration-700 bg-black/50 backdrop-blur-md"
      >
        <span className="relative z-10 flex items-center gap-4 text-xs tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors">
          {t("intro.enter")} <ArrowRight size={12} />
        </span>
        <div className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-out" />
      </motion.button>
    </div>
  </motion.div>
  );
};

export default IntroSection;
