import React from 'react';
import { motion } from 'framer-motion';

export const FloatingDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft pastel blue ambient light blooms */}
      <div className="absolute -top-36 -left-36 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-36 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl" />

      {/* Subtle floating sparkle 1 */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-8 text-blue-400 text-lg opacity-40"
      >
        ✨
      </motion.div>

      {/* Subtle floating sparkle 2 */}
      <motion.div
        animate={{
          y: [0, 14, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 right-8 text-sky-400 text-base opacity-30"
      >
        ✨
      </motion.div>
    </div>
  );
};
