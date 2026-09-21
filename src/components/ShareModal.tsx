import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, MessageSquare, X, Crown, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, babyName }) => {
  const [copied, setCopied] = useState(false);

  const inviteUrl = window.location.href;
  const shareText = `👑 You're warmly invited to ${babyName}'s 1st Royal Birthday Celebration! Tap to unwrap the invitation card: ${inviteUrl}`;

  const handleCopyLink = () => {
    soundManager.playPop();
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    triggerHeartConfetti();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    soundManager.playPop();
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = () => {
    soundManager.playPop();
    if (navigator.share) {
      navigator.share({
        title: `${babyName} Turns One! 👑`,
        text: shareText,
        url: inviteUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-blue-200 text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Crown Icon */}
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-3">
            <Crown className="w-6 h-6 fill-blue-300 text-blue-600" />
          </div>

          <h3 className="font-display font-bold text-lg text-pastel-navy-900 mb-1">
            Share the Invitation
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            Spread the joy and invite family & friends to celebrate {babyName}!
          </p>

          <div className="space-y-2.5">
            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            {/* Native Share or Copy */}
            {'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-3 px-4 rounded-xl bg-pastel-blue-50 hover:bg-pastel-blue-100 text-pastel-navy-900 border border-pastel-blue-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-pastel-blue-600" />
                <span>Share via Other Apps...</span>
              </button>
            )}

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-pastel-navy-900 border border-gray-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-500" />
                  <span>Copy Invitation Link</span>
                </>
              )}
            </button>
          </div>

          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Link ready to paste anywhere!</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
