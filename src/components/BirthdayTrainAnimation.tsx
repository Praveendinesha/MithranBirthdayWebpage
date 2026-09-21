import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

export const BirthdayTrainAnimation: React.FC = () => {
  const [isTooting, setIsTooting] = useState(false);
  const [showTootToast, setShowTootToast] = useState(false);

  const handleTrainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTrainWhistle();
    setIsTooting(true);
    setShowTootToast(true);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);

    setTimeout(() => setIsTooting(false), 800);
    setTimeout(() => setShowTootToast(false), 2200);
  };

  return (
    <div className="relative w-full overflow-hidden py-3 pointer-events-auto select-none my-4">
      {/* Train Track Line */}
      <div className="absolute bottom-2 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent flex items-center justify-around overflow-hidden pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 bg-blue-300/60 rounded-full" />
        ))}
      </div>

      {/* Moving Train Container */}
      <motion.div
        animate={{
          x: ['110vw', '-120%'],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="relative flex items-end cursor-pointer group"
        onClick={handleTrainClick}
        title="Tap the Mithran Royal Express!"
      >
        {/* Toot Toot Bubble Toast */}
        {showTootToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -28, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-6 left-12 bg-white/95 px-3 py-1 rounded-full shadow-lg border border-blue-200 text-[11px] font-royal font-bold text-blue-900 flex items-center gap-1 z-30"
          >
            <span>Choo Choo! 🚂💨</span>
          </motion.div>
        )}

        {/* Locomotive Engine */}
        <motion.div
          animate={isTooting ? { y: [-6, 0, -4, 0], rotate: [-2, 2, 0] } : { y: [0, -2, 0] }}
          transition={isTooting ? { duration: 0.4 } : { duration: 1.2, repeat: Infinity }}
          className="relative z-10 flex items-end"
        >
          {/* Steam Puffing Clouds */}
          <div className="absolute -top-5 left-3 flex gap-1 pointer-events-none">
            <motion.span
              animate={{ y: [-2, -14], opacity: [0.8, 0], scale: [0.6, 1.4] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              className="text-xs text-slate-300"
            >
              ☁️
            </motion.span>
            <motion.span
              animate={{ y: [-2, -18], opacity: [0.8, 0], scale: [0.8, 1.6] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              className="text-xs text-slate-300 -ml-1"
            >
              💨
            </motion.span>
          </div>

          {/* Engine Body */}
          <div className="h-10 px-3 rounded-t-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 border border-white shadow-md flex items-center justify-center text-white relative">
            {/* Chimney */}
            <div className="absolute -top-3 left-2 w-3 h-3 bg-blue-900 rounded-t-sm border-t border-white" />
            
            {/* Crown on Engine */}
            <span className="text-xs mr-1">👑</span>
            <span className="font-royal font-bold text-[10px] tracking-wider uppercase text-white drop-shadow-xs">
              Mithran Express
            </span>
          </div>

          {/* Engine Wheels */}
          <div className="absolute -bottom-1.5 inset-x-1 flex justify-around">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3.5 h-3.5 rounded-full border border-blue-950 bg-blue-300 inline-block shadow-xs"
            />
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3.5 h-3.5 rounded-full border border-blue-950 bg-blue-300 inline-block shadow-xs"
            />
          </div>
        </motion.div>

        {/* Coupler link 1 */}
        <span className="w-2 h-0.5 bg-blue-600 mb-2" />

        {/* Carriage 1: Gift Box Carriage */}
        <motion.div
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.15 }}
          className="relative h-8 px-2.5 rounded-t-lg bg-gradient-to-r from-blue-50/80 to-white border border-blue-200 shadow-xs flex items-center justify-center text-xs"
        >
          <span className="mr-0.5">🎁</span>
          <span className="text-[9px] font-royal font-bold text-blue-800">1st</span>
          <span className="ml-0.5">🧸</span>

          {/* Wheels */}
          <div className="absolute -bottom-1.5 inset-x-1 flex justify-between">
            <span className="w-3 h-3 rounded-full border border-blue-800 bg-blue-100 inline-block" />
            <span className="w-3 h-3 rounded-full border border-blue-800 bg-blue-100 inline-block" />
          </div>
        </motion.div>

        {/* Coupler link 2 */}
        <span className="w-2 h-0.5 bg-blue-600 mb-2" />

        {/* Carriage 2: Birthday Cake & Balloons Carriage */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
          className="relative h-8 px-2.5 rounded-t-lg bg-gradient-to-r from-blue-50/80 to-white border border-blue-200 shadow-xs flex items-center justify-center text-xs"
        >
          <span>🎂</span>
          <span className="text-[9px] font-sans font-bold text-blue-900 ml-1">Party</span>
          <span>🎈</span>

          {/* Wheels */}
          <div className="absolute -bottom-1.5 inset-x-1 flex justify-between">
            <span className="w-3 h-3 rounded-full border border-blue-800 bg-blue-100 inline-block" />
            <span className="w-3 h-3 rounded-full border border-blue-800 bg-blue-100 inline-block" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
