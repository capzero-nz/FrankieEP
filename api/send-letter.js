import { Resend } from 'resend';

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { name = '', message = '' } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM || !process.env.RESEND_TO) {
      return res.status(500).json({ error: 'Missing Resend environment variables' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = `New Letter from ${name || 'Anonymous'}`;
    const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;line-height:1.6;">`
      + `<h2 style="margin:0 0 10px;">${escapeHtml(subject)}</h2>`
      + `<pre style="white-space:pre-wrap;margin:0;padding:12px;border:1px solid #eee;border-radius:8px;background:#fafafa;">${escapeHtml(message)}</pre>`
      + `</div>`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_TO,
      subject,
      text: message,
      html
    });
    if (error) {
      return res.status(500).json({ error: 'Email send failed', detail: error });
    }
    return res.status(200).json({ ok: true, id: data?.id || null });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
