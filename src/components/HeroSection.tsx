import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Heart, Calendar, Clock, MapPin, Share2 } from 'lucide-react';
import { triggerHeartConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface HeroSectionProps {
  baby: {
    fullName: string;
    nicknames: string[];
    age: number;
    headline: string;
    subheadline: string;
    parents: string;
    photoUrl: string;
  };
  event: {
    dateFormatted: string;
    timeFormatted: string;
    venueName: string;
    hall: string;
  };
  onShareClick: () => void;
  onOpenAdmin?: (tab?: 'baby' | 'gallery' | 'milestones' | 'event') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ baby, event, onShareClick, onOpenAdmin }) => {
  const handlePhotoTap = (e: React.MouseEvent) => {
    soundManager.playPop();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);
  };

  return (
    <section className="relative pt-8 pb-10 px-5 sm:px-6 flex flex-col items-center text-center">
      {/* Royal Crown Pill */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => {
          if (onOpenAdmin) {
            soundManager.playPop();
            onOpenAdmin('baby');
          }
        }}
        className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-pastel-gold-100 via-white to-pastel-gold-100 border border-pastel-gold-300 text-pastel-gold-700 text-xs font-bold tracking-widest uppercase mb-6 shadow-xs cursor-pointer hover:border-pastel-gold-400 transition-colors"
        title="Tap to manage main baby photo & details"
      >
        <Crown className="w-4 h-4 fill-pastel-gold-500 text-pastel-gold-500" />
        <span className="font-royal tracking-widest text-[11px]">Royal 1st Birthday Milestone</span>
        <Sparkles className="w-4 h-4 text-pastel-gold-500" />
      </motion.div>

      {/* Royal Baby Photo Frame */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 0.1 }}
        className="relative mb-7 cursor-pointer select-none"
        onClick={handlePhotoTap}
        title="Tap me for love!"
      >
        {/* Soft Multi-Color Pastel Glow Aura */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-pastel-gold-400 via-pastel-blue-300 to-pastel-rose-300 blur-lg opacity-60 animate-pulse-glow pointer-events-none" />

        {/* Floating Crown on Top */}
        <motion.div
          animate={{
            y: [-4, 4, -4],
            rotate: [-3, 3, -3],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <span className="text-5xl filter drop-shadow-md select-none">👑</span>
        </motion.div>

        {/* Frame */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-b from-pastel-gold-300 via-white to-pastel-blue-200 shadow-2xl border-4 border-white overflow-hidden group">
          <img
            src={baby.photoUrl}
            alt={baby.fullName}
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
          />

          {/* Interactive Tap Hint Badge */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> Tap for love
            </span>
          </div>
        </div>

        {/* Floating Age Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="absolute -bottom-2 -right-2 z-20 w-14 h-14 rounded-full bg-gradient-to-br from-pastel-gold-400 to-amber-500 text-white font-display font-black text-xl flex flex-col items-center justify-center shadow-lg border-2 border-white"
        >
          <span className="leading-none">1</span>
          <span className="text-[9px] -mt-0.5 font-sans uppercase font-bold tracking-widest">Year</span>
        </motion.div>

        {/* Sparkle badge */}
        <div className="absolute -top-1 -left-2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-pastel-gold-200 flex items-center justify-center text-sm animate-wiggle">
          ✨
        </div>
      </motion.div>

      {/* Main Headline & BIG VISIBLE BABY NAME */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto w-full"
      >
        <p className="text-xs uppercase tracking-widest font-bold text-pastel-gold-700 mb-1 font-display">
          Our Little Prince Turns One! 👑
        </p>

        {/* BIG HIGH-VISIBILITY GOLDEN NAME */}
        <h1 className="font-royal font-black text-3xl sm:text-4xl text-pastel-navy-900 tracking-wide uppercase leading-tight mb-3 drop-shadow-xs">
          <span className="gold-gradient-text">{baby.fullName}</span>
        </h1>

        {/* Humorous GF Queue Highlight Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="my-5 p-4 rounded-3xl bg-gradient-to-r from-rose-50 via-pastel-cream-50 to-pastel-blue-50 border border-pastel-gold-300 shadow-xs max-w-sm mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-rose-600 mb-1 tracking-wide uppercase">
            <span>💃 The Girls Are Already In Queue! 💃</span>
          </div>
          <p className="text-xs sm:text-sm text-pastel-navy-900 font-medium leading-relaxed font-serif italic">
            "Join us to celebrate his ONE-derful birthday before he gets busy with his GFs!" 😉🍼
          </p>
        </motion.div>

        {/* Parents' Love Note */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-pastel-blue-200 text-xs text-pastel-navy-700 mb-6 shadow-xs">
          <span className="text-gray-500">With Love,</span>
          <span className="font-bold text-pastel-navy-900 text-sm">{baby.parents}</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>

        {/* Full Date & Venue Cards */}
        <div className="space-y-2.5 max-w-sm mx-auto mb-6 text-left">
          {/* Full Date & Time Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-pastel-blue-200 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pastel-blue-100 text-pastel-blue-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Date & Time
              </span>
              <p className="text-xs sm:text-sm font-bold text-pastel-navy-900 leading-snug">
                {event.dateFormatted}
              </p>
              <p className="text-xs font-semibold text-pastel-blue-600 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{event.timeFormatted}</span>
              </p>
            </div>
          </div>

          {/* Full Venue Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-pastel-gold-200 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pastel-gold-100 text-pastel-gold-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Celebration Venue
              </span>
              <p className="text-xs sm:text-sm font-bold text-pastel-navy-900 leading-snug">
                {event.venueName}
              </p>
              <p className="text-xs font-medium text-pastel-gold-700">
                {event.hall} • Erukanchery, Chennai
              </p>
            </div>
          </div>
        </div>

        {/* Share Button Pill */}
        <div className="flex justify-center">
          <button
            onClick={onShareClick}
            className="inline-flex items-center gap-1.5 text-xs text-pastel-blue-600 hover:text-pastel-blue-700 font-bold py-1.5 px-4 rounded-full bg-pastel-blue-50/80 hover:bg-pastel-blue-100 transition-colors border border-pastel-blue-200 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Invitation Card</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};
