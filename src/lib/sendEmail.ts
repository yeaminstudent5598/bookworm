// sendEmail.ts
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

export const sendEmail = async (email: string, subject: string, data: any) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const templatePath = path.join(process.cwd(), 'src/lib/templates/forgotPassword.ejs');
  const html = await ejs.renderFile(templatePath, data);

  await transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject});
};