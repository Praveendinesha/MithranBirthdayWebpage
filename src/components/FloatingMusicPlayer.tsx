import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FloatingMusicPlayerProps {
  autoStart?: boolean;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({ autoStart = false }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (autoStart) {
      soundManager.startMelody();
      setIsPlaying(true);
    }
  }, [autoStart]);

  const handleToggle = () => {
    soundManager.playPop();
    const playing = soundManager.toggleMusic();
    setIsPlaying(playing);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-pastel-gold-200 text-xs font-medium text-pastel-navy-800 flex items-center gap-1.5"
          >
            <Music className="w-3.5 h-3.5 text-pastel-gold-500 animate-spin" />
            <span>{isPlaying ? 'Music Playing 🎶' : 'Music Paused 🔇'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`relative p-3 rounded-full backdrop-blur-md shadow-lg border transition-all duration-300 flex items-center justify-center ${
          isPlaying
            ? 'bg-gradient-to-r from-pastel-gold-400 to-amber-400 text-white border-amber-300 shadow-pastel-gold-300/50'
            : 'bg-white/90 text-pastel-navy-800 border-pastel-blue-200 hover:border-pastel-gold-300'
        }`}
        aria-label="Toggle ambient party music"
        title={isPlaying ? 'Mute Music' : 'Play Celebration Melody'}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
            {/* Pulsing ambient ring */}
            <span className="absolute -inset-1 rounded-full bg-pastel-gold-400/40 animate-ping pointer-events-none" />
          </div>
        ) : (
          <VolumeX className="w-5 h-5 text-gray-500" />
        )}

        {/* Floating animated musical note badge when active */}
        {isPlaying && (
          <motion.span
            animate={{
              y: [-2, -10, -2],
              opacity: [0.6, 1, 0.6],
              rotate: [-5, 10, -5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -right-1 text-[11px] font-bold"
          >
            🎵
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};
