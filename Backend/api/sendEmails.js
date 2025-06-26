import supabase from '../utils/supabaseClient.js'
import { sendEmail } from '../utils/emailSender.js'

export default async function handler(req, res) {
  const now = new Date().toISOString()

  const { data: emails, error } = await supabase
    .from('scheduled_emails')
    .select('*')
    .eq('status', 'scheduled')
    .lte('schedule_time', now)

  if (error) return res.status(500).json({ error })

  for (const email of emails) {
    let htmlBody = email.body

    if (email.attachments?.length) {
      const list = email.attachments
        .map(
          (file) =>
            `<li><a href="${file.url}" target="_blank">${file.name}</a></li>`
        )
        .join('')
      htmlBody += `<br/><strong>Attachments:</strong><ul>${list}</ul>`
    }

    const result = await sendEmail({
      to: email.recipients,
      subject: email.subject,
      html: htmlBody,
    })

    if (result.success) {
      await supabase
        .from('scheduled_emails')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', email.id)
    }
  }

  res.status(200).json({ message: '✅ Sent due emails' })
}
