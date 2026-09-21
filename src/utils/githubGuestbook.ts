import type { GuestBlessing } from '../config/invitationData';

export const GITHUB_REPO_OWNER = 'praveendinesha';
export const GITHUB_REPO_NAME = 'MithranBirthdayWebpage';
export const GITHUB_BLESSING_LABEL = 'blessing';

const GITHUB_TOKEN_STORAGE_KEY = 'mithran_gh_token_v1';

/**
 * Format ISO date string into human friendly time (e.g. "2 hours ago", "Yesterday", "Oct 4")
 */
function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 5) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

/**
 * Parses raw GitHub issue object into GuestBlessing format
 */
function parseIssueToBlessing(issue: any): GuestBlessing {
  let name = issue.title.replace(/^\[Blessing\]\s*/i, '').trim();
  let relationship = 'Family Well-wisher';

  const relMatch = name.match(/^(.*?)\s*\((.*?)\)$/);
  if (relMatch) {
    name = relMatch[1].trim();
    relationship = relMatch[2].trim();
  }

  const reactionsCount = (issue.reactions?.['+1'] || 0) + (issue.reactions?.heart || 0);

  return {
    id: `gh_${issue.id || issue.number}`,
    name: name || 'Beloved Well-wisher',
    relationship: relationship,
    message: issue.body || 'Best wishes and blessings for little Mithran! 👑✨',
    timestamp: formatTimeAgo(issue.created_at),
    avatarEmoji: '👑',
    likes: Math.max(1, reactionsCount),
    color: 'bg-white',
  };
}

/**
 * Fetch public blessings from GitHub repository issues
 */
export async function fetchGitHubBlessings(): Promise<GuestBlessing[]> {
  // 1. Try serverless endpoint first if hosted on Vercel/Netlify
  try {
    const apiRes = await fetch('/api/blessings');
    if (apiRes.ok) {
      const issues = await apiRes.json();
      if (Array.isArray(issues) && issues.length > 0) {
        return issues.map(parseIssueToBlessing);
      }
    }
  } catch {
    // Fallback to direct GitHub public API
  }

  // 2. Direct public GitHub API (No auth required for public reading)
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues?labels=${GITHUB_BLESSING_LABEL}&state=all&per_page=100`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      console.warn('GitHub API response not ok:', res.status);
      return [];
    }

    const issues = await res.json();
    if (!Array.isArray(issues)) return [];

    return issues.map(parseIssueToBlessing);
  } catch (err) {
    console.warn('Failed to fetch blessings from GitHub Issues:', err);
    return [];
  }
}

/**
 * Get stored GitHub token for automated posting (from localStorage or Vite env)
 */
export function getStoredGitHubToken(): string {
  const envToken = (import.meta as any).env?.VITE_GITHUB_TOKEN;
  if (envToken) return envToken;
  return localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY) || '';
}

/**
 * Save GitHub token in localStorage
 */
export function saveStoredGitHubToken(token: string): void {
  if (token.trim()) {
    localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, token.trim());
  } else {
    localStorage.removeItem(GITHUB_TOKEN_STORAGE_KEY);
  }
}

/**
 * Automatically post a new blessing issue to GitHub
 */
export async function postBlessingToGitHub(
  name: string,
  relationship: string,
  message: string
): Promise<{ success: boolean; issueUrl?: string; savedToGitHub?: boolean }> {
  // 1. Try serverless backend route (/api/blessings)
  try {
    const apiRes = await fetch('/api/blessings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, relationship, message }),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      return { success: true, issueUrl: data.issue?.html_url, savedToGitHub: true };
    }
  } catch {
    // serverless not available, fallback to direct client token
  }

  // 2. Try direct GitHub REST API with configured token
  const token = getStoredGitHubToken();
  if (token) {
    try {
      const title = `[Blessing] ${name} (${relationship || 'Family Well-wisher'})`;
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
            title: title,
            body: message,
            labels: [GITHUB_BLESSING_LABEL],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        return { success: true, issueUrl: data.html_url, savedToGitHub: true };
      }
    } catch (err) {
      console.error('Error posting issue to GitHub:', err);
    }
  }

  return { success: false, savedToGitHub: false };
}

/**
 * Generates a direct GitHub new issue URL for 1-click fallback
 */
export function createDirectGitHubIssueUrl(name: string, relationship: string, message: string): string {
  const title = encodeURIComponent(`[Blessing] ${name} (${relationship || 'Family Well-wisher'})`);
  const body = encodeURIComponent(message);
  return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new?title=${title}&body=${body}&labels=${GITHUB_BLESSING_LABEL}`;
}
