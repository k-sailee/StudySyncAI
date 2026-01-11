import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SUPPORT_RECEIVER = process.env.SUPPORT_RECEIVER || "p22724439@gmail.com";

function validateEmail(email) {
  // simple validation
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

export async function sendSupportEmail(req, res) {
  try {
    const { name, email, role, category, message } = req.body || {};

    if (!name || !email || !role || !category || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    let transporter;
    let usedTestAccount = false;

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
    } else {
      // Development fallback: create an Ethereal test account so devs can see a preview URL
      console.warn("SMTP env vars missing — falling back to nodemailer test account (ethereal)");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      usedTestAccount = true;
    }

    const subject = `[Support] ${category} — ${name} (${role})`;
    const html = `<p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Role:</strong> ${role}</p>
    <p><strong>Category:</strong> ${category}</p>
    <hr />
    <p>${message.replace(/\n/g, "<br/>")}</p>`;

    const info = await transporter.sendMail({
      from: `${name} <${SMTP_USER}>`,
      to: SUPPORT_RECEIVER,
      subject,
      html,
      replyTo: email,
    });

    console.log("Support email sent:", info.messageId);
    const result = { ok: true, messageId: info.messageId };
    if (usedTestAccount) {
      const preview = nodemailer.getTestMessageUrl(info);
      console.log("Preview URL:", preview);
      result.previewUrl = preview;
    }
    return res.json(result);
  } catch (err) {
    console.error("Error sending support email:", err);
    return res.status(500).json({ error: "Failed to send support message" });
  }
}
