import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquare, Crown } from 'lucide-react';
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

  // Handle manual preview trigger
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
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 18, stiffness: 180 }}
          className="relative w-full max-w-sm rounded-3xl bg-white p-7 sm:p-8 shadow-2xl border border-blue-200 text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-royalNavy-800 hover:bg-slate-100 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Royal Crown Emblem */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center shadow-xs border border-blue-200 mb-4"
          >
            <Crown className="w-8 h-8 text-blue-600 fill-blue-300" />
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-royal font-bold tracking-widest uppercase mb-3 border border-blue-100">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Celebration Live • 7:00 PM</span>
          </div>

          <h2 className="font-royal font-black text-2xl text-royalNavy-800 leading-tight mb-2">
            🎉 IT'S PARTY TIME! 🎂
          </h2>

          <p className="font-royal font-bold text-base text-blue-600 mb-2">
            {babyName} Turns One! 👑
          </p>

          <p className="font-serif italic text-sm text-slate-600 leading-relaxed max-w-xs mx-auto mb-6">
            Welcome to the royal celebration hosted with love by <span className="font-bold text-royalNavy-800">{parents}</span> at <span className="font-bold text-royalNavy-800">{venueName}</span>.
          </p>

          <div className="space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playPop()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-royal font-bold text-xs flex items-center justify-center gap-2 shadow-luxury hover:opacity-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Birthday Wishes on WhatsApp 🎉</span>
            </a>

            <button
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-royalNavy-800 font-royal font-bold text-xs hover:bg-blue-100 transition-colors"
            >
              <span>Explore Invitation Card 📜</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
