import React from 'react';
import { Sparkles, Wand2, Cake, Utensils, Clock } from 'lucide-react';
import { invitationData } from '../config/invitationData';

export const PartySchedule: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-pastel-gold-500" />;
      case 'Wand2': return <Wand2 className="w-4 h-4 text-purple-500" />;
      case 'Cake': return <Cake className="w-4 h-4 text-rose-500" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-emerald-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <section className="px-4 py-4 max-w-md mx-auto w-full">
      <div className="rounded-3xl p-5 bg-white/90 shadow-soft-card border border-pastel-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-pastel-gold-100 text-pastel-gold-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pastel-gold-600 block">
              Program Itinerary
            </span>
            <h3 className="font-display font-bold text-base text-pastel-navy-900">
              Celebration Highlights 🎪
            </h3>
          </div>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-pastel-blue-200">
          {invitationData.partyHighlights.map((item, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              {/* Timeline Pin Dot */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-pastel-gold-400 flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-pastel-gold-500" />
              </div>

              <div className="flex-1 p-2.5 rounded-xl bg-pastel-cream-50/70 border border-pastel-cream-200">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-bold text-pastel-gold-700 bg-white px-2 py-0.5 rounded-md border border-pastel-gold-200 shadow-xs">
                    {item.time}
                  </span>
                  <div className="p-1 rounded-md bg-white shadow-xs">
                    {getIcon(item.icon)}
                  </div>
                </div>
                <p className="text-xs font-semibold text-pastel-navy-900 mt-1">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
