import { GITHUB_REPO_OWNER, GITHUB_REPO_NAME, getStoredGitHubToken } from './githubGuestbook';
import { loadInvitationData, saveInvitationData, type EditableInvitationData } from './photoStorage';

export const GITHUB_SONG_LABEL = 'song_update';
const GITHUB_SONG_CACHE_KEY = 'mithran_gh_song_cache_v1';

/**
 * Uploads an audio file (.mp3, .m4a, .wav) to a fast CORS cloud host so it gets a permanent public streaming URL
 */
export async function uploadAudioToCloud(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file, file.name || 'birthday_song.mp3');

    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data?.data?.url) {
      // tmpfiles.org /dl/ URL provides direct streaming audio
      const directUrl = data.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
      return { success: true, url: directUrl };
    }

    return { success: false, error: 'Could not retrieve streaming URL' };
  } catch (err: any) {
    console.error('Audio upload error:', err);
    return { success: false, error: err.message || 'Upload failed' };
  }
}

export interface GitHubSongConfig {
  songUrl: string;
  title?: string;
  volume?: number;
  isDefault?: boolean;
  updatedBy?: string;
  updatedAt?: string;
  action?: 'update' | 'remove';
  issueUrl?: string;
}

/**
 * Format timestamp into friendly string
 */
