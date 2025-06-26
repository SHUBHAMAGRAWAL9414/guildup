// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cron from 'node-cron';
// import { sendEmail } from './utils/emailSender.js';
// import supabase from './utils/supabaseClient.js';
// import scheduleRoutes from './routes/schedule.js';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/schedule', scheduleRoutes);

// // 🔁 Cron Job: Every minute
// cron.schedule('* * * * *', async () => {
//   console.log('⏰ Checking for scheduled emails...');

//   const now = new Date().toISOString();

//   const { data: emails, error } = await supabase
//     .from('scheduled_emails')
//     .select('*')
//     .eq('status', 'scheduled')
//     .lte('schedule_time', now);

//   if (error) {
//     console.error('❌ Supabase query error:', error);
//     return;
//   }

//   for (const email of emails) {
//     console.log(`📤 Sending email to ${email.recipients.join(', ')}`);

//     let htmlBody = email.body;

//     if (email.attachments?.length) {
//       const list = email.attachments
//         .map(file => `<li><a href="${file.url}" target="_blank">${file.name}</a></li>`)
//         .join('');
//       htmlBody += `<br/><p><strong>Attachments:</strong></p><ul>${list}</ul>`;
//     }

//     const result = await sendEmail({
//       to: email.recipients,
//       subject: email.subject,
//       html: htmlBody,
//     });

//     if (result.success) {
//       await supabase
//         .from('scheduled_emails')
//         .update({ status: 'sent', sent_at: new Date().toISOString() })
//         .eq('id', email.id);

//       console.log(`✅ Email sent to ${email.recipients}`);
//     } else {
//       console.error(`❌ Failed to send to ${email.recipients}:`, result.error);
//     }
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
