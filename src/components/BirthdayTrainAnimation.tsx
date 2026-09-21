import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

export const BirthdayTrainAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const [isTooting, setIsTooting] = useState(false);
  const [showTootToast, setShowTootToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Train position MotionValue for smooth continuous 60fps movement + drag control
  const x = useMotionValue(100);
  const isDraggingRef = useRef(false);
  isDraggingRef.current = isDragging;

  // Base chugging speed (pixels per second, negative = right to left)
  const speedRef = useRef(-48);

  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const update = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1); // clamp delta to avoid huge jumps
      lastTime = time;

      if (!isDraggingRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth || 400;
        const trainWidth = trainRef.current?.clientWidth || 280;

        let currentX = x.get();
        currentX += speedRef.current * delta;

        // Seamless wrap-around: As soon as the entire train exits the left edge,
        // it instantly re-enters from the right edge with zero empty lag!
        if (currentX < -trainWidth) {
          currentX = containerWidth + 10;
        } else if (currentX > containerWidth + 30) {
          currentX = -trainWidth;
        }

        x.set(currentX);
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [x]);

  const handleWhistle = (e?: React.MouseEvent | React.TouchEvent) => {
    soundManager.playTrainWhistle();
    setIsTooting(true);
    setShowTootToast(true);

    if (e && 'clientX' in e) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const clientX = (rect.left + rect.width / 2) / window.innerWidth;
      const clientY = (rect.top + rect.height / 2) / window.innerHeight;
      triggerHeartConfetti(clientX, clientY);
    } else {
      triggerHeartConfetti(0.5, 0.45);
    }

    setTimeout(() => setIsTooting(false), 800);
    setTimeout(() => setShowTootToast(false), 2400);
  };

  // Clicking on the track line jumps / pulls the train towards that point
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 120; // center train on click
    x.set(clickX);
    handleWhistle(e);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-3 pointer-events-auto select-none my-2 cursor-pointer"
      onClick={handleTrackClick}
      title="Tap or Pull Mithran Express along the track!"
    >
      {/* Track Background Railroad Ties */}
      <div className="absolute bottom-2.5 inset-x-0 h-1.5 flex items-center justify-around overflow-hidden pointer-events-none opacity-80">
        {/* Railroad Steel Rails */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent shadow-2xs" />
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent shadow-2xs" />
        
        {/* Railroad Wooden Ties */}
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-3 bg-pastel-gold-300/60 border-l border-r border-pastel-gold-500/40 rounded-2xs inline-block shrink-0"
          />
        ))}
      </div>

      {/* Interactive Draggable Moving Train */}
      <motion.div
        ref={trainRef}
        style={{ x }}
        drag="x"
        dragElastic={0.15}
        dragMomentum={true}
        onDragStart={() => {
          setIsDragging(true);
          soundManager.playPop();
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          // If user flicked the train, slightly boost forward velocity
          if (info.velocity.x < -100) {
            speedRef.current = -70;
            setTimeout(() => {
              speedRef.current = -48;
            }, 1500);
          }
          handleWhistle();
        }}
        className="relative flex items-end cursor-grab active:cursor-grabbing group z-20"
        onClick={(e) => {
          e.stopPropagation();
          handleWhistle(e);
        }}
      >
        {/* Toot Toot Bubble Toast */}
        {showTootToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-7 left-8 bg-white/95 px-3 py-1 rounded-full shadow-lg border border-pastel-blue-300 text-[11px] font-royal font-bold text-pastel-navy-900 flex items-center gap-1 z-30"
          >
            <span>Choo Choo! 🚂💨</span>
          </motion.div>
        )}

        {/* Locomotive Engine */}
        <motion.div
          animate={isTooting ? { y: [-6, 0, -4, 0], rotate: [-2, 2, 0] } : { y: [0, -2, 0] }}
          transition={isTooting ? { duration: 0.4 } : { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 flex items-end"
        >
          {/* Steam Puffing Clouds */}
          <div className="absolute -top-5 left-3 flex gap-1 pointer-events-none">
            <motion.span
              animate={{ y: [-2, -14], opacity: [0.9, 0], scale: [0.6, 1.5] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: 'easeOut' }}
              className="text-xs text-slate-300 select-none"
            >
              ☁️
            </motion.span>
            <motion.span
              animate={{ y: [-2, -18], opacity: [0.9, 0], scale: [0.8, 1.8] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
              className="text-xs text-slate-300 -ml-1 select-none"
            >
              💨
            </motion.span>
          </div>

          {/* Engine Body */}
          <div className="h-10 px-3.5 rounded-t-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 border border-white shadow-md flex items-center justify-center text-white relative">
            {/* Chimney */}
            <div className="absolute -top-3 left-2 w-3.5 h-3 bg-blue-900 rounded-t-sm border-t border-white" />

            {/* Front Headlight Glow */}
            <div className="absolute -left-1.5 top-3 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] border border-white" />

            {/* Crown on Engine */}
            <span className="text-xs mr-1">👑</span>
            <span className="font-royal font-bold text-[10px] tracking-wider uppercase text-white drop-shadow-xs">
              Mithran Express
            </span>
          </div>

          {/* Engine Wheels */}
          <div className="absolute -bottom-1.5 inset-x-1 flex justify-around">
            <motion.span
              animate={{ rotate: isDragging ? [0, -360] : -360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              className="w-3.5 h-3.5 rounded-full border border-blue-950 bg-amber-300 inline-block shadow-2xs"
            />
            <motion.span
              animate={{ rotate: isDragging ? [0, -360] : -360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              className="w-3.5 h-3.5 rounded-full border border-blue-950 bg-amber-300 inline-block shadow-2xs"
            />
          </div>
        </motion.div>

        {/* Coupler link 1 */}
        <span className="w-2.5 h-0.5 bg-blue-600 mb-2 shrink-0" />

        {/* Carriage 1: Gift Box Carriage */}
        <motion.div
          animate={{ y: [0, -1.8, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.15, ease: 'easeInOut' }}
          className="relative h-8 px-2.5 rounded-t-lg bg-gradient-to-r from-pastel-gold-50 to-white border border-pastel-gold-200 shadow-2xs flex items-center justify-center text-xs shrink-0"
        >
          <span className="mr-0.5">🎁</span>
          <span className="text-[9px] font-royal font-bold text-pastel-navy-900">1st</span>
          <span className="ml-0.5">🧸</span>

          {/* Wheels */}
          <div className="absolute -bottom-1.5 inset-x-1 flex justify-between">
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 rounded-full border border-blue-800 bg-blue-100 inline-block shadow-2xs"
            />
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 rounded-full border border-blue-800 bg-blue-100 inline-block shadow-2xs"
            />
          </div>
        </motion.div>

        {/* Coupler link 2 */}
        <span className="w-2.5 h-0.5 bg-blue-600 mb-2 shrink-0" />

        {/* Carriage 2: Birthday Cake & Balloons Carriage */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.3, ease: 'easeInOut' }}
          className="relative h-8 px-2.5 rounded-t-lg bg-gradient-to-r from-pastel-blue-50 to-white border border-pastel-blue-200 shadow-2xs flex items-center justify-center text-xs shrink-0"
        >
          <span>🎂</span>
          <span className="text-[9px] font-sans font-bold text-blue-900 ml-0.5 mr-0.5">Party</span>
          <span>🎈</span>

          {/* Wheels */}
          <div className="absolute -bottom-1.5 inset-x-1 flex justify-between">
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 rounded-full border border-blue-800 bg-blue-100 inline-block shadow-2xs"
            />
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 rounded-full border border-blue-800 bg-blue-100 inline-block shadow-2xs"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
