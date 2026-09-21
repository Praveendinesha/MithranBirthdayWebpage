import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

interface BalloonItem {
  id: number;
  emoji: string;
  initialX: number;
  duration: number;
  delay: number;
}

const BALLOON_ICONS = ['🎈', '✨', '🧸', '⭐', '🎈', '💖'];

export const InteractiveFloatingBalloons: React.FC = () => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([
    { id: 1, emoji: '🎈', initialX: 8, duration: 18, delay: 0 },
    { id: 2, emoji: '✨', initialX: 85, duration: 15, delay: 3 },
    { id: 3, emoji: '🧸', initialX: 12, duration: 22, delay: 6 },
    { id: 4, emoji: '⭐', initialX: 88, duration: 19, delay: 9 },
  ]);

  const handlePop = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    soundManager.playPop();

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);

    // Remove balloon and respawn after 4 seconds
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setTimeout(() => {
      const nextId = Date.now();
      const randomEmoji = BALLOON_ICONS[Math.floor(Math.random() * BALLOON_ICONS.length)];
      const randomX = Math.random() > 0.5 ? Math.random() * 15 + 5 : Math.random() * 15 + 80;
      setBalloons((prev) => [
        ...prev,
        { id: nextId, emoji: randomEmoji, initialX: randomX, duration: 18, delay: 0 },
      ]);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {balloons.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{
              y: '-20vh',
              opacity: [0, 0.7, 0.7, 0],
              x: [0, (b.initialX > 50 ? -12 : 12), 0],
            }}
            exit={{ scale: 2, opacity: 0, filter: 'blur(4px)' }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: b.delay,
            }}
            style={{ left: `${b.initialX}%` }}
            className="absolute cursor-pointer pointer-events-auto select-none p-2 hover:scale-125 active:scale-90 transition-transform"
            onClick={(e) => handlePop(e, b.id)}
            title="Tap to pop!"
          >
            <span className="text-2xl sm:text-3xl filter drop-shadow-xs">{b.emoji}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
