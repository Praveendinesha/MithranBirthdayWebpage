import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Layers,
  ArrowUp,
  ArrowDown,
  Crown,
  MapPin,
  Music,
  Volume2,
  VolumeX,
  Play,
  Square,
  Globe,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  loadInvitationData,
  saveInvitationData,
  resetToDefaultInvitationData,
  compressImage,
  type EditableInvitationData,
} from '../utils/photoStorage';
import type { GalleryPhoto, MilestoneMonth } from '../config/invitationData';
import { soundManager } from '../utils/audio';
import {
  fetchLatestGitHubSong,
  saveSongToGitHub,
  createDirectGitHubSongIssueUrl,
  getCachedGitHubSong,
  formatFriendlyTime,
  uploadAudioToCloud,
  type GitHubSongConfig,
} from '../utils/githubSongSync';

const ADMIN_PIN = 'SMS2026';

export type AdminTab = 'baby' | 'gallery' | 'milestones' | 'music' | 'event';

interface AdminPhotoManagerModalProps {
  isOpen: boolean;
  initialTab?: AdminTab;
  onClose: () => void;
  onDataUpdated: (data: EditableInvitationData) => void;
}

export const AdminPhotoManagerModal: React.FC<AdminPhotoManagerModalProps> = ({
  isOpen,
  initialTab = 'baby',
  onClose,
  onDataUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const [formData, setFormData] = useState<EditableInvitationData>(loadInvitationData());
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);
  const [isCopiedToast, setIsCopiedToast] = useState<boolean>(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);

  // GitHub Live Song Sync State
  const [updaterName, setUpdaterName] = useState<string>('Praveen');
  const [ghSongConfig, setGhSongConfig] = useState<GitHubSongConfig | null>(getCachedGitHubSong());
  const [isSyncingGitHubSong, setIsSyncingGitHubSong] = useState<boolean>(false);
  const [gitHubSyncMsg, setGitHubSyncMsg] = useState<{ success: boolean; text: string; issueUrl?: string } | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState<boolean>(false);
  const [audioUploadProgress, setAudioUploadProgress] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadCallbackRef = useRef<((dataUrl: string) => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(loadInvitationData());
      setPinError(false);
      setIsPreviewPlaying(false);
      setGitHubSyncMsg(null);
      if (initialTab) {
        setActiveTab(initialTab);
      }

      // Fetch latest GitHub song info on open
      fetchLatestGitHubSong().then((cfg) => {
        if (cfg) {
          setGhSongConfig(cfg);
          if (cfg.updatedBy && cfg.updatedBy !== 'Admin') {
            setUpdaterName(cfg.updatedBy);
          }
        }
      });
    } else {
      if (isPreviewPlaying) {
        soundManager.stopMelody();
        setIsPreviewPlaying(false);
      }
    }
  }, [isOpen, initialTab]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = enteredPin.trim().toUpperCase();
    if (cleanPin === ADMIN_PIN || cleanPin === 'SMS2026' || cleanPin === '2026') {
      soundManager.playPop();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      soundManager.playPop();
      setPinError(true);
    }
  };

  const triggerUpload = (callback: (dataUrl: string) => void) => {
    currentUploadCallbackRef.current = callback;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadCallbackRef.current) return;

    try {
      soundManager.playPop();
      const compressedUrl = await compressImage(file, 1200, 1200, 0.82);
      currentUploadCallbackRef.current(compressedUrl);
      currentUploadCallbackRef.current = null;
    } catch (err) {
      console.error('Error processing image:', err);
      alert('Could not process this image. Please try another image file.');
    }
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert(`This audio file is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Please select an MP3 under 15MB.`);
      return;
    }

    soundManager.playPop();
    setIsUploadingAudio(true);
    setAudioUploadProgress('Uploading audio to Cloud CDN for all live visitors... ⏳');

    try {
      const uploadRes = await uploadAudioToCloud(file);
      if (uploadRes.success && uploadRes.url) {
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
        const validUrl: string = uploadRes.url || '';
        setFormData((prev) => ({
          ...prev,
          music: {
            ...prev.music,
            songUrl: validUrl,
            title: cleanTitle,
          },
        }));
        setAudioUploadProgress(`✅ "${cleanTitle}" uploaded to Cloud CDN! Ready to broadcast to all live visitors.`);
      } else {
        setAudioUploadProgress('Upload service unavailable. You can also paste an online audio URL below.');
      }
    } catch (err: any) {
      setAudioUploadProgress('Upload failed: ' + (err.message || 'Check network'));
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleTogglePreview = () => {
    soundManager.playPop();
    if (isPreviewPlaying) {
      soundManager.stopMelody();
      setIsPreviewPlaying(false);
    } else {
      soundManager.previewSong(formData.music?.songUrl);
      setIsPreviewPlaying(true);
    }
  };

  const handleSaveAndSyncSong = async (customAction?: 'update' | 'remove') => {
    soundManager.playPop();
    setIsSyncingGitHubSong(true);
    setGitHubSyncMsg(null);

    const isRemove = customAction === 'remove' || !formData.music?.songUrl?.trim();
    const targetSongUrl = isRemove ? '' : (formData.music?.songUrl?.trim() || '');
    const targetTitle = isRemove ? 'Default Royal Birthday Music Box' : (formData.music?.title || 'Custom Birthday Song');

    const updatedFormData: EditableInvitationData = {
      ...formData,
      music: {
        ...formData.music,
        songUrl: targetSongUrl,
        title: targetTitle,
      },
    };

    setFormData(updatedFormData);
    saveInvitationData(updatedFormData);
    onDataUpdated(updatedFormData);

    try {
      const res = await saveSongToGitHub({
        songUrl: targetSongUrl,
        title: targetTitle,
        volume: formData.music?.volume ?? 0.5,
        updatedBy: updaterName.trim() || 'Admin',
        action: isRemove ? 'remove' : 'update',
      });

      if (res.savedToGitHub) {
        setGitHubSyncMsg({
          success: true,
          text: `Saved & Broadcasted to GitHub! All live visitors will now hear ${isRemove ? 'Default Birthday Music Box' : targetTitle}.`,
          issueUrl: res.issueUrl,
        });
      } else {
        setGitHubSyncMsg({
          success: true,
          text: `Saved locally! Click below to publish to GitHub Issues for all live visitors.`,
          issueUrl: res.issueUrl,
        });
      }

      // Refresh cached song config
      const latest = await fetchLatestGitHubSong();
      if (latest) setGhSongConfig(latest);
    } catch (err) {
      setGitHubSyncMsg({
        success: false,
        text: 'Saved locally. Could not sync with GitHub automatically.',
      });
    } finally {
      setIsSyncingGitHubSong(false);
    }
  };

  const handleSaveAll = () => {
    soundManager.playPop();
    if (isPreviewPlaying) {
      soundManager.stopMelody();
      setIsPreviewPlaying(false);
    }
    const success = saveInvitationData(formData);
    if (success) {
      onDataUpdated(formData);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2800);

      // Also trigger GitHub sync for song if on music tab or song is set
      if (activeTab === 'music' || formData.music?.songUrl) {
        handleSaveAndSyncSong(formData.music?.songUrl ? 'update' : 'remove');
      }
    } else {
      alert('Storage is full. Try uploading smaller photos or reset to defaults.');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all photos and captions back to default?')) {
      soundManager.playPop();
      if (isPreviewPlaying) {
        soundManager.stopMelody();
        setIsPreviewPlaying(false);
      }
      const defaults = resetToDefaultInvitationData();
      setFormData(defaults);
      onDataUpdated(defaults);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2800);
    }
  };

  const handleExportJson = () => {
    soundManager.playPop();
    const jsonStr = JSON.stringify(formData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setIsCopiedToast(true);
    setTimeout(() => setIsCopiedToast(false), 2800);
  };

  // Gallery handlers
  const handleUpdateGalleryPhoto = (index: number, field: keyof GalleryPhoto, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.gallery];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, gallery: updated };
    });
  };

  const handleAddGalleryPhoto = () => {
    soundManager.playPop();
    const newPhoto: GalleryPhoto = {
      id: `custom_${Date.now()}`,
      title: 'New Memory Moment ✨',
      caption: 'Add a lovely caption for this special moment...',
      category: 'Family Moments',
      imageUrl: '/carousel/WhatsApp Image 2026-09-16 at 4.37.01 PM.jpeg',
    };
    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, newPhoto] }));
  };

  const handleDeleteGalleryPhoto = (index: number) => {
    if (formData.gallery.length <= 1) {
      alert('Please keep at least 1 photo in the gallery.');
      return;
    }
    soundManager.playPop();
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleMoveGalleryPhoto = (index: number, direction: 'up' | 'down') => {
    soundManager.playPop();
    setFormData((prev) => {
      const updated = [...prev.gallery];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, gallery: updated };
    });
  };

  // Milestone handlers
  const handleUpdateMilestone = (index: number, field: keyof MilestoneMonth, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.milestones];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, milestones: updated };
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
        {/* Hidden Image File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Hidden Audio File Input */}
        <input
          type="file"
          ref={audioFileInputRef}
          onChange={handleAudioFileChange}
          accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg"
          className="hidden"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-pastel-gold-200 overflow-hidden text-pastel-navy-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-pastel-gold-50 via-white to-pastel-blue-50 border-b border-pastel-gold-200/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-pastel-gold-100 border border-pastel-gold-300 flex items-center justify-center text-pastel-gold-700 shadow-2xs">
                <Crown className="w-5 h-5 text-pastel-gold-600" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-pastel-navy-900 flex items-center gap-1.5 leading-tight">
                  <span>Photo & Content Manager</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-pastel-gold-100 text-pastel-gold-800 border border-pastel-gold-300">
                    Client Portal
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  Manage Top Baby Photo, Song, Memory Lane & Family Moments
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isAuthenticated ? (
            /* PIN Protection Screen */
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto">
              <div className="w-14 h-14 rounded-full bg-pastel-gold-100 border border-pastel-gold-300 flex items-center justify-center text-pastel-gold-700 shadow-md">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-pastel-navy-900">
                  Enter Client PIN Code
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Enter your client PIN to access and manage your invitation photos and details.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
                <input
                  type="password"
                  maxLength={12}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="Enter PIN..."
                  autoFocus
                  className={`w-full text-center text-lg tracking-widest font-mono uppercase py-2.5 px-4 rounded-xl border ${
                    pinError ? 'border-rose-400 bg-rose-50' : 'border-gray-300 focus:border-pastel-gold-500'
                  } outline-hidden`}
                />
                {pinError && (
                  <p className="text-xs text-rose-500 font-semibold">Incorrect PIN. Please try again.</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pastel-gold-400 to-amber-500 text-pastel-navy-900 font-display font-bold text-sm shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Manager</span>
                </button>
              </form>
            </div>
          ) : (
            /* Main Admin Dashboard */
            <>
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 bg-gray-50/70 px-4 pt-2 gap-1.5 overflow-x-auto hide-scrollbar shrink-0">
                {/* TAB 1: Main Top Baby Photo */}
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setActiveTab('baby');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 ${
                    activeTab === 'baby'
                      ? 'bg-white text-pastel-gold-700 border-gray-200 -mb-px shadow-2xs font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-pastel-navy-800'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-pastel-gold-600" />
                  <span>👑 Top Baby Photo</span>
                </button>

                {/* TAB 2: Family Moments Gallery */}
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setActiveTab('gallery');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 ${
                    activeTab === 'gallery'
                      ? 'bg-white text-pastel-gold-700 border-gray-200 -mb-px shadow-2xs font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-pastel-navy-800'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>📸 Family Moments ({formData.gallery.length})</span>
                </button>

                {/* TAB 3: Memory Lane */}
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setActiveTab('milestones');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 ${
                    activeTab === 'milestones'
                      ? 'bg-white text-pastel-gold-700 border-gray-200 -mb-px shadow-2xs font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-pastel-navy-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>🚀 Memory Lane (12 Months)</span>
                </button>

                {/* TAB 4: Song & Audio Manager */}
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setActiveTab('music');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 ${
                    activeTab === 'music'
                      ? 'bg-white text-pastel-gold-700 border-gray-200 -mb-px shadow-2xs font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-pastel-navy-800'
                  }`}
                >
                  <Music className="w-3.5 h-3.5 text-blue-500" />
                  <span>🎵 Song & Audio</span>
                </button>

                {/* TAB 5: Event Logistics */}
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setActiveTab('event');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 ${
                    activeTab === 'event'
                      ? 'bg-white text-pastel-gold-700 border-gray-200 -mb-px shadow-2xs font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-pastel-navy-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>📍 Event & RSVP</span>
                </button>
              </div>

              {/* Tab Body Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* TAB 1: MAIN TOP BABY PHOTO & INFO */}
                {activeTab === 'baby' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display font-bold text-sm text-pastel-navy-900 flex items-center gap-1.5">
                          <span>Main Top Section Baby Photo</span>
                          <span className="px-2 py-0.5 rounded-full bg-pastel-gold-100 text-pastel-gold-800 text-[10px] font-bold">
                            Hero Frame 👑
                          </span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          This is the primary circular photo displayed inside the royal crown frame at the top.
                        </p>
                      </div>
                    </div>

                    {/* Big Interactive Crown Photo Box */}
                    <div className="p-5 rounded-3xl bg-gradient-to-b from-pastel-gold-50/70 via-white to-pastel-blue-50/60 border-2 border-pastel-gold-300 shadow-md flex flex-col sm:flex-row items-center gap-6">
                      {/* Live Frame Preview */}
                      <div className="relative shrink-0">
                        {/* Crown icon on top */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 text-3xl select-none">
                          👑
                        </div>
                        {/* Glow */}
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-pastel-gold-400 to-pastel-blue-300 blur-md opacity-60 pointer-events-none" />
                        {/* Circular Image */}
                        <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-b from-pastel-gold-300 via-white to-pastel-blue-200 shadow-lg border-2 border-white overflow-hidden group">
                          <img
                            src={formData.baby.photoUrl}
                            alt={formData.baby.fullName}
                            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                          />
                        </div>
                        {/* 1 Year badge */}
                        <div className="absolute -bottom-1 -right-1 z-20 w-9 h-9 rounded-full bg-gradient-to-br from-pastel-gold-400 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md border border-white">
                          1Y
                        </div>
                      </div>

                      {/* Upload Controls & Instructions */}
                      <div className="space-y-3 flex-1 text-center sm:text-left">
                        <div>
                          <h5 className="font-display font-bold text-base text-pastel-navy-900">
                            {formData.baby.fullName}
                          </h5>
                          <p className="text-xs text-pastel-gold-700 font-semibold">
                            Royal 1st Birthday Milestone Photo
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Tap below to pick any cute photo from your mobile album or camera.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <button
                            onClick={() =>
                              triggerUpload((url) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  baby: { ...prev.baby, photoUrl: url },
                                }))
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pastel-gold-400 to-amber-500 text-pastel-navy-900 text-xs font-bold shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload / Replace Main Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Headline & Name Customization */}
                    <div className="p-4 rounded-2xl bg-white border border-pastel-blue-200 space-y-3">
                      <h5 className="font-display font-bold text-xs uppercase tracking-wider text-pastel-gold-700">
                        Top Section Texts & Captions
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Baby Full Name (Big Golden Heading)
                          </label>
                          <input
                            type="text"
                            value={formData.baby.fullName}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                baby: { ...prev.baby, fullName: e.target.value },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Parents Names
                          </label>
                          <input
                            type="text"
                            value={formData.baby.parents}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                baby: { ...prev.baby, parents: e.target.value },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                          Playful Quote Card Text
                        </label>
                        <textarea
                          rows={2}
                          value={formData.baby.subheadline}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              baby: { ...prev.baby, subheadline: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden resize-none italic text-gray-700 font-serif"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: GALLERY PHOTOS */}
                {activeTab === 'gallery' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display font-bold text-sm text-pastel-navy-900">
                          Family Moments Carousel Photos
                        </h4>
                        <p className="text-xs text-gray-500">
                          Add, replace, or reorder family photos and captions.
                        </p>
                      </div>
                      <button
                        onClick={handleAddGalleryPhoto}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pastel-gold-100 hover:bg-pastel-gold-200 text-pastel-gold-800 text-xs font-bold border border-pastel-gold-300 transition-colors shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {formData.gallery.map((photo, idx) => (
                        <div
                          key={photo.id || idx}
                          className="p-3 rounded-2xl bg-white border border-pastel-blue-200 shadow-xs hover:border-pastel-gold-300 transition-all flex flex-col space-y-2.5 relative group"
                        >
                          {/* Image preview & upload button */}
                          <div className="relative h-40 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  triggerUpload((url) =>
                                    handleUpdateGalleryPhoto(idx, 'imageUrl', url)
                                  )
                                }
                                className="px-3 py-1.5 rounded-full bg-white text-pastel-navy-900 text-xs font-bold shadow-md hover:bg-pastel-gold-50 flex items-center gap-1.5"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Change Photo</span>
                              </button>
                            </div>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Inputs */}
                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                                Category Tag
                              </label>
                              <input
                                type="text"
                                value={photo.category}
                                onChange={(e) =>
                                  handleUpdateGalleryPhoto(idx, 'category', e.target.value)
                                }
                                placeholder="e.g. Baby Prince, Mom & Mithran"
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                                Photo Title
                              </label>
                              <input
                                type="text"
                                value={photo.title}
                                onChange={(e) =>
                                  handleUpdateGalleryPhoto(idx, 'title', e.target.value)
                                }
                                placeholder="Title with emoji..."
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-bold"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                                Caption Description
                              </label>
                              <textarea
                                rows={2}
                                value={photo.caption}
                                onChange={(e) =>
                                  handleUpdateGalleryPhoto(idx, 'caption', e.target.value)
                                }
                                placeholder="Caption message..."
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden resize-none text-gray-600"
                              />
                            </div>
                          </div>

                          {/* Item Controls */}
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveGalleryPhoto(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded-md text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                title="Move up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveGalleryPhoto(idx, 'down')}
                                disabled={idx === formData.gallery.length - 1}
                                className="p-1 rounded-md text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                title="Move down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  triggerUpload((url) =>
                                    handleUpdateGalleryPhoto(idx, 'imageUrl', url)
                                  )
                                }
                                className="text-[11px] font-bold text-pastel-blue-600 hover:text-pastel-blue-700 flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Upload</span>
                              </button>
                              <button
                                onClick={() => handleDeleteGalleryPhoto(idx)}
                                className="p-1 rounded-md text-gray-400 hover:text-rose-500"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: MEMORY LANE 12 MONTHS */}
                {activeTab === 'milestones' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-display font-bold text-sm text-pastel-navy-900">
                        Memory Lane (12 Months in 12 Seconds)
                      </h4>
                      <p className="text-xs text-gray-500">
                        Upload baby growth photos and update milestone notes for each month.
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {formData.milestones.map((m, idx) => (
                        <div
                          key={m.month}
                          className="p-3.5 rounded-2xl bg-white border border-pastel-blue-200 shadow-xs flex flex-col sm:flex-row gap-3.5 items-start"
                        >
                          {/* Photo Thumbnail + Upload Button */}
                          <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 group">
                            <img
                              src={m.image}
                              alt={m.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() =>
                                  triggerUpload((url) =>
                                    handleUpdateMilestone(idx, 'image', url)
                                  )
                                }
                                className="px-2.5 py-1 rounded-full bg-white text-pastel-navy-900 text-[11px] font-bold shadow-md hover:bg-pastel-gold-50 flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Replace</span>
                              </button>
                            </div>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-pastel-navy-900 text-white text-[10px] font-bold shadow-xs">
                              Month {m.month}
                            </span>
                          </div>

                          {/* Editable fields */}
                          <div className="flex-1 w-full space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                                  Milestone Title
                                </label>
                                <input
                                  type="text"
                                  value={m.title}
                                  onChange={(e) =>
                                    handleUpdateMilestone(idx, 'title', e.target.value)
                                  }
                                  placeholder="Title with emoji"
                                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-bold text-pastel-navy-900"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                                  Badge Tag
                                </label>
                                <input
                                  type="text"
                                  value={m.badge}
                                  onChange={(e) =>
                                    handleUpdateMilestone(idx, 'badge', e.target.value)
                                  }
                                  placeholder="e.g. Rolled Over 🌀"
                                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-semibold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                                Subtitle / Growth Stats
                              </label>
                              <input
                                type="text"
                                value={m.subtitle}
                                onChange={(e) =>
                                  handleUpdateMilestone(idx, 'subtitle', e.target.value)
                                }
                                placeholder="e.g. Weight: 7.2 kg • Sitting Proudly"
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium text-pastel-gold-700"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                                Milestone Story / Description
                              </label>
                              <textarea
                                rows={2}
                                value={m.description}
                                onChange={(e) =>
                                  handleUpdateMilestone(idx, 'description', e.target.value)
                                }
                                placeholder="Describe baby's milestone memory..."
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden resize-none text-gray-600"
                              />
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() =>
                                  triggerUpload((url) =>
                                    handleUpdateMilestone(idx, 'image', url)
                                  )
                                }
                                className="text-xs font-bold text-pastel-blue-600 hover:text-pastel-blue-700 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pastel-blue-50 border border-pastel-blue-200"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Month {m.month} Photo</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: EVENT DETAILS & RSVP */}
                {activeTab === 'event' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-display font-bold text-sm text-pastel-navy-900">
                        Event Logistics & Venue Details
                      </h4>
                      <p className="text-xs text-gray-500">
                        Edit date, time, venue name, address, and WhatsApp RSVP contacts.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-pastel-blue-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Date Formatted Display
                          </label>
                          <input
                            type="text"
                            value={formData.event.dateFormatted}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                event: { ...prev.event, dateFormatted: e.target.value },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Time Formatted Display
                          </label>
                          <input
                            type="text"
                            value={formData.event.timeFormatted}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                event: { ...prev.event, timeFormatted: e.target.value },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Venue Name
                          </label>
                          <input
                            type="text"
                            value={formData.event.venueName}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                event: { ...prev.event, venueName: e.target.value },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Hall / Function Area
                          </label>
                          <input
                            type="text"
                            value={formData.event.hall}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                event: { ...prev.event, hall: e.target.value },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                          Full Address
                        </label>
                        <textarea
                          rows={2}
                          value={formData.event.address}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              event: { ...prev.event, address: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden resize-none font-medium text-gray-700"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            RSVP WhatsApp Number
                          </label>
                          <input
                            type="text"
                            value={formData.event.rsvp.whatsappNumber}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                event: {
                                  ...prev.event,
                                  rsvp: { ...prev.event.rsvp, whatsappNumber: e.target.value },
                                },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Dress Code Hint
                          </label>
                          <input
                            type="text"
                            value={formData.event.dressCode}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                event: { ...prev.event, dressCode: e.target.value },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: BACKGROUND SONG & AUDIO SETTINGS */}
                {activeTab === 'music' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display font-bold text-sm text-pastel-navy-900 flex items-center gap-1.5">
                          <span>Background Song & Celebration Music</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Live Audio Broadcast 🎵
                          </span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Configure the music that automatically plays for all guests across all devices.
                        </p>
                      </div>
                    </div>

                    {/* Live Global GitHub Status Banner */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pastel-blue-50 via-white to-pastel-gold-50 border border-pastel-blue-200 text-pastel-navy-900 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                          <Globe className="w-4 h-4 animate-spin-slow" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-pastel-navy-900">
                              Live Global Audio:
                            </span>
                            <span className="text-xs font-semibold text-blue-700">
                              {ghSongConfig && !ghSongConfig.isDefault && ghSongConfig.songUrl
                                ? (ghSongConfig.title || 'Custom Track')
                                : 'Default Royal Birthday Music Box'}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500">
                            {ghSongConfig?.updatedBy
                              ? `Last updated by ${ghSongConfig.updatedBy} • ${formatFriendlyTime(ghSongConfig.updatedAt)}`
                              : 'Default configuration active'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          soundManager.playPop();
                          const fresh = await fetchLatestGitHubSong();
                          if (fresh) setGhSongConfig(fresh);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-700 text-[11px] font-bold flex items-center gap-1 transition-all shadow-2xs"
                        title="Check for recent song updates from other admins"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Refresh Status</span>
                      </button>
                    </div>

                    {/* Live Playing Status & Test Preview Player Card */}
                    <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md space-y-4 border border-blue-400/30">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
                            <Music className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-display font-bold text-sm text-white">
                                {formData.music?.title || (formData.music?.songUrl ? 'Custom Audio Track' : 'Happy Birthday Music Box')}
                              </h5>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  formData.music?.songUrl
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                    : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                                }`}
                              >
                                {formData.music?.songUrl ? 'Custom Song' : 'Default Music Box'}
                              </span>
                            </div>
                            <p className="text-[11px] text-blue-200/80 mt-0.5">
                              {formData.music?.songUrl
                                ? 'Custom audio file or web URL with looping'
                                : 'Built-in gentle Royal Music Box chime melody (Royalty-free, zero loading delay)'}
                            </p>
                          </div>
                        </div>

                        {/* Live Audio Preview Button */}
                        <button
                          onClick={handleTogglePreview}
                          className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0 ${
                            isPreviewPlaying
                              ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                              : 'bg-gradient-to-r from-amber-400 to-pastel-gold-400 hover:from-amber-500 hover:to-pastel-gold-500 text-pastel-navy-900'
                          }`}
                        >
                          {isPreviewPlaying ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>Stop Preview</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Test Audio 🎶</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Volume Slider Bar */}
                      <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                        <VolumeX className="w-4 h-4 text-blue-300 shrink-0" />
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={formData.music?.volume ?? 0.5}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            soundManager.setVolume(val);
                            setFormData((prev) => ({
                              ...prev,
                              music: { ...prev.music, volume: val },
                            }));
                          }}
                          className="flex-1 accent-amber-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                        />
                        <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-[11px] font-mono text-amber-300 w-10 text-right">
                          {Math.round((formData.music?.volume ?? 0.5) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* GitHub Live Broadcast Card */}
                    <div className="p-4 rounded-2xl bg-white border border-pastel-gold-300 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-display font-bold text-xs uppercase tracking-wider text-pastel-gold-800 flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-pastel-gold-600" />
                          <span>Live Broadcast & GitHub Sync</span>
                        </h5>
                        <span className="text-[10px] text-gray-500 font-medium">
                          All visitors will hear this song
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Updated By (Your Name / Family)
                          </label>
                          <input
                            type="text"
                            value={updaterName}
                            onChange={(e) => setUpdaterName(e.target.value)}
                            placeholder="e.g. Praveen, Mom, Soundharya, SMS Family"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium text-gray-800"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveAndSyncSong(formData.music?.songUrl ? 'update' : 'remove')}
                            disabled={isSyncingGitHubSong}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
                          >
                            {isSyncingGitHubSong ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Syncing...</span>
                              </>
                            ) : (
                              <>
                                <Globe className="w-3.5 h-3.5" />
                                <span>Broadcast Song to GitHub</span>
                              </>
                            )}
                          </button>

                          {formData.music?.songUrl && (
                            <button
                              onClick={() => {
                                if (window.confirm('Revert background song to default Royal Birthday Music Box on GitHub?')) {
                                  handleSaveAndSyncSong('remove');
                                }
                              }}
                              className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 font-bold text-xs border border-gray-200 transition-colors shadow-2xs shrink-0"
                              title="Revert live song to default music box"
                            >
                              <span>Revert to Default</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sync Feedback Message */}
                      {gitHubSyncMsg && (
                        <div
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 border ${
                            gitHubSyncMsg.success
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {gitHubSyncMsg.success ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            )}
                            <span>{gitHubSyncMsg.text}</span>
                          </div>

                          {gitHubSyncMsg.issueUrl ? (
                            <a
                              href={gitHubSyncMsg.issueUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline hover:opacity-80 shrink-0"
                            >
                              View GitHub Issue ↗
                            </a>
                          ) : (
                            <a
                              href={createDirectGitHubSongIssueUrl({
                                songUrl: formData.music?.songUrl || '',
                                title: formData.music?.title,
                                volume: formData.music?.volume,
                                updatedBy: updaterName,
                                action: formData.music?.songUrl ? 'update' : 'remove',
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-[11px] px-2 py-1 bg-white rounded-md border shadow-2xs hover:bg-gray-50 shrink-0"
                            >
                              🐙 1-Click Post Issue
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Audio Source Options */}
                    <div className="space-y-3">
                      <h5 className="font-display font-bold text-xs uppercase tracking-wider text-pastel-gold-700 flex items-center gap-1.5">
                        <span>Choose Song Mode</span>
                      </h5>

                      {/* OPTION 1: Use Built-in Default Birthday Music Box */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          !formData.music?.songUrl
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                            : 'bg-white border-gray-200 hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base">🎂</span>
                              <h6 className="font-display font-bold text-xs text-pastel-navy-900">
                                Default Birthday Music Box Melody (Built-in)
                              </h6>
                              {!formData.music?.songUrl && (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                  Active (Default)
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              Soft synthesizer music-box chime notes playing "Happy Birthday to You". 100% royalty-free, works offline and instantly on all devices. If no custom song is set or if removed, this melody plays by default!
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              soundManager.playPop();
                              setFormData((prev) => ({
                                ...prev,
                                music: {
                                  ...prev.music,
                                  songUrl: '',
                                  title: 'Happy Birthday Music Box',
                                },
                              }));
                              if (isPreviewPlaying) {
                                soundManager.previewSong('');
                              }
                            }}
                            disabled={!formData.music?.songUrl}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                              !formData.music?.songUrl
                                ? 'bg-emerald-200/60 text-emerald-800 cursor-default'
                                : 'bg-white border border-gray-300 hover:border-emerald-400 text-gray-700 hover:text-emerald-700 shadow-2xs'
                            }`}
                          >
                            {!formData.music?.songUrl ? 'Selected ✓' : 'Use Default'}
                          </button>
                        </div>
                      </div>

                      {/* OPTION 2: Upload MP3 File */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          formData.music?.songUrl
                            ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                            : 'bg-white border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base">📁</span>
                              <h6 className="font-display font-bold text-xs text-pastel-navy-900">
                                Upload Custom Audio File from Phone / PC
                              </h6>
                              {formData.music?.songUrl && (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                                  Cloud Stream Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              Select any audio file (<code className="font-mono text-blue-700">.mp3, .m4a, .wav</code>) from your phone album or downloads. It will automatically upload to Cloud CDN so all guests can stream and hear it!
                            </p>
                          </div>

                          <button
                            onClick={() => audioFileInputRef.current?.click()}
                            disabled={isUploadingAudio}
                            className="px-3.5 py-1.5 rounded-xl bg-pastel-blue-100 hover:bg-pastel-blue-200 text-pastel-blue-800 border border-pastel-blue-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all shrink-0"
                          >
                            {isUploadingAudio ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>{formData.music?.songUrl ? 'Change Audio' : 'Pick Audio'}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {audioUploadProgress && (
                          <div className="mt-2.5 p-2 rounded-xl bg-white border border-blue-200 text-xs text-blue-800 font-medium flex items-center gap-2">
                            <span>{audioUploadProgress}</span>
                          </div>
                        )}

                        {formData.music?.songUrl && (
                          <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900">
                            <span className="font-semibold truncate max-w-[260px]">
                              🎵 {formData.music.title || 'Uploaded Audio'}
                            </span>
                            <button
                              onClick={() => {
                                soundManager.playPop();
                                setFormData((prev) => ({
                                  ...prev,
                                  music: { ...prev.music, songUrl: '', title: 'Happy Birthday Music Box' },
                                }));
                                setAudioUploadProgress(null);
                              }}
                              className="text-rose-600 hover:text-rose-700 font-bold text-[11px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* OPTION 3: Custom URL or Public Path */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          formData.music?.songUrl && !formData.music?.songUrl?.startsWith('data:')
                            ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                            : 'bg-white border-gray-200 hover:border-amber-200'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🔗</span>
                            <h6 className="font-display font-bold text-xs text-pastel-navy-900">
                              Custom Song Path or Online Link
                            </h6>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                                Audio File Path / URL
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. /audio/birthday-song.mp3 or https://..."
                                value={formData.music?.songUrl?.startsWith('data:') ? '' : (formData.music?.songUrl || '')}
                                onChange={(e) => {
                                  const url = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    music: {
                                      ...prev.music,
                                      songUrl: url,
                                      title: prev.music?.title || 'Custom Birthday Song',
                                    },
                                  }));
                                }}
                                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-mono text-gray-800"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                                Song Title Displayed to Guests
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Shri Magizh Mithran Birthday Theme"
                                value={formData.music?.title || ''}
                                onChange={(e) => {
                                  const title = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    music: { ...prev.music, title: title },
                                  }));
                                }}
                                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium text-gray-800"
                              />
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-pastel-gold-50/70 border border-pastel-gold-200 text-[11px] text-pastel-navy-800 leading-relaxed">
                            💡 <strong>Permanent Audio Tip</strong>: Place your MP3 file in your project at <code className="font-mono text-amber-800 bg-white/80 px-1 py-0.5 rounded">public/audio/song.mp3</code> and set URL to <code className="font-mono text-amber-800 bg-white/80 px-1 py-0.5 rounded">/audio/song.mp3</code>!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar Footer */}
              <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetDefaults}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200 transition-colors shadow-2xs"
                    title="Restore default photos and text"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-100 text-pastel-navy-800 text-xs font-bold border border-gray-200 transition-colors shadow-2xs"
                    title="Copy config JSON to send to developer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopiedToast ? 'Copied to Clipboard! ✓' : 'Copy Config'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveAll}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md active:scale-98 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavedToast ? 'Saved & Applied! ✓' : 'Save & Apply Live'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
