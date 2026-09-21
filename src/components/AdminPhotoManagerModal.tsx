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

const ADMIN_PIN = 'SMS2026';

export type AdminTab = 'baby' | 'gallery' | 'milestones' | 'event';

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadCallbackRef = useRef<((dataUrl: string) => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(loadInvitationData());
      setPinError(false);
      if (initialTab) {
        setActiveTab(initialTab);
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

  const handleSaveAll = () => {
    soundManager.playPop();
    const success = saveInvitationData(formData);
    if (success) {
      onDataUpdated(formData);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2800);
    } else {
      alert('Storage is full. Try uploading smaller photos or reset to defaults.');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all photos and captions back to default?')) {
      soundManager.playPop();
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
                  Manage Top Baby Photo, Memory Lane & Family Moments
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
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pastel-gold-400 to-amber-500 text-pastel-navy-900 font-display font-bold text-sm shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 cursor-pointer ${
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
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 cursor-pointer ${
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
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 cursor-pointer ${
                    activeTab === 'milestones'
                      ? 'bg-white text-pastel-gold-700 border-gray-200 -mb-px shadow-2xs font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-pastel-navy-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>🚀 Memory Lane (12 Months)</span>
                </button>

                {/* TAB 4: Event Logistics */}
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setActiveTab('event');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x shrink-0 cursor-pointer ${
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
                        </h4>
                        <p className="text-xs text-gray-500">
                          This is the crown hero photo displayed prominently at the top of the webpage.
                        </p>
                      </div>
                    </div>

                    {/* Top Baby Image Preview & Replace */}
                    <div className="p-4 rounded-2xl bg-pastel-gold-50/60 border border-pastel-gold-200 flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-pastel-gold-300 shadow-md shrink-0 bg-gray-100">
                        <img
                          src={formData.baby.photoUrl}
                          alt={formData.baby.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2 text-center sm:text-left flex-1">
                        <div>
                          <h5 className="font-display font-bold text-sm text-pastel-navy-900">
                            {formData.baby.fullName} (Hero Picture)
                          </h5>
                          <p className="text-xs text-gray-500">
                            Upload a high-quality portrait photo of baby Mithran.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <button
                            onClick={() =>
                              triggerUpload((url) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  baby: { ...prev.baby, photoUrl: url },
                                }))
                              )
                            }
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pastel-gold-400 to-amber-500 text-pastel-navy-900 font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Replace Top Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Baby Text Details Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                          Baby Full Name
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
                          Headline / Title
                        </label>
                        <input
                          type="text"
                          value={formData.baby.headline}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              baby: { ...prev.baby, headline: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                          Tagline / Funny Subheadline
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
                          className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden resize-none font-medium italic text-gray-700"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                          Parents Names (e.g. Saravanan & Soundharya)
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
                          className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PHOTO GALLERY MOMENTS */}
                {activeTab === 'gallery' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display font-bold text-sm text-pastel-navy-900 flex items-center gap-1.5">
                          <span>Baby & Family Moments Gallery</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-gold-100 text-pastel-gold-800">
                            {formData.gallery.length} Photos
                          </span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Add, replace, reorder, or update captions for moments in the carousel.
                        </p>
                      </div>

                      <button
                        onClick={handleAddGalleryPhoto}
                        className="px-3 py-1.5 rounded-xl bg-pastel-gold-400 hover:bg-pastel-gold-500 text-pastel-navy-900 font-bold text-xs shadow-2xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photo</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.gallery.map((photo, index) => (
                        <div
                          key={photo.id || index}
                          className="p-3.5 rounded-2xl border border-gray-200 bg-white shadow-xs hover:border-pastel-gold-300 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3.5"
                        >
                          {/* Photo Thumbnail */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-pastel-gold-200 shrink-0 bg-gray-100 group">
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() =>
                                triggerUpload((url) =>
                                  handleUpdateGalleryPhoto(index, 'imageUrl', url)
                                )
                              }
                              className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Click to replace photo"
                            >
                              <Upload className="w-4 h-4 mb-0.5" />
                              <span>Replace</span>
                            </button>
                          </div>

                          {/* Captions & Info */}
                          <div className="flex-1 min-w-0 space-y-1.5 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={photo.title}
                                placeholder="Moment Title..."
                                onChange={(e) =>
                                  handleUpdateGalleryPhoto(index, 'title', e.target.value)
                                }
                                className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-bold"
                              />
                              <input
                                type="text"
                                value={photo.category}
                                placeholder="Category / Tag..."
                                onChange={(e) =>
                                  handleUpdateGalleryPhoto(index, 'category', e.target.value)
                                }
                                className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-medium text-gray-600"
                              />
                            </div>
                            <input
                              type="text"
                              value={photo.caption}
                              placeholder="Heartwarming Caption..."
                              onChange={(e) =>
                                handleUpdateGalleryPhoto(index, 'caption', e.target.value)
                              }
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-pastel-gold-400 outline-hidden text-gray-700"
                            />
                          </div>

                          {/* Actions: Reorder & Delete */}
                          <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() =>
                                triggerUpload((url) =>
                                  handleUpdateGalleryPhoto(index, 'imageUrl', url)
                                )
                              }
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-pastel-gold-100 text-gray-700 hover:text-pastel-gold-800 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Replace photo"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span className="sm:hidden text-[10px]">Photo</span>
                            </button>

                            <button
                              onClick={() => handleMoveGalleryPhoto(index, 'up')}
                              disabled={index === 0}
                              className={`p-1.5 rounded-lg transition-colors ${
                                index === 0
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-pastel-navy-900 cursor-pointer'
                              }`}
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleMoveGalleryPhoto(index, 'down')}
                              disabled={index === formData.gallery.length - 1}
                              className={`p-1.5 rounded-lg transition-colors ${
                                index === formData.gallery.length - 1
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-pastel-navy-900 cursor-pointer'
                              }`}
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteGalleryPhoto(index)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: MEMORY LANE (12 MONTHS) */}
                {activeTab === 'milestones' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-display font-bold text-sm text-pastel-navy-900 flex items-center gap-1.5">
                        <span>Memory Lane (12 Months in 12 Seconds)</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Replace photos and memories for each of Mithran's 12 precious months.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.milestones.map((milestone, index) => (
                        <div
                          key={milestone.month}
                          className="p-3 rounded-2xl border border-gray-200 bg-white shadow-2xs hover:border-pastel-gold-300 transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-pastel-gold-100 text-pastel-gold-900">
                              Month {milestone.month}
                            </span>
                            <span className="text-sm">{milestone.badge || '✨'}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-pastel-gold-200 shrink-0 bg-gray-100 group">
                              <img
                                src={milestone.image}
                                alt={milestone.title}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() =>
                                  triggerUpload((url) =>
                                    handleUpdateMilestone(index, 'image', url)
                                  )
                                }
                                className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Change</span>
                              </button>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <input
                                type="text"
                                value={milestone.title}
                                placeholder="Milestone Title..."
                                onChange={(e) =>
                                  handleUpdateMilestone(index, 'title', e.target.value)
                                }
                                className="w-full text-xs px-2 py-1 rounded-md border border-gray-200 focus:border-pastel-gold-400 outline-hidden font-bold"
                              />
                              <input
                                type="text"
                                value={milestone.description}
                                placeholder="Memory Note..."
                                onChange={(e) =>
                                  handleUpdateMilestone(index, 'description', e.target.value)
                                }
                                className="w-full text-[11px] px-2 py-1 rounded-md border border-gray-200 focus:border-pastel-gold-400 outline-hidden text-gray-600"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              triggerUpload((url) =>
                                handleUpdateMilestone(index, 'image', url)
                              )
                            }
                            className="w-full py-1 rounded-lg bg-pastel-gold-50 hover:bg-pastel-gold-100 text-pastel-gold-800 text-[10px] font-bold transition-colors flex items-center justify-center gap-1 border border-pastel-gold-200 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Month {milestone.month} Photo</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: EVENT LOGISTICS */}
                {activeTab === 'event' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-display font-bold text-sm text-pastel-navy-900 flex items-center gap-1.5">
                        <span>Event & Venue Details</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Update ceremony date, time, venue address, and RSVP contact.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Date Formatted
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
                            Time Formatted
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
              </div>

              {/* Action Bar Footer */}
              <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetDefaults}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200 transition-colors shadow-2xs cursor-pointer"
                    title="Restore default photos and text"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-100 text-pastel-navy-800 text-xs font-bold border border-gray-200 transition-colors shadow-2xs cursor-pointer"
                    title="Copy config JSON to send to developer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopiedToast ? 'Copied to Clipboard! ✓' : 'Copy Config'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveAll}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md active:scale-98 transition-all cursor-pointer"
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
