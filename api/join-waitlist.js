import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { email = '' } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM || !process.env.RESEND_TO) {
      return res.status(500).json({ error: 'Missing Resend environment variables' });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = `New Tour Waitlist Signup`;
    const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;line-height:1.6;">`
      + `<p>A new email has joined the tour waitlist:</p>`
      + `<p style="font-weight:700;">${email}</p>`
      + `</div>`;
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_TO,
      subject,
      text: `New tour waitlist signup: ${email}`,
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
