import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquare } from 'lucide-react';
import { triggerCelebrationSideCannons, triggerUnwrapConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface PartyCelebrationModalProps {
  targetDate: Date;
  babyName: string;
  parents: string;
  venueName: string;
  whatsappUrl: string;
  forceOpenTrigger?: number;
}

export const PartyCelebrationModal: React.FC<PartyCelebrationModalProps> = ({
  targetDate,
  babyName,
  parents,
  venueName,
  whatsappUrl,
  forceOpenTrigger = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Monitor target time: 7:00 PM, Sunday Oct 04, 2026
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      if (now >= targetDate && !hasAutoOpened) {
        setHasAutoOpened(true);
        setIsOpen(true);
        soundManager.playFanfare();
        triggerUnwrapConfetti();
        triggerCelebrationSideCannons();
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, hasAutoOpened]);

  // Handle manual test preview trigger
  useEffect(() => {
    if (forceOpenTrigger > 0) {
      setIsOpen(true);
      soundManager.playFanfare();
      triggerUnwrapConfetti();
      triggerCelebrationSideCannons();
    }
  }, [forceOpenTrigger]);

  const handleClose = () => {
    soundManager.playPop();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 18, stiffness: 180 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-white via-pastel-cream-50 to-pastel-gold-50 p-6 sm:p-7 shadow-2xl border-2 border-pastel-gold-400 text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-pastel-navy-900 hover:bg-white/80 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Golden Crown & Cake Badge */}
          <motion.div
            animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-pastel-gold-300 to-amber-200 mx-auto flex items-center justify-center text-4xl shadow-xl border-3 border-white mb-4 relative"
          >
            <span>🎂</span>
            <span className="absolute -top-3 -right-2 text-2xl animate-wiggle">👑</span>
          </motion.div>

          {/* Live Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-extrabold tracking-widest uppercase mb-3 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LIVE NOW • 7:00 PM SHARP</span>
          </div>

          <h2 className="font-royal font-black text-2xl text-pastel-navy-900 leading-tight mb-2">
            🎉 IT'S PARTY TIME! 🎂
          </h2>

          <p className="font-display font-bold text-base text-pastel-gold-700 mb-2">
            {babyName} Turns One! 👑
          </p>

          <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto mb-5">
            Welcome to the celebration! Hosted with immense love by <span className="font-bold text-pastel-navy-900">{parents}</span> at <span className="font-bold text-pastel-navy-900">{venueName}</span>.
          </p>

          <div className="space-y-2.5">
            {/* WhatsApp Cheer */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playPop()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all group"
            >
              <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Send Birthday Wishes on WhatsApp 🎉</span>
            </a>

            {/* Close / Explore Invitation */}
            <button
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-2xl bg-white border border-pastel-gold-300 text-pastel-navy-900 font-bold text-xs hover:bg-pastel-gold-50 transition-colors"
            >
              <span>Explore Invitation Card 📜</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
