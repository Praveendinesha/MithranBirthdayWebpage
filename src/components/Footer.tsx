import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Heart, ArrowUp, RotateCcw, Settings, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FooterProps {
  parents: string;
  babyName: string;
  onReplayUnwrap: () => void;
  onOpenAdmin?: () => void;
  onOpenCelebrationModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  parents,
  babyName,
  onReplayUnwrap,
  onOpenAdmin,
  onOpenCelebrationModal,
}) => {
  const scrollToTop = () => {
    soundManager.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 text-center relative border-t border-pastel-gold-200/60 bg-gradient-to-b from-transparent via-pastel-blue-50/30 to-pastel-gold-50/50">
      {/* Upper Section: Warm Family Closing Invitation */}
      <div className="pt-12 pb-8 px-6">
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-full border border-pastel-gold-300 flex items-center justify-center bg-white shadow-md mx-auto mb-4"
        >
          <Crown className="w-6 h-6 text-pastel-gold-500 fill-pastel-gold-400" />
        </motion.div>

        <h3 className="font-royal font-black text-lg sm:text-xl text-pastel-navy-900 mb-2">
          We Look Forward to Celebrating With You!
        </h3>

        <p className="font-serif italic text-sm text-slate-600 max-w-sm mx-auto leading-relaxed mb-6">
          "Your love, presence, and heartfelt blessings are the most precious gifts for our little prince {babyName} as he turns ONE!"
        </p>

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 backdrop-blur-xs border border-pastel-blue-200 text-xs sm:text-sm text-pastel-navy-900 shadow-sm">
          <span className="text-slate-400 font-medium">With Endless Love,</span>
          <span className="font-royal font-bold text-pastel-gold-700">{parents}</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="w-32 h-px bg-gradient-to-r from-transparent via-pastel-gold-300 to-transparent mx-auto my-4" />

      {/* Lower Section: Action Buttons & Utilities (Placed at More Bottom) */}
      <div className="pb-16 pt-4 px-5 bg-white/40 space-y-4">
        {/* Navigation & Action Links */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
          <button
            onClick={onReplayUnwrap}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-pastel-blue-50 text-slate-700 font-semibold border border-pastel-blue-200 transition-all shadow-xs hover:scale-105 active:scale-95"
            title="Replay the gift unwrap intro reveal"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pastel-blue-600" />
            <span>Replay Reveal</span>
          </button>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-pastel-blue-50 text-slate-700 font-semibold border border-pastel-blue-200 transition-all shadow-xs hover:scale-105 active:scale-95"
            title="Scroll smoothly back to top"
          >
            <ArrowUp className="w-3.5 h-3.5 text-pastel-blue-600" />
            <span>Back to Top</span>
          </button>

          {onOpenAdmin && (
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenAdmin();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-pastel-gold-100 to-amber-100 hover:from-pastel-gold-200 hover:to-amber-200 text-pastel-gold-800 font-bold border border-pastel-gold-300 transition-all shadow-xs hover:scale-105 active:scale-95"
              title="Client Portal: Manage photos, milestones and memories"
            >
              <Settings className="w-3.5 h-3.5 text-pastel-gold-700" />
              <span>Manage Photos</span>
            </button>
          )}
        </div>

        {/* 7:00 PM Celebration Preview Button */}
        {onOpenCelebrationModal && (
          <div className="flex justify-center pt-1">
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenCelebrationModal();
              }}
              className="text-[11px] font-bold text-pastel-gold-700 hover:text-pastel-gold-900 bg-white/80 hover:bg-pastel-gold-50 px-4 py-1.5 rounded-full border border-pastel-gold-200/80 transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-pastel-gold-500" />
              <span>Preview 7:00 PM Celebration Pop-up</span>
            </button>
          </div>
        )}

        <div className="pt-2 text-[10px] text-slate-400 font-sans tracking-widest uppercase font-medium">
          Royal 1st Birthday Milestone • Shri Magizh Mithran
        </div>
      </div>
    </footer>
  );
};
