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
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-blue-200 text-xs font-serif italic text-slate-700 flex items-center gap-1.5"
          >
            <Music className="w-3.5 h-3.5 text-blue-600" />
            <span>{isPlaying ? 'Celebration Music Playing' : 'Music Paused'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`p-2.5 rounded-full backdrop-blur-md shadow-md border transition-all duration-300 flex items-center justify-center ${
          isPlaying
            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-400'
            : 'bg-white/90 text-slate-600 border-blue-200 hover:border-blue-300'
        }`}
        aria-label="Toggle ambient party music"
        title={isPlaying ? 'Mute Music' : 'Play Celebration Melody'}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-400" />
        )}
      </motion.button>
    </div>
  );
};
