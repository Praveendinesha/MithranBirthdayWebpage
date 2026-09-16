import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Heart, ArrowUp, RotateCcw, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FooterProps {
  parents: string;
  babyName: string;
  onReplayUnwrap: () => void;
}

export const Footer: React.FC<FooterProps> = ({ parents, babyName, onReplayUnwrap }) => {
  const scrollToTop = () => {
    soundManager.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-8 pb-12 pt-8 px-4 text-center relative border-t border-pastel-blue-100/80 bg-gradient-to-b from-transparent via-white/70 to-pastel-blue-50/50">
      {/* Decorative Crown */}
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-10 h-10 rounded-2xl bg-pastel-gold-100 text-pastel-gold-600 mx-auto flex items-center justify-center mb-3 shadow-xs"
      >
        <Crown className="w-5 h-5 fill-pastel-gold-400" />
      </motion.div>

      <h3 className="font-display font-bold text-base text-pastel-navy-900 mb-1">
        Thank You for Being Part of Our Story
      </h3>

      <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed mb-4">
        We cannot wait to celebrate {babyName}'s first milestone with all the people who make his world so bright!
      </p>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-pastel-gold-200 text-xs font-semibold text-pastel-navy-800 shadow-xs mb-6">
        <span>With endless love,</span>
        <span className="text-pastel-gold-600 font-bold">{parents}</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
      </div>

      {/* Action Links */}
      <div className="flex items-center justify-center gap-3 text-xs">
        <button
          onClick={onReplayUnwrap}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pastel-blue-50 hover:bg-pastel-blue-100 text-pastel-blue-700 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Unwrap Gift</span>
        </button>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-pastel-navy-800 font-medium transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>
      </div>

      <div className="mt-8 text-[11px] text-gray-400 flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-pastel-gold-400" />
        <span>Crafted with love for Prince Liam's 1st Birthday</span>
        <Sparkles className="w-3 h-3 text-pastel-gold-400" />
      </div>
    </footer>
  );
};
