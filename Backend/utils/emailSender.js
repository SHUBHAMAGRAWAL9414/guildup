import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"GuildMail Bot" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    return { success: true, info };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error };
  }
};
