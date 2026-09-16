import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GuestBlessing } from '../config/invitationData';
import { MessageSquarePlus, Heart, Sparkles, Send, User, MessageCircleHeart } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

interface GuestbookWallProps {
  initialBlessings: GuestBlessing[];
}

const EMOJI_OPTIONS = ['👑', '⭐', '🎈', '🧸', '💖', '🎂', '🍼', '🚀'];

const STICKY_COLORS = [
  'from-amber-50 to-orange-50 border-amber-200',
  'from-blue-50 to-cyan-50 border-blue-200',
  'from-rose-50 to-pink-50 border-rose-200',
  'from-emerald-50 to-teal-50 border-emerald-200',
  'from-purple-50 to-indigo-50 border-purple-200',
];

export const GuestbookWall: React.FC<GuestbookWallProps> = ({ initialBlessings }) => {
  const [blessings, setBlessings] = useState<GuestBlessing[]>(() => {
    const saved = localStorage.getItem('prince_liam_guestbook');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialBlessings;
  });

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👑');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    soundManager.playPop();
    setIsSubmitting(true);

    const randomColor = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];

    const newEntry: GuestBlessing = {
      id: 'b_' + Date.now(),
      name: name.trim(),
      relationship: relationship.trim() || 'Well-wisher',
      message: message.trim(),
      timestamp: 'Just now',
      avatarEmoji: selectedEmoji,
      likes: 1,
      color: randomColor,
    };

    const updated = [newEntry, ...blessings];
    setBlessings(updated);
    localStorage.setItem('prince_liam_guestbook', JSON.stringify(updated));

    // Heart explosion
    triggerHeartConfetti();

    // Reset form
    setName('');
    setRelationship('');
    setMessage('');
    setIsSubmitting(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    soundManager.playPop();
    const updated = blessings.map((b) => (b.id === id ? { ...b, likes: b.likes + 1 } : b));
    setBlessings(updated);
    localStorage.setItem('prince_liam_guestbook', JSON.stringify(updated));

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);
  };

  return (
    <section className="px-4 py-5 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1.5">
          <MessageCircleHeart className="w-3.5 h-3.5 text-rose-600" />
          <span>Love & Wishes</span>
        </div>
        <h2 className="font-display font-extrabold text-xl text-pastel-navy-900">
          Blessings & Guestbook Wall 💌
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Leave your loving words for Prince Liam's 1st birthday keepsake!
        </p>
      </div>

      {/* Write a Blessing Card Form */}
      <div className="rounded-3xl p-5 bg-white shadow-soft-card border border-pastel-rose-200/80 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-pastel-rose-100 text-rose-600">
            <MessageSquarePlus className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-pastel-navy-900">
            Post a Royal Wish
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aunt Rachel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-pastel-gold-400 focus:ring-1 focus:ring-pastel-gold-300 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Relationship (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Cousin / Neighbor"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-pastel-gold-400 focus:ring-1 focus:ring-pastel-gold-300 outline-none transition-all"
              />
            </div>
          </div>

          {/* Emoji Sticker Choice */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 block mb-1">
              Choose your sticker stamp:
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedEmoji(emoji);
                  }}
                  className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-pastel-gold-200 scale-110 shadow-xs border-2 border-pastel-gold-400'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 block mb-1">
              Your Message & Blessing <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Write a sweet birthday note, funny advice, or warm prayer for Liam..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-pastel-gold-400 focus:ring-1 focus:ring-pastel-gold-300 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !message.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-400 to-pastel-gold-500 hover:from-rose-500 hover:to-amber-500 text-white font-display font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pin Blessing to Virtual Wall</span>
          </button>
        </form>

        {/* Success Alert */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center flex items-center justify-center gap-1.5 overflow-hidden"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Your blessing has been pinned to the board! ✨</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Virtual Sticky Notes Board */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span className="font-semibold">{blessings.length} Wishes Received</span>
          <span className="italic">Tap ❤️ to send love to any wish</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {blessings.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-2xl p-4 bg-gradient-to-br ${b.color} border shadow-xs transition-all hover:shadow-md`}
              >
                {/* Pin Badge Graphic */}
                <div className="absolute -top-2.5 left-6 text-xs drop-shadow-xs">
                  📌
                </div>

                <div className="flex items-start justify-between gap-2 mb-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-1 rounded-xl bg-white/80 shadow-xs border border-black/5">
                      {b.avatarEmoji}
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-xs text-pastel-navy-900 leading-none">
                        {b.name}
                      </h4>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {b.relationship} • {b.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Heart like button */}
                  <button
                    onClick={(e) => handleLike(b.id, e)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 shadow-2xs text-[11px] font-bold text-rose-500 hover:scale-105 active:scale-95 transition-transform"
                    title="Send love"
                  >
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{b.likes}</span>
                  </button>
                </div>

                <p className="text-xs text-pastel-navy-900/90 leading-relaxed font-sans pl-1">
                  "{b.message}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
