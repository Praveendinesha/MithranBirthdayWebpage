import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

export const SkyGliderAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gliderRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Position MotionValues for 60fps continuous glide
  const x = useMotionValue(-150);
  const y = useMotionValue(0);

  const isDraggingRef = useRef(false);
  isDraggingRef.current = isDragging;

  // Forward flight speed (pixels per second, left to right: positive)
  const speedRef = useRef(42);

  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const update = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!isDraggingRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth || 400;
        const gliderWidth = gliderRef.current?.clientWidth || 220;

        let currentX = x.get();
        currentX += speedRef.current * delta;

        // Seamless wrap-around: When airplane & banner completely exit right edge,
        // it seamlessly enters from left edge with 0 empty delay!
        if (currentX > containerWidth + 10) {
          currentX = -gliderWidth - 10;
        } else if (currentX < -gliderWidth - 30) {
          currentX = containerWidth + 10;
        }

        x.set(currentX);

        // Gentle sinusoidal wave for realistic flight altitude
        const altitude = Math.sin(time / 480) * 3.5;
        y.set(altitude);
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [x, y]);

  const handlePlaneClick = (e?: React.MouseEvent | React.TouchEvent) => {
    soundManager.playPop();
    setIsSpinning(true);

    if (e && 'clientX' in e) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const clientX = (rect.left + rect.width / 2) / window.innerWidth;
      const clientY = (rect.top + rect.height / 2) / window.innerHeight;
      triggerHeartConfetti(clientX, clientY);
    } else {
      triggerHeartConfetti(0.5, 0.15);
    }

    setTimeout(() => setIsSpinning(false), 900);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden h-12 pointer-events-auto select-none my-1 cursor-pointer"
      title="Tap or Glide the sky airplane across the screen!"
    >
      {/* Background Soft Sky Clouds */}
      <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none opacity-40">
        <span className="text-sm select-none animate-pulse">☁️</span>
        <span className="text-xs select-none">✨</span>
        <span className="text-xs select-none animate-pulse delay-700">☁️</span>
      </div>

      {/* Interactive Draggable Moving Airplane with Trailing Banner */}
      <motion.div
        ref={gliderRef}
        style={{ x, y }}
        drag="x"
        dragElastic={0.15}
        dragMomentum={true}
        onDragStart={() => {
          setIsDragging(true);
          soundManager.playPop();
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          if (info.velocity.x > 100) {
            speedRef.current = 65;
            setTimeout(() => {
              speedRef.current = 42;
            }, 1500);
          }
          handlePlaneClick();
        }}
        className="absolute top-1 flex items-center cursor-grab active:cursor-grabbing group z-20"
        onClick={(e) => {
          e.stopPropagation();
          handlePlaneClick(e);
        }}
      >
        {/* 1. Trailing Sky Banner (Towed behind airplane on the left) */}
        <motion.div
          animate={{ rotate: [-1.2, 1.2, -1.2] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-pastel-gold-300 shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <span className="text-xs">👑</span>
          <span className="font-royal font-bold text-[10px] sm:text-xs tracking-wider text-pastel-navy-900 uppercase">
            Mithran Turns One!
          </span>
          <span className="text-xs">🎈</span>
        </motion.div>

        {/* 2. Tow Line connecting banner to plane tail */}
        <div className="w-5 sm:w-6 h-0 border-t border-dashed border-pastel-blue-400 opacity-80 shrink-0" />

        {/* 3. Airplane Body (Leading on the right, flying forward) */}
        <motion.div
          animate={
            isSpinning
              ? { rotate: [0, 360], scale: [1, 1.3, 1] }
              : { rotate: [0, 2, 0] }
          }
          transition={
            isSpinning
              ? { duration: 0.8, ease: 'easeInOut' }
              : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative text-2xl flex items-center justify-center p-0.5 shrink-0"
        >
          <span className="filter drop-shadow-xs inline-block group-hover:scale-110 transition-transform">
            🛩️
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};
