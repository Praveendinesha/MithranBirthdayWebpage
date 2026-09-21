// Vercel / Netlify serverless function to securely post a blessing issue to GitHub
// using the GITHUB_TOKEN environment variable without exposing tokens to frontend clients.

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

  // GET: Fetch all public blessings from GitHub Issues
  if (req.method === 'GET') {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=blessing&state=all&per_page=100`,
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
      return res.status(200).json(issues);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  // POST: Automatically create a new blessing issue on GitHub
  if (req.method === 'POST') {
    try {
      const { name, relationship, message } = req.body || {};

      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      const title = `[Blessing] ${name.trim()} (${relationship?.trim() || 'Family Well-wisher'})`;

      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
          },
          body: JSON.stringify({
            title: title,
            body: message.trim(),
            labels: ['blessing'],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        return res.status(response.status).json({ error: 'Failed to create GitHub issue', details: errorData });
      }

      const createdIssue = await response.json();
      return res.status(201).json({ success: true, issue: createdIssue });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
