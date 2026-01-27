export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { name = '', image } = req.body || {};
    if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image payload' });
    }
    // TODO: Persist image to storage (Vercel Blob, S3, Cloudinary, etc.)
    // This placeholder simply acknowledges receipt.
    const id = Math.random().toString(36).slice(2);
    return res.status(200).json({ ok: true, id, received: { name } });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
