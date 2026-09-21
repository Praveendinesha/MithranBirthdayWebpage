import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';
import { triggerUnwrapConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface HeroEntranceProps {
  onUnwrap: () => void;
  babyName: string;
}

export const HeroEntrance: React.FC<HeroEntranceProps> = ({ onUnwrap, babyName }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleUnwrap = () => {
    if (isOpening) return;
    setIsOpening(true);

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    soundManager.playFanfare();
    soundManager.startMelody();
    triggerUnwrapConfetti();

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      onUnwrap();
    }, 750);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#F0F7FB] via-[#E1EFF7] to-[#F0F7FB] overflow-hidden"
      >
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top Royal Emblem */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="w-12 h-12 rounded-full border border-blue-200 flex items-center justify-center bg-white shadow-xs mb-3">
            <Crown className="w-6 h-6 text-blue-600 fill-blue-300" />
          </div>
          <span className="font-royal text-[11px] tracking-[0.25em] text-blue-600 uppercase font-bold">
            Royal 1st Birthday
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center max-w-sm mb-10"
        >
          <p className="font-serif italic text-base text-slate-500 mb-1">
            You are cordially invited to celebrate
          </p>
          <h1 className="font-royal font-black text-2xl sm:text-3xl text-royalNavy-900 tracking-wider uppercase">
            <span className="royal-gradient-text">{babyName}</span>
          </h1>
        </motion.div>

        {/* Minimal Royal Seal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 140, delay: 0.25 }}
          onClick={handleUnwrap}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative cursor-pointer group"
        >
          {/* Outer Glow */}
          <div className="absolute -inset-3 rounded-3xl bg-blue-300/30 blur-lg group-hover:opacity-100 opacity-60 transition-opacity" />

          <div className="relative z-10 w-52 h-64 sm:w-56 sm:h-68 rounded-2xl bg-gradient-to-b from-white to-blue-50/60 p-6 shadow-xl border border-blue-200/80 flex flex-col items-center justify-between text-center">
            {/* Top Border Line */}
            <div className="w-10 h-0.5 hairline-blue" />

            {/* Center Royal Seal */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 shadow-lg border-2 border-white flex flex-col items-center justify-center text-white group-hover:rotate-6 transition-transform">
              <span className="text-2xl drop-shadow-sm">👑</span>
              <span className="text-[9px] font-royal tracking-widest uppercase font-bold mt-0.5">OPEN</span>
            </div>

            {/* Bottom Caption */}
            <div className="space-y-1">
              <span className="text-xs font-royal tracking-widest uppercase text-royalNavy-900 font-bold block">
                Tap To Open
              </span>
              <span className="text-[10px] text-slate-400 font-sans tracking-wide">
                Invitation Card
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Ambient Music Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-slate-400 mt-8 font-serif italic flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Includes ambient celebration music</span>
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};
