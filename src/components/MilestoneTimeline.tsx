import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MilestoneMonth } from '../config/invitationData';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

interface MilestoneTimelineProps {
  milestones: MilestoneMonth[];
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [likedMonths, setLikedMonths] = useState<{ [key: number]: boolean }>({});
  const timerRef = useRef<number | null>(null);

  const activeMilestone = milestones[currentMonthIndex];

  // Auto tour: 12 months in 12 seconds (1 second per month)
  useEffect(() => {
    if (isPlayingTour) {
      timerRef.current = window.setInterval(() => {
        setCurrentMonthIndex((prev) => {
          if (prev >= milestones.length - 1) {
            setIsPlayingTour(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingTour, milestones.length]);

  const handlePrev = () => {
    soundManager.playPop();
    setIsPlayingTour(false);
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : milestones.length - 1));
  };

  const handleNext = () => {
    soundManager.playPop();
    setIsPlayingTour(false);
    setCurrentMonthIndex((prev) => (prev < milestones.length - 1 ? prev + 1 : 0));
  };

  const handleSelectMonth = (idx: number) => {
    soundManager.playPop();
    setIsPlayingTour(false);
    setCurrentMonthIndex(idx);
  };

  const toggleTour = () => {
    soundManager.playPop();
    if (isPlayingTour) {
      setIsPlayingTour(false);
    } else {
      if (currentMonthIndex >= milestones.length - 1) {
        setCurrentMonthIndex(0);
      }
      setIsPlayingTour(true);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    soundManager.playPop();
    setLikedMonths((prev) => ({ ...prev, [activeMilestone.month]: !prev[activeMilestone.month] }));
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);
  };

  return (
    <section className="px-4 py-6 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-pastel-gold-600 block">
            Memory Lane 🚀
          </span>
          <h2 className="font-display font-extrabold text-xl text-pastel-navy-900">
            12 Months in 12 Seconds
          </h2>
        </div>

        {/* 12s Auto Tour Button */}
        <button
          onClick={toggleTour}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isPlayingTour
              ? 'bg-gradient-to-r from-amber-400 to-pastel-gold-500 text-pastel-navy-900 border border-amber-300 ring-2 ring-pastel-gold-300'
              : 'bg-white text-pastel-navy-800 border border-pastel-blue-200 hover:border-pastel-gold-400'
          }`}
        >
          {isPlayingTour ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Tour</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-pastel-gold-500 text-pastel-gold-500" />
              <span>12s Auto Tour</span>
            </>
          )}
        </button>
      </div>

      {/* Horizontal Month Selector Pills (Scrubber) */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 hide-scrollbar pt-1">
        {milestones.map((m, idx) => (
          <button
            key={m.month}
            onClick={() => handleSelectMonth(idx)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              currentMonthIndex === idx
                ? 'bg-pastel-navy-800 text-white shadow-md scale-105'
                : 'bg-white/80 text-gray-500 border border-gray-200/80 hover:border-pastel-blue-300'
            }`}
          >
            M{m.month}
          </button>
        ))}
      </div>

      {/* Main Milestone Card */}
      <div className="relative rounded-3xl bg-white shadow-soft-card border border-pastel-blue-200 overflow-hidden">
        {/* Photo Container */}
        <div className="relative h-60 sm:h-64 w-full bg-pastel-blue-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeMilestone.month}
              src={activeMilestone.image}
              alt={activeMilestone.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Month Badge Overlay */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-extrabold text-pastel-navy-900 border border-pastel-gold-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pastel-gold-500" />
              Month {activeMilestone.month} of 12
            </span>
          </div>

          {/* Like Button on Photo */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                likedMonths[activeMilestone.month]
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-gray-400 hover:text-rose-400'
              }`}
            />
          </button>

          {/* Bottom Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end text-white">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs">
              {activeMilestone.badge}
            </span>
            <span className="text-[11px] opacity-90 font-medium">
              {activeMilestone.stats.label}: {activeMilestone.stats.value}
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.month}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-bold text-lg text-pastel-navy-900">
                  {activeMilestone.title}
                </h3>
              </div>

              <p className="text-xs font-semibold text-pastel-gold-600 mb-2">
                {activeMilestone.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {activeMilestone.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next Controls */}
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 text-xs font-bold text-pastel-navy-700 hover:text-pastel-navy-900 p-1.5 rounded-lg hover:bg-pastel-blue-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Progress Dots */}
            <div className="flex gap-1">
              {milestones.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentMonthIndex === i
                      ? 'w-4 bg-pastel-gold-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-xs font-bold text-pastel-navy-700 hover:text-pastel-navy-900 p-1.5 rounded-lg hover:bg-pastel-blue-50 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
