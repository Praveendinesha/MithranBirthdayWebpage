import React from 'react';
import { motion } from 'framer-motion';

export const FloatingDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft gradient background orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-pastel-blue-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-88 h-88 bg-pastel-gold-200/30 rounded-full blur-3xl" />
      <div className="absolute top-2/3 -left-28 w-80 h-80 bg-pastel-rose-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-pastel-blue-100/50 rounded-full blur-3xl" />

      {/* Floating Star 1 */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [0, 15, -15, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-6 text-pastel-gold-400 text-2xl"
      >
        ✨
      </motion.div>

      {/* Floating Star 2 */}
      <motion.div
        animate={{
          y: [0, 22, 0],
          rotate: [0, -20, 20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-48 right-8 text-pastel-gold-400 text-xl"
      >
        ⭐
      </motion.div>

      {/* Floating Balloon 1 */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 8, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] -left-3 text-3xl opacity-35"
      >
        🎈
      </motion.div>

      {/* Floating Balloon 2 */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, -10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[65%] -right-2 text-3xl opacity-30"
      >
        🧸
      </motion.div>

      {/* Floating Cloud 1 */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-1/4 text-4xl opacity-20"
      >
        ☁️
      </motion.div>

      {/* Floating Crown / Star 3 */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-40 left-8 text-2xl text-pastel-gold-500/40"
      >
        ✨
      </motion.div>
    </div>
  );
};
