import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GuestBlessing } from '../config/invitationData';
import {
  MessageSquarePlus,
  Heart,
  Sparkles,
  Send,
  User,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';
import {
  fetchGitHubBlessings,
  postBlessingToGitHub,
} from '../utils/githubGuestbook';

interface GuestbookWallProps {
  initialBlessings: GuestBlessing[];
}

const STORAGE_KEY = 'magizh_mithran_guestbook_v4';

export const GuestbookWall: React.FC<GuestbookWallProps> = ({ initialBlessings }) => {
  const [blessings, setBlessings] = useState<GuestBlessing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(
          (b: GuestBlessing) =>
            !b.name.includes('Emily') &&
            !b.name.includes('Miller') &&
            !b.name.includes('Marcus') &&
            !b.message.includes('Liam')
        );
      } catch {
        // fallback
      }
    }
    return initialBlessings;
  });

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<{ name: string; relationship: string; message: string } | null>(null);

  // Fetch live blessings from GitHub Issues on mount
  useEffect(() => {
    // Clear legacy mock keys
    localStorage.removeItem('prince_liam_guestbook');
    localStorage.removeItem('prince_liam_guestbook_v2');
    localStorage.removeItem('prince_liam_guestbook_v3');

    syncWithGitHub();
  }, []);

  const syncWithGitHub = async () => {
    setIsLoadingGitHub(true);
    try {
      const ghBlessings = await fetchGitHubBlessings();
      if (ghBlessings.length > 0) {
        setBlessings((prev) => {
          // Merge GitHub blessings with local blessings without duplicates
          const existingIds = new Set(prev.map((b) => b.id));
          const existingMessages = new Set(prev.map((b) => `${b.name}:::${b.message}`));

          const newItems = ghBlessings.filter(
            (b) => !existingIds.has(b.id) && !existingMessages.has(`${b.name}:::${b.message}`)
          );

          const merged = [...newItems, ...prev];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.warn('Could not sync with GitHub:', err);
    } finally {
      setIsLoadingGitHub(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    soundManager.playPop();
    setIsSubmitting(true);

    const submittedName = name.trim();
    const submittedRel = relationship.trim() || 'Family Well-wisher';
    const submittedMsg = message.trim();

    const newEntry: GuestBlessing = {
      id: 'b_' + Date.now(),
      name: submittedName,
      relationship: submittedRel,
      message: submittedMsg,
      timestamp: 'Just now',
      avatarEmoji: '👑',
      likes: 1,
      color: 'bg-white',
    };

    const updated = [newEntry, ...blessings];
    setBlessings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    triggerHeartConfetti();
    setLastSubmitted({
      name: submittedName,
      relationship: submittedRel,
      message: submittedMsg,
    });

    setName('');
    setRelationship('');
    setMessage('');
    setShowSuccessToast(true);

    // Automatically post to GitHub in the background
    try {
      await postBlessingToGitHub(submittedName, submittedRel, submittedMsg);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    soundManager.playPop();
    const updated = blessings.map((b) => (b.id === id ? { ...b, likes: b.likes + 1 } : b));
    setBlessings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerHeartConfetti(x, y);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playPop();
    const updated = blessings.filter((b) => b.id !== id);
    setBlessings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const createWhatsAppShareUrl = (blessingName: string, blessingMsg: string) => {
    const text = `Dear Saravanan & Soundharya! ❤️\nHere is our heartfelt blessing for Shri Magizh Mithran on his 1st Birthday:\n\n"${blessingMsg}"\n\n— With Love, ${blessingName} 👶✨`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="px-5 sm:px-6 py-6 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pastel-gold-100 border border-pastel-gold-300 text-pastel-gold-700 text-xs font-bold uppercase tracking-widest mb-2 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Virtual Blessing Book</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="font-display font-extrabold text-xl text-pastel-navy-900">
          Blessings & Guestbook Wall 💌
        </h2>
        <div className="w-16 h-0.5 hairline-gold mx-auto mt-2.5" />
      </div>

      {/* Form Card */}
      <div className="rounded-3xl p-6 glass-card shadow-soft-card border border-pastel-gold-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pastel-gold-100 text-pastel-gold-600">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-pastel-navy-900">
              Leave a Blessing for Little Mithran
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                Your Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chithi / Mama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white border border-pastel-gold-200 focus:border-pastel-gold-500 outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                Relationship (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Aunt / Family Friend"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-pastel-gold-200 focus:border-pastel-gold-500 outline-none transition-all shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 block mb-1">
              Your Message & Blessings <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Write a warm prayer, blessing, or loving birthday note for Shri Magizh Mithran..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-pastel-gold-200 focus:border-pastel-gold-500 outline-none transition-all resize-none shadow-2xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !message.trim()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-pastel-gold-500 text-pastel-navy-900 font-display font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Post Blessing Note 🎈</span>
          </button>
        </form>

        <AnimatePresence>
          {showSuccessToast && lastSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-3 shadow-xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Blessing posted on the wall! 🎉</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Your blessing has been saved and is now displayed on the wall! You can also forward it directly to Saravanan & Soundharya on WhatsApp:
              </p>

              <div className="flex flex-col gap-2">
                <a
                  href={createWhatsAppShareUrl(lastSubmitted.name, lastSubmitted.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm transition-transform active:scale-98"
                >
                  <span>💬 Forward to Saravanan & Soundharya on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Notes Wall */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1 mb-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <span>{blessings.length} Blessings on Wall</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button
            onClick={() => {
              soundManager.playPop();
              syncWithGitHub();
            }}
            disabled={isLoadingGitHub}
            className="text-[10px] text-pastel-blue-600 hover:text-pastel-blue-700 font-bold flex items-center gap-1 bg-pastel-blue-50 px-2.5 py-1 rounded-full border border-pastel-blue-200"
            title="Sync with GitHub Issues"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingGitHub ? 'animate-spin' : ''}`} />
            <span>{isLoadingGitHub ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>
        </div>

        {blessings.map((b, idx) => {
          const noteThemes = [
            'bg-pastel-blue-100/90 border-pastel-blue-200',
            'bg-pastel-gold-100/90 border-pastel-gold-200',
            'bg-pastel-rose-100/90 border-pastel-rose-200',
            'bg-pastel-mint-100/90 border-pastel-mint-200',
            'bg-pastel-lavender-100/90 border-pastel-lavender-200',
          ];
          const noteStyle = noteThemes[idx % noteThemes.length];

          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 ${noteStyle} border shadow-xs relative group`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-display font-bold text-xs text-pastel-navy-900 flex items-center gap-1">
                    <span>{b.name}</span>
                    {b.id.startsWith('gh_') && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/10 text-gray-700 font-mono font-normal">
                        GitHub
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-gray-500 font-sans">
                    {b.relationship} • {b.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={createWhatsAppShareUrl(b.name, b.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 px-2 rounded-full bg-white/80 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors border border-emerald-200 shadow-2xs flex items-center gap-1"
                    title="Forward this blessing on WhatsApp"
                  >
                    <span>💬 WhatsApp</span>
                  </a>

                  <button
                    onClick={(e) => handleLike(b.id, e)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/80 text-[10px] font-bold text-rose-500 hover:scale-105 active:scale-95 transition-transform border border-rose-100 shadow-2xs"
                  >
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{b.likes}</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(b.id, e)}
                    className="p-1 rounded-full text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="font-serif italic text-xs text-pastel-navy-900 leading-relaxed">
                "{b.message}"
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
