import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, PartyPopper } from 'lucide-react';
import { triggerCelebrationSideCannons } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface CountdownTimerProps {
  targetDate: Date;
  onOpenCelebrationModal?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onOpenCelebrationModal }) => {
  const confettiFiredRef = useRef<boolean>(false);

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);

      if (updated.isExpired && !confettiFiredRef.current) {
        confettiFiredRef.current = true;
        triggerCelebrationSideCannons();
        if (onOpenCelebrationModal) onOpenCelebrationModal();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onOpenCelebrationModal]);

  const units = [
    { label: 'Days', value: timeLeft.days, color: 'from-pastel-blue-100 to-pastel-blue-200 text-pastel-navy-900 border-pastel-blue-300' },
    { label: 'Hours', value: timeLeft.hours, color: 'from-pastel-gold-100 to-pastel-gold-200 text-pastel-navy-900 border-pastel-gold-300' },
    { label: 'Mins', value: timeLeft.minutes, color: 'from-pastel-rose-50 to-pastel-rose-100 text-pastel-navy-900 border-pastel-rose-200' },
    { label: 'Secs', value: timeLeft.seconds, color: 'from-pastel-mint-50 to-pastel-mint-100 text-pastel-navy-900 border-pastel-mint-200' },
  ];

  return (
    <section className="px-4 sm:px-6 py-5 max-w-md mx-auto w-full">
      <div className="relative rounded-3xl p-6 glass-card-gold shadow-soft-card border-2 border-pastel-gold-200 overflow-hidden">
        {/* Decorative corner stars */}
        <span className="absolute top-3 right-3 text-sm text-pastel-gold-400 select-none">✨</span>
        <span className="absolute bottom-3 left-3 text-sm text-pastel-blue-400 select-none">🎈</span>

        <AnimatePresence mode="wait">
          {!timeLeft.isExpired ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center"
            >
              {/* Header */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-pastel-gold-600 uppercase tracking-widest mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>The Royal Countdown</span>
                <span className="text-xs">✨</span>
              </div>

              <h3 className="font-display font-bold text-lg text-pastel-navy-900 mb-4">
                Counting down to the Grand Celebration! 🎉
              </h3>

              {/* 4 Rounded Cards Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full mb-3">
                {units.map((unit) => (
                  <div
                    key={unit.label}
                    className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b ${unit.color} border shadow-xs`}
                  >
                    <motion.span
                      key={unit.value}
                      initial={{ y: -6, opacity: 0.7 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-none mb-1 text-pastel-navy-900"
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.span>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-500 italic flex items-center gap-1">
                <span>Save the date & get your party hats ready! 🥳</span>
              </p>
            </motion.div>
          ) : (
            /* Zero Reached: Party Time Celebration State */
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center py-2"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-pastel-gold-300 flex items-center justify-center text-3xl shadow-lg border-2 border-white mb-3"
              >
                🎂
              </motion.div>

              <h3 className="font-display font-black text-2xl text-pastel-navy-900 mb-1">
                🎉 IT'S PARTY TIME! 🎉
              </h3>
              <p className="text-sm font-semibold text-pastel-gold-600 mb-3">
                Let's Celebrate Shri Magizh Mithran's 1st Birthday! 👑
              </p>

              <motion.button
                onClick={() => {
                  soundManager.playFanfare();
                  triggerCelebrationSideCannons();
                  if (onOpenCelebrationModal) onOpenCelebrationModal();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pastel-gold-500 text-pastel-navy-900 font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Blast More Confetti! 🎊</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
