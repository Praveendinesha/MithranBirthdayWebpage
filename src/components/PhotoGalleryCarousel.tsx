import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryPhoto } from '../config/invitationData';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Heart, Maximize2, X } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

interface PhotoGalleryCarouselProps {
  photos: GalleryPhoto[];
  babyName?: string;
}

export const PhotoGalleryCarousel: React.FC<PhotoGalleryCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<{ [key: string]: boolean }>({});
  const timerRef = useRef<number | null>(null);

  const activePhoto = photos[currentIndex];

  useEffect(() => {
    if (isAutoPlay) {
      timerRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 4000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlay, photos.length]);

  const handleNext = () => {
    soundManager.playPop();
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    soundManager.playPop();
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleSelect = (idx: number) => {
    soundManager.playPop();
    setIsAutoPlay(false);
    setCurrentIndex(idx);
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundManager.playPop();
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);
  };

  return (
    <section className="px-5 sm:px-6 py-6 max-w-md mx-auto w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-pastel-gold-600 block">
            Precious Memories 📸
          </span>
          <h2 className="font-royal font-bold text-xl text-pastel-navy-900 tracking-wide">
            Baby & Family Moments
          </h2>
        </div>

        {/* Auto Play / Pause Button */}
        <button
          onClick={() => {
            soundManager.playPop();
            setIsAutoPlay(!isAutoPlay);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
            isAutoPlay
              ? 'bg-pastel-gold-100 text-pastel-gold-800 border border-pastel-gold-300'
              : 'bg-white text-gray-500 border border-gray-200'
          }`}
          title={isAutoPlay ? 'Pause Slideshow' : 'Start Auto Slideshow'}
        >
          {isAutoPlay ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Auto Play</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-pastel-gold-500 text-pastel-gold-500" />
              <span>Play</span>
            </>
          )}
        </button>
      </div>

      {/* Main Carousel Card */}
      <div className="relative rounded-3xl bg-white shadow-soft-card border border-pastel-gold-200/90 overflow-hidden group">
        {/* Photo Canvas */}
        <div
          className="relative h-72 sm:h-80 w-full bg-pastel-cream-100 overflow-hidden cursor-pointer"
          onClick={() => setSelectedLightboxPhoto(activePhoto)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activePhoto.id}
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Top Category Badge */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-bold text-pastel-navy-900 border border-pastel-gold-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pastel-gold-500" />
              {activePhoto.category}
            </span>
          </div>

          {/* Action Buttons on Photo (Like + Fullscreen) */}
          <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
            <button
              onClick={(e) => handleLike(e, activePhoto.id)}
              className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              title="Love this photo"
            >
              <Heart
                className={`w-5 h-5 ${
                  likedPhotos[activePhoto.id]
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-gray-400 hover:text-rose-400'
                }`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLightboxPhoto(activePhoto);
              }}
              className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-gray-600 hover:scale-110 active:scale-95 transition-transform"
              title="View full photo"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

          {/* Overlay Photo Title & Caption */}
          <div className="absolute bottom-3.5 inset-x-4 text-white z-10">
            <h3 className="font-display font-bold text-base text-white drop-shadow-sm mb-0.5">
              {activePhoto.title}
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed drop-shadow-xs line-clamp-1">
              {activePhoto.caption}
            </p>
          </div>
        </div>

        {/* Carousel Navigation Toolbar */}
        <div className="p-3.5 bg-white flex items-center justify-between border-t border-gray-100">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-gray-50 hover:bg-pastel-blue-50 text-pastel-navy-800 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Indicators / Thumbnails */}
          <div className="flex gap-1.5 items-center">
            {photos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => handleSelect(idx)}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-pastel-gold-500'
                    : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-gray-50 hover:bg-pastel-blue-50 text-pastel-navy-800 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail Bar */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
        {photos.map((photo, idx) => (
          <button
            key={photo.id}
            onClick={() => handleSelect(idx)}
            className={`shrink-0 w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${
              currentIndex === idx
                ? 'border-pastel-gold-500 scale-105 shadow-sm'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedLightboxPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedLightboxPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLightboxPhoto(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedLightboxPhoto.imageUrl}
                alt={selectedLightboxPhoto.title}
                className="w-full max-h-[70vh] object-cover"
              />

              <div className="p-5 bg-white">
                <span className="text-xs font-bold text-pastel-gold-600 uppercase tracking-wider block mb-1">
                  {selectedLightboxPhoto.category}
                </span>
                <h3 className="font-display font-bold text-lg text-pastel-navy-900 mb-1">
                  {selectedLightboxPhoto.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {selectedLightboxPhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
