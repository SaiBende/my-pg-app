
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Setup transporter once (Ethereal for test, or update for production)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user:  process.env.GMAIL_USER ,
    pass: process.env.GMAIL_PASSWORD ,
  },
});

export const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"My App" <${ process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
