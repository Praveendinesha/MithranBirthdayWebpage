import { invitationData, type MilestoneMonth, type GalleryPhoto } from '../config/invitationData';

const STORAGE_KEY = 'magizh_mithran_custom_invitation_v1';

export interface EditableInvitationData {
  baby: typeof invitationData.baby;
  event: typeof invitationData.event;
  gallery: GalleryPhoto[];
  milestones: MilestoneMonth[];
  initialBlessings: typeof invitationData.initialBlessings;
  music: typeof invitationData.music;
}

/**
 * Loads current invitation data from localStorage or fallback to default configuration
 */
export const loadInvitationData = (): EditableInvitationData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure targetDate is a real Date instance
      if (parsed.event && parsed.event.targetDate) {
        parsed.event.targetDate = new Date(parsed.event.targetDate);
      }
      return {
        ...invitationData,
        ...parsed,
        baby: { ...invitationData.baby, ...(parsed.baby || {}) },
        event: { ...invitationData.event, ...(parsed.event || {}) },
        gallery: parsed.gallery && parsed.gallery.length > 0 ? parsed.gallery : invitationData.gallery,
        milestones: parsed.milestones && parsed.milestones.length > 0 ? parsed.milestones : invitationData.milestones,
        music: { ...invitationData.music, ...(parsed.music || {}) },
      };
    }
  } catch (err) {
    console.warn('Failed to load custom data from localStorage:', err);
  }
  return invitationData;
};

/**
 * Saves modified invitation data to localStorage and dispatches a storage event
 */
export const saveInvitationData = (data: EditableInvitationData): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('invitation_data_updated', { detail: data }));
    return true;
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    return false;
  }
};

/**
 * Clears custom localStorage overrides and restores original defaults
 */
export const resetToDefaultInvitationData = (): EditableInvitationData => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('invitation_data_updated', { detail: invitationData }));
  } catch (err) {
    console.error('Failed to reset localStorage:', err);
  }
  return invitationData;
};

/**
 * Compress and resize uploaded image using HTML5 Canvas to prevent localStorage quota exhaustion
 */
export const compressImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
