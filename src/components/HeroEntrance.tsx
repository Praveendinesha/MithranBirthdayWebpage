import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Crown, Heart } from 'lucide-react';
import { triggerUnwrapConfetti, triggerCelebrationSideCannons } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface HeroEntranceProps {
  onUnwrap: () => void;
  babyName: string;
}

export const HeroEntrance: React.FC<HeroEntranceProps> = ({ onUnwrap, babyName }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleUnwrap = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Sound fanfare
    soundManager.playFanfare();
    soundManager.startMelody();

    // Trigger explosive confetti
    triggerUnwrapConfetti();
    setTimeout(() => {
      triggerCelebrationSideCannons();
    }, 400);

    // Dismiss overlay after opening animation completes
    setTimeout(() => {
      onUnwrap();
    }, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#EBF5FB] via-[#FFFDF9] to-[#FDF4EB] overflow-hidden"
      >
        {/* Ambient background glow & decorative floating icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-8 text-3xl animate-float opacity-70">🎈</div>
          <div className="absolute top-16 right-10 text-3xl animate-float-slow opacity-60">☁️</div>
          <div className="absolute bottom-16 left-12 text-3xl animate-float opacity-50">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-float-slow opacity-70">🎈</div>
          <div className="absolute top-1/2 left-4 text-2xl animate-wiggle opacity-40">⭐</div>
          <div className="absolute top-1/3 right-6 text-2xl animate-wiggle opacity-40">👑</div>
          
          {/* Radial gold background highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] bg-gradient-to-r from-pastel-gold-200/40 via-pastel-blue-200/40 to-pastel-rose-100/40 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-pastel-gold-300/80 shadow-sm mb-6"
        >
          <Crown className="w-4 h-4 text-pastel-gold-500 fill-pastel-gold-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-pastel-navy-800 uppercase">
            Royal 1st Birthday Invitation
          </span>
          <Sparkles className="w-4 h-4 text-pastel-gold-500" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center font-display font-extrabold text-2xl sm:text-3xl text-pastel-navy-900 mb-2 px-4 max-w-sm"
        >
          A Special Milestone For <br />
          <span className="gold-gradient-text text-3xl sm:text-4xl">{babyName}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xs sm:text-sm text-gray-500 text-center mb-8 max-w-xs"
        >
          You are cordially invited to celebrate our little prince turning one!
        </motion.p>

        {/* Interactive 3D Pulsing Gift Box */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 150, delay: 0.4 }}
          className="relative cursor-pointer group my-3"
          onClick={handleUnwrap}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Pulsing Aura Rings */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-pastel-gold-300/40 via-pastel-blue-300/40 to-pastel-rose-300/40 blur-xl animate-pulse-glow" />
          
          <motion.div
            animate={isOpening ? { scale: [1, 1.25, 0], rotate: [0, -10, 15, 0], opacity: [1, 1, 0] } : {
              y: isHovered ? -8 : [0, -8, 0],
              scale: isHovered ? 1.05 : 1,
            }}
            transition={isOpening ? { duration: 0.8 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-br from-white via-pastel-cream-100 to-pastel-blue-100 p-1 shadow-2xl border-2 border-pastel-gold-300/80 flex flex-col items-center justify-center text-center overflow-hidden"
          >
            {/* Ribbon crossing */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-pastel-gold-400 via-amber-300 to-pastel-gold-400 shadow-md flex items-center justify-center opacity-90" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-pastel-gold-400 via-amber-300 to-pastel-gold-400 shadow-md opacity-90" />

            {/* Ribbon Bow on Top */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
              <div className="relative">
                <span className="text-4xl drop-shadow-md">🎀</span>
              </div>
            </div>

            {/* Gift Icon Center Badge */}
            <div className="relative z-20 w-20 h-20 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-pastel-gold-300 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
              <Gift className="w-10 h-10 text-pastel-gold-500 fill-pastel-gold-100" />
            </div>

            {/* Floating Sparkles inside Box */}
            <span className="absolute top-6 left-6 text-base animate-wiggle z-20">✨</span>
            <span className="absolute bottom-6 right-6 text-base animate-wiggle z-20">⭐</span>
          </motion.div>
        </motion.div>

        {/* Tap to Unwrap Button / CTA */}
        <motion.button
          onClick={handleUnwrap}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-pastel-gold-400 via-amber-400 to-pastel-gold-500 text-pastel-navy-900 font-display font-bold text-base shadow-soft-gold border border-amber-200 flex items-center gap-3 overflow-hidden cursor-pointer"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer-badge pointer-events-none" />
          
          <Sparkles className="w-5 h-5 text-pastel-navy-900 animate-spin" />
          <span>Tap to Unwrap Invite 🎁</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform" />
        </motion.button>

        {/* Audio note indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[11px] text-gray-400 mt-4 flex items-center gap-1.5"
        >
          <span>🎵 Sound & ambient music ready</span>
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};
