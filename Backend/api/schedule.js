import supabase from '../utils/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { title, body, recipients, scheduleTime, attachments } = req.body;

  if (!title || !body || !recipients || !scheduleTime) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const sendAt = new Date(scheduleTime);
  if (sendAt <= new Date()) {
    return res.status(400).json({ error: 'Schedule time must be in the future' });
  }

  const { error } = await supabase
    .from('scheduled_emails')
    .insert([
      {
        subject: title,
        body,
        recipients,
        schedule_time: sendAt.toISOString(),
        status: 'scheduled',
        attachments: attachments || []
      }
    ]);

  if (error) return res.status(500).json({ error });

  res.status(200).json({ message: '✅ Email scheduled successfully' });
}