export function formatFriendlyTime(isoString?: string): string {
  if (!isoString) return 'Recently';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Get cached song info from localStorage
 */
export function getCachedGitHubSong(): GitHubSongConfig | null {
  try {
    const raw = localStorage.getItem(GITHUB_SONG_CACHE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Save song info to local cache
 */
export function setCachedGitHubSong(config: GitHubSongConfig): void {
  try {
    localStorage.setItem(GITHUB_SONG_CACHE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

/**
 * Fetch the latest song setting from GitHub (Serverless endpoint or GitHub Issues API)
 */
export async function fetchLatestGitHubSong(): Promise<GitHubSongConfig | null> {
  // 1. Try serverless endpoint first (/api/song)
  try {
    const apiRes = await fetch('/api/song');
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && typeof data === 'object') {
        const config: GitHubSongConfig = {
          isDefault: data.isDefault ?? (!data.songUrl),
          songUrl: data.songUrl || '',
          title: data.title || (data.isDefault ? 'Default Royal Music Box' : 'Custom Song'),
          volume: typeof data.volume === 'number' ? data.volume : 0.5,
          updatedBy: data.updatedBy || 'SMS Family',
          updatedAt: data.updatedAt || new Date().toISOString(),
          action: data.action || (data.isDefault ? 'remove' : 'update'),
          issueUrl: data.issueUrl,
        };
        setCachedGitHubSong(config);
        return config;
      }
    }
  } catch {
    // serverless not available, fallback to direct GitHub API
  }

  // 2. Direct public GitHub API (No auth required for public reading)
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues?labels=${GITHUB_SONG_LABEL}&state=all&per_page=5&sort=created&direction=desc`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      console.warn('GitHub Song API response not ok:', res.status);
      return getCachedGitHubSong();
    }

    const issues = await res.json();
    if (!Array.isArray(issues) || issues.length === 0) {
      return null;
    }

    // Parse the most recent issue
    for (const issue of issues) {
      try {
        const parsed = JSON.parse(issue.body || '{}');
        if (parsed && typeof parsed === 'object') {
          const isRemove = parsed.action === 'remove' || !parsed.songUrl;
          const config: GitHubSongConfig = {
            isDefault: isRemove,
            songUrl: isRemove ? '' : (parsed.songUrl || ''),
            title: parsed.title || issue.title?.replace(/^\[Song (Update|Reset)\]\s*/i, '') || (isRemove ? 'Default Royal Music Box' : 'Custom Song'),
            volume: typeof parsed.volume === 'number' ? parsed.volume : 0.5,
            updatedBy: parsed.updatedBy || issue.user?.login || 'Admin',
            updatedAt: parsed.updatedAt || issue.created_at,
            action: isRemove ? 'remove' : 'update',
            issueUrl: issue.html_url,
          };
          setCachedGitHubSong(config);
          return config;
        }
      } catch {
        const isRemove = issue.title.includes('[Song Reset]');
        const config: GitHubSongConfig = {
          isDefault: isRemove,
          songUrl: isRemove ? '' : (issue.body?.trim() || ''),
          title: issue.title?.replace(/^\[Song (Update|Reset)\]\s*/i, '') || (isRemove ? 'Default Royal Music Box' : 'Custom Song'),
          volume: 0.5,
          updatedBy: issue.user?.login || 'Admin',
          updatedAt: issue.created_at,
          action: isRemove ? 'remove' : 'update',
          issueUrl: issue.html_url,
        };
        setCachedGitHubSong(config);
        return config;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch song from GitHub Issues:', err);
  }

  return getCachedGitHubSong();
}

/**
 * Save new song to GitHub Issues so ALL users see/hear it
 */
export async function saveSongToGitHub(params: {
  songUrl: string;
  title?: string;
  volume?: number;
  updatedBy?: string;
  action?: 'update' | 'remove';
}): Promise<{ success: boolean; issueUrl?: string; savedToGitHub?: boolean }> {
  const isRemove = params.action === 'remove' || !params.songUrl?.trim();
  const cleanUpdatedBy = (params.updatedBy || 'Admin').trim();
  const cleanTitle = (params.title || (isRemove ? 'Default Royal Music Box' : 'Custom Birthday Melody')).trim();

  const payload = {
    type: 'song_update',
    action: isRemove ? 'remove' : 'update',
    songUrl: isRemove ? '' : params.songUrl.trim(),
    title: cleanTitle,
    volume: typeof params.volume === 'number' ? params.volume : 0.5,
    updatedBy: cleanUpdatedBy,
    updatedAt: new Date().toISOString(),
  };

  // Update local cache immediately
  const config: GitHubSongConfig = {
    isDefault: isRemove,
    songUrl: payload.songUrl,
    title: cleanTitle,
    volume: payload.volume,
    updatedBy: cleanUpdatedBy,
    updatedAt: payload.updatedAt,
    action: payload.action as 'update' | 'remove',
  };
  setCachedGitHubSong(config);

  // Sync with EditableInvitationData
  try {
    const currentData = loadInvitationData();
    const updatedData: EditableInvitationData = {
      ...currentData,
      music: {
        ...currentData.music,
        songUrl: payload.songUrl,
        title: cleanTitle,
        volume: payload.volume,
      },
    };
    saveInvitationData(updatedData);
  } catch {
    // ignore
  }

  // 1. Try serverless backend route (/api/song)
  try {
    const apiRes = await fetch('/api/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      return { success: true, issueUrl: data.issue?.html_url, savedToGitHub: true };
    }
  } catch {
    // fallback
  }

  // 2. Try direct GitHub REST API with configured token
  const token = getStoredGitHubToken();
  if (token) {
    try {
      const issueTitle = isRemove
        ? `[Song Reset] Reverted to Default Birthday Music Box by ${cleanUpdatedBy}`
        : `[Song Update] ${cleanTitle} by ${cleanUpdatedBy}`;

      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: issueTitle,
            body: JSON.stringify(payload, null, 2),
            labels: [GITHUB_SONG_LABEL],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        return { success: true, issueUrl: data.html_url, savedToGitHub: true };
      }
    } catch (err) {
      console.error('Error posting song issue to GitHub:', err);
    }
  }

  return { success: true, savedToGitHub: false };
}

/**
 * Generate 1-click fallback URL to create a song update issue on GitHub
 */
export function createDirectGitHubSongIssueUrl(params: {
  songUrl: string;
  title?: string;
  volume?: number;
  updatedBy?: string;
  action?: 'update' | 'remove';
}): string {
  const isRemove = params.action === 'remove' || !params.songUrl?.trim();
  const cleanUpdatedBy = (params.updatedBy || 'Admin').trim();
  const cleanTitle = (params.title || (isRemove ? 'Default Royal Music Box' : 'Custom Song')).trim();

  const title = encodeURIComponent(
    isRemove
      ? `[Song Reset] Reverted to Default Birthday Music Box by ${cleanUpdatedBy}`
      : `[Song Update] ${cleanTitle} by ${cleanUpdatedBy}`
  );

  const payload = {
    type: 'song_update',
    action: isRemove ? 'remove' : 'update',
    songUrl: isRemove ? '' : params.songUrl.trim(),
    title: cleanTitle,
    volume: typeof params.volume === 'number' ? params.volume : 0.5,
    updatedBy: cleanUpdatedBy,
    updatedAt: new Date().toISOString(),
  };

  const body = encodeURIComponent(JSON.stringify(payload, null, 2));
  return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new?title=${title}&body=${body}&labels=${GITHUB_SONG_LABEL}`;
}
