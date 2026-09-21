import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MilestoneMonth } from '../config/invitationData';
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Sparkles, Maximize2, X, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

interface MemoryLaneMilestonesProps {
  milestones: MilestoneMonth[];
}

export const MemoryLaneMilestones: React.FC<MemoryLaneMilestonesProps> = ({ milestones }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [selectedLightboxMilestone, setSelectedLightboxMilestone] = useState<MilestoneMonth | null>(null);
  const [likedMonths, setLikedMonths] = useState<{ [key: number]: boolean }>({});
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<number | null>(null);

  const activeMilestone = milestones[currentIndex] || milestones[0];

  // Handle Autoplay slideshow
  useEffect(() => {
    if (isAutoPlay && !isFullView) {
      autoPlayTimerRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % milestones.length);
      }, 4000);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, isFullView, milestones.length]);

  // Scroll active tab into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const handleSelectMonth = (index: number) => {
    soundManager.playPop();
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    soundManager.playPop();
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % milestones.length);
  };

  const handlePrev = () => {
    soundManager.playPop();
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + milestones.length) % milestones.length);
  };

  const handleLike = (e: React.MouseEvent, month: number) => {
    e.stopPropagation();
    soundManager.playPop();
    setLikedMonths((prev) => ({ ...prev, [month]: !prev[month] }));

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);
  };

  return (
    <section className="px-5 sm:px-6 py-6 max-w-md mx-auto w-full">
      {/* Section Title Header */}
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
          onClick={() => {
            soundManager.playPop();
            setIsAutoPlay(!isAutoPlay);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
            isAutoPlay
              ? 'bg-gradient-to-r from-amber-400 to-pastel-gold-500 text-pastel-navy-900 border border-amber-300 ring-2 ring-pastel-gold-300'
              : 'bg-white text-pastel-navy-800 border border-pastel-blue-200 hover:border-pastel-gold-400'
          }`}
          title={isAutoPlay ? 'Pause 12s Tour' : 'Start 12s Auto Tour'}
        >
          {isAutoPlay ? (
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

      {/* Mode Switch Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => {
            soundManager.playPop();
            setIsFullView(!isFullView);
          }}
          className="text-[11px] font-bold text-pastel-blue-600 hover:text-pastel-blue-700 flex items-center gap-1"
        >
          <Layers className="w-3 h-3" />
          <span>{isFullView ? 'Switch to Interactive View' : 'View All 12 Months Grid'}</span>
        </button>
      </div>

      {!isFullView ? (
        <>
          {/* Horizontal Month Selector Pills (Scrubber) */}
          <div
            ref={scrollContainerRef}
            className="flex gap-1.5 overflow-x-auto pb-2 mb-3 hide-scrollbar pt-1"
          >
            {milestones.map((m, idx) => (
              <button
                key={m.month}
                onClick={() => handleSelectMonth(idx)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currentIndex === idx
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
            <div
              className="relative h-64 sm:h-72 w-full bg-pastel-blue-100 overflow-hidden cursor-pointer"
              onClick={() => setSelectedLightboxMilestone(activeMilestone)}
            >
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

              {/* Like & Zoom on Photo */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                <button
                  onClick={(e) => handleLike(e, activeMilestone.month)}
                  className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  title="Love this milestone"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedMonths[activeMilestone.month]
                        ? 'text-rose-500 fill-rose-500'
                        : 'text-gray-400 hover:text-rose-400'
                    }`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLightboxMilestone(activeMilestone);
                  }}
                  className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-gray-600 hover:scale-110 active:scale-95 transition-transform"
                  title="Zoom photo"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
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
                  <h3 className="font-display font-bold text-lg text-pastel-navy-900 mb-0.5">
                    {activeMilestone.title}
                  </h3>
                  <p className="text-xs font-semibold text-pastel-gold-600 mb-2">
                    {activeMilestone.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {activeMilestone.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
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
                      className={`h-1.5 rounded-full transition-all ${
                        currentIndex === i
                          ? 'w-4 bg-pastel-gold-500'
                          : 'w-1.5 bg-gray-200'
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
        </>
      ) : (
        /* Full Grid View */
        <div className="space-y-3">
          {milestones.map((m) => (
            <div
              key={m.month}
              className="p-3.5 rounded-2xl bg-white border border-pastel-blue-200 shadow-xs flex items-center gap-3 cursor-pointer hover:border-pastel-gold-300 transition-colors"
              onClick={() => setSelectedLightboxMilestone(m)}
            >
              <img
                src={m.image}
                alt={m.title}
                className="w-16 h-16 rounded-xl object-cover border border-pastel-gold-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-pastel-gold-700 uppercase">
                    Month {m.month}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400">
                    {m.badge}
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-pastel-navy-900 truncate">
                  {m.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedLightboxMilestone && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedLightboxMilestone(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full rounded-3xl overflow-hidden bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLightboxMilestone(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src={selectedLightboxMilestone.image}
                alt={selectedLightboxMilestone.title}
                className="w-full max-h-[65vh] object-cover"
              />

              <div className="p-5 bg-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-royal font-bold uppercase">
                    Month {selectedLightboxMilestone.month}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {selectedLightboxMilestone.badge}
                  </span>
                </div>
                <h3 className="font-royal font-bold text-base text-royalNavy-800 mb-1">
                  {selectedLightboxMilestone.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedLightboxMilestone.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
