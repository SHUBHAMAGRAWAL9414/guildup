// utils/emailSender.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"GuildMail Bot" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error('❌ Nodemailer error:', error);
    return { success: false, error };
  }
};
