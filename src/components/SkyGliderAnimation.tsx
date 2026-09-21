import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

export const SkyGliderAnimation: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handlePlaneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playPop();
    setIsSpinning(true);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);

    setTimeout(() => setIsSpinning(false), 900);
  };

  return (
    <div className="relative w-full overflow-hidden h-14 pointer-events-auto select-none my-1">
      <motion.div
        animate={{
          x: ['-120%', '110vw'],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'linear',
          delay: 1,
        }}
        className="absolute top-1 flex items-center cursor-pointer group"
        onClick={handlePlaneClick}
        title="Tap the sky glider!"
      >
        {/* 1. Trailing Sky Banner (Towed behind the airplane on the left) */}
        <motion.div
          animate={{ y: [-1.5, 2, -1.5], rotate: [-1, 1.2, -1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative px-3 py-1 rounded-md bg-white/95 backdrop-blur-xs border border-blue-200 shadow-sm flex items-center gap-1.5"
        >
          <span className="text-xs">👑</span>
          <span className="font-royal font-bold text-[10px] sm:text-xs tracking-wider text-blue-900 uppercase">
            Mithran Turns One!
          </span>
          <span className="text-xs">🎈</span>
        </motion.div>

        {/* 2. Tow Line connecting banner to plane tail */}
        <div className="w-5 sm:w-7 h-0 border-t border-dashed border-blue-400/80 opacity-80" />

        {/* 3. Airplane Body (Leading on the right, flying forward) */}
        <motion.div
          animate={
            isSpinning
              ? { rotate: [0, 360], scale: [1, 1.3, 1] }
              : { y: [0, -3, 0], rotate: [0, 2, 0] }
          }
          transition={isSpinning ? { duration: 0.8 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-2xl flex items-center justify-center p-1"
        >
          <span className="filter drop-shadow-sm inline-block hover:scale-110 transition-transform">
            🛩️
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

