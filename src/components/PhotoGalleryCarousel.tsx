import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryPhoto } from '../config/invitationData';
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Maximize2, X } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

interface PhotoGalleryCarouselProps {
  photos: GalleryPhoto[];
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
      }, 4500);
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
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-pastel-gold-600 block">
            Photo Moments 🌟
          </span>
          <h2 className="font-display font-extrabold text-xl text-pastel-navy-900">
            Baby & Family Moments 📸
          </h2>
        </div>

        {/* Auto Play Toggle */}
        <button
          onClick={() => {
            soundManager.playPop();
            setIsAutoPlay(!isAutoPlay);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
            isAutoPlay
              ? 'bg-gradient-to-r from-amber-400 to-pastel-gold-500 text-pastel-navy-900 border border-amber-300'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-pastel-gold-300'
          }`}
          title={isAutoPlay ? 'Pause Slideshow' : 'Start Auto Slideshow'}
        >
          {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-pastel-gold-500 text-pastel-gold-500" />}
          <span>{isAutoPlay ? 'Auto' : 'Play'}</span>
        </button>
      </div>

      {/* Main Card Frame */}
      <div className="relative rounded-3xl bg-white shadow-soft-card border border-pastel-blue-200 overflow-hidden group">
        {/* Photo Container */}
        <div
          className="relative h-80 sm:h-96 w-full bg-pastel-blue-100 overflow-hidden cursor-pointer"
          onClick={() => setSelectedLightboxPhoto(activePhoto)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activePhoto.id}
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Top Category Tag */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-extrabold text-pastel-navy-900 border border-pastel-gold-200 flex items-center gap-1">
              ✨ {activePhoto.category}
            </span>
          </div>

          {/* Action Buttons (Like + Fullscreen) */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <button
              onClick={(e) => handleLike(e, activePhoto.id)}
              className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              title="Love this photo"
            >
              <Heart
                className={`w-4 h-4 ${
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
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Subtle Bottom Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Photo Info */}
          <div className="absolute bottom-3 inset-x-4 text-white z-10">
            <h3 className="font-display font-bold text-base text-white drop-shadow-sm mb-0.5">
              {activePhoto.title}
            </h3>
            <p className="text-xs text-white/90 font-sans leading-relaxed drop-shadow-xs line-clamp-1">
              {activePhoto.caption}
            </p>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="px-4 py-3 bg-white flex items-center justify-between border-t border-gray-100">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-pastel-navy-700 hover:bg-pastel-blue-50 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="flex gap-1.5 items-center">
            {photos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  soundManager.playPop();
                  setIsAutoPlay(false);
                  setCurrentIndex(idx);
                }}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-5 h-1.5 bg-pastel-gold-500'
                    : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-pastel-navy-700 hover:bg-pastel-blue-50 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedLightboxPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedLightboxPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLightboxPhoto(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src={selectedLightboxPhoto.imageUrl}
                alt={selectedLightboxPhoto.title}
                className="w-full max-h-[70vh] object-cover"
              />

              <div className="p-5 bg-white">
                <span className="text-[10px] font-royal font-bold text-blue-600 uppercase tracking-widest block mb-1">
                  {selectedLightboxPhoto.category}
                </span>
                <h3 className="font-royal font-bold text-lg text-royalNavy-800 mb-1">
                  {selectedLightboxPhoto.title}
                </h3>
                <p className="text-xs text-slate-600">
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
