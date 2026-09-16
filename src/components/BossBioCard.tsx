import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award, Zap, Smile, Tv, Target, MessageCircle, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BossResumeProps {
  bossResume: {
    title: string;
    department: string;
    experience: string;
    favoriteSnack: string;
    keyStats: Array<{
      label: string;
      value: number;
      display: string;
      color: string;
      icon: string;
    }>;
    superpowers: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    favoriteWords: string[];
  };
}

export const BossBioCard: React.FC<BossResumeProps> = ({ bossResume }) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'superpowers'>('kpis');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smile': return <Smile className="w-4 h-4" />;
      case 'Tv': return <Tv className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Target': return <Target className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <section className="px-4 py-5 max-w-md mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-white via-pastel-cream-50 to-pastel-blue-50/50 shadow-soft-card border border-pastel-blue-200/80 relative overflow-hidden"
      >
        {/* Subtle Watermark Stamp */}
        <div className="absolute top-4 right-3 -rotate-12 border-2 border-dashed border-pastel-gold-400/40 px-2 py-0.5 rounded-md text-[9px] font-bold text-pastel-gold-600/70 tracking-widest uppercase pointer-events-none">
          TOP SECRET DOSSIER
        </div>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-pastel-blue-100 text-pastel-blue-600">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-pastel-blue-600 block">
              Executive Fact Sheet
            </span>
            <h2 className="font-display font-bold text-lg text-pastel-navy-900 leading-tight">
              Baby Boss "Resume" 💼
            </h2>
          </div>
        </div>

        {/* Corporate Title Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pastel-blue-100/80 via-pastel-cream-100 to-pastel-gold-100/80 border border-pastel-blue-200 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-xl">👑</span>
            <div>
              <h3 className="font-display font-bold text-sm text-pastel-navy-900">
                {bossResume.title}
              </h3>
              <p className="text-xs text-pastel-navy-700/80">
                {bossResume.department} • <span className="font-medium text-pastel-gold-600">{bossResume.experience}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Toggle: Performance KPIs vs Superpowers */}
        <div className="flex rounded-xl bg-white p-1 border border-pastel-blue-100 shadow-sm mb-4">
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('kpis');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'kpis'
                ? 'bg-gradient-to-r from-pastel-blue-500 to-pastel-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-pastel-navy-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Key Stats (KPIs)</span>
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('superpowers');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'superpowers'
                ? 'bg-gradient-to-r from-pastel-gold-400 to-amber-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-pastel-navy-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Superpowers</span>
          </button>
        </div>

        {/* Tab Content 1: Key Stats Progress Bars */}
        {activeTab === 'kpis' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            {bossResume.keyStats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-pastel-navy-800 flex items-center gap-1.5">
                    {getIcon(stat.icon)}
                    {stat.label}
                  </span>
                  <span className="text-[11px] font-bold text-pastel-blue-600">
                    {stat.display}
                  </span>
                </div>
                {/* Animated bar */}
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200/60">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab Content 2: Superpowers */}
        {activeTab === 'superpowers' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2.5"
          >
            {bossResume.superpowers.map((power, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/90 border border-pastel-gold-200/80 shadow-sm flex items-start gap-2.5"
              >
                <span className="text-2xl shrink-0 p-1 rounded-xl bg-pastel-gold-50">
                  {power.icon}
                </span>
                <div>
                  <h4 className="font-display font-bold text-xs text-pastel-navy-900">
                    {power.title}
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {power.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Favorite Words / Babble Vocabulary */}
        <div className="mt-5 pt-4 border-t border-pastel-blue-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-2">
            🗣️ Core Vocabulary & Favorite Phrases
          </span>
          <div className="flex flex-wrap gap-1.5">
            {bossResume.favoriteWords.map((word, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-white border border-pastel-blue-200 text-xs font-semibold text-pastel-navy-800 shadow-xs hover:border-pastel-gold-400 transition-colors"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Favorite Snack Pill */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 bg-white/60 px-3 py-1.5 rounded-xl border border-gray-100">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Go-to Fuel:</span>
          <span className="font-semibold text-pastel-navy-800">{bossResume.favoriteSnack}</span>
        </div>
      </motion.div>
    </section>
  );
};
