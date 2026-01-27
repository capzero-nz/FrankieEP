export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { password = '' } = req.body || {};
    const gate = process.env.ENTRY_PASSWORD || '';
    if (!gate) {
      // If not set, deny by default
      return res.status(500).json({ error: 'Password not configured' });
    }
    if (typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    if (password === gate) {
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
