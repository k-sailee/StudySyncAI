import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"StudySyncAI" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
  });
};
await sendEmail(
  studentEmail,
  "New class scheduled",
  `${subject} on ${date} at ${time}`
);
