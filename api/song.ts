// Vercel / Netlify serverless function to manage live song updates via GitHub Issues
// without exposing tokens or complex backend databases.

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'praveendinesha';
  const REPO_NAME = process.env.GITHUB_REPO_NAME || 'MithranBirthdayWebpage';
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  const SONG_LABEL = 'song_update';

  // GET: Fetch the most recent song configuration from GitHub Issues
  if (req.method === 'GET') {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=${SONG_LABEL}&state=all&per_page=10&sort=created&direction=desc`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
          },
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({ error: 'GitHub fetch failed' });
      }

      const issues = await response.json();
      if (!Array.isArray(issues) || issues.length === 0) {
        return res.status(200).json({ isDefault: true, songUrl: '', volume: 0.5 });
      }

      // Parse the most recent issue body
      for (const issue of issues) {
        try {
          const parsed = JSON.parse(issue.body || '{}');
          if (parsed && typeof parsed === 'object') {
            return res.status(200).json({
              isDefault: parsed.action === 'remove' || !parsed.songUrl,
              songUrl: parsed.action === 'remove' ? '' : parsed.songUrl || '',
              title: parsed.title || issue.title?.replace(/^\[Song (Update|Reset)\]\s*/i, '') || 'Birthday Melody',
              volume: typeof parsed.volume === 'number' ? parsed.volume : 0.5,
              updatedBy: parsed.updatedBy || issue.user?.login || 'Admin',
              updatedAt: parsed.updatedAt || issue.created_at,
              action: parsed.action || 'update',
              issueUrl: issue.html_url,
            });
          }
        } catch {
          // If body is raw text
          return res.status(200).json({
            isDefault: false,
            songUrl: issue.body?.trim() || '',
            title: issue.title?.replace(/^\[Song (Update|Reset)\]\s*/i, '') || 'Custom Song',
            volume: 0.5,
            updatedBy: issue.user?.login || 'Admin',
            updatedAt: issue.created_at,
            action: 'update',
            issueUrl: issue.html_url,
          });
        }
      }

      return res.status(200).json({ isDefault: true, songUrl: '', volume: 0.5 });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  // POST: Publish a new song update issue to GitHub
  if (req.method === 'POST') {
    try {
      const { songUrl, title, volume, updatedBy, action } = req.body || {};

      const isRemove = action === 'remove' || !songUrl;
      const cleanUpdatedBy = (updatedBy || 'Admin').trim();
      const cleanTitle = (title || (isRemove ? 'Default Music Box' : 'Custom Song')).trim();

      const issueTitle = isRemove
        ? `[Song Reset] Reverted to Default Birthday Music Box by ${cleanUpdatedBy}`
        : `[Song Update] ${cleanTitle} by ${cleanUpdatedBy}`;

      const payload = {
        type: 'song_update',
        action: isRemove ? 'remove' : 'update',
        songUrl: isRemove ? '' : (songUrl || '').trim(),
        title: cleanTitle,
        volume: typeof volume === 'number' ? volume : 0.5,
        updatedBy: cleanUpdatedBy,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
          },
          method: 'POST',
          body: JSON.stringify({
            title: issueTitle,
            body: JSON.stringify(payload, null, 2),
            labels: [SONG_LABEL],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        return res.status(response.status).json({ error: 'Failed to create GitHub song issue', details: errorData });
      }

      const createdIssue = await response.json();
      return res.status(201).json({ success: true, issue: createdIssue, config: payload });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
