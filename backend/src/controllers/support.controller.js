import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SUPPORT_RECEIVER = process.env.SUPPORT_RECEIVER || "p22724439@gmail.com";

function validateEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

// Fail-safe support handler with verbose instrumentation to surface errors in logs
export async function sendSupportEmail(req, res) {
  console.log("Support request body:", req.body);
  console.log("SMTP config present:", {
    hasHost: Boolean(SMTP_HOST),
    hasPort: Boolean(SMTP_PORT),
    hasUser: Boolean(SMTP_USER),
    hasPass: Boolean(SMTP_PASS),
    supportReceiver: SUPPORT_RECEIVER,
  });

  try {
    const { name, email, role, category, message } = req.body || {};

    if (!name || !email || !role || !category || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    let transporter;
    let usedTestAccount = false;

    // Create transporter using provided SMTP credentials when available
    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      try {
        console.log("Creating SMTP transporter using provided env vars");
        transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });
      } catch (e) {
        console.error("Failed to create transporter from SMTP envs:", e);
        transporter = undefined;
      }
    }

    // If transporter not created, fallback to Ethereal test account (dev)
    if (!transporter) {
      try {
        console.warn("SMTP transporter not configured properly — falling back to test account");
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        usedTestAccount = true;
      } catch (e) {
        console.error("Failed to create nodemailer test account:", e);
        // Still return a safe JSON error rather than letting the handler crash
        return res.status(500).json({ success: false, message: "Support failed", error: e.message });
      }
    }

    const subject = `[Support] ${category} — ${name} (${role})`;
    const html = `<p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Role:</strong> ${role}</p>
    <p><strong>Category:</strong> ${category}</p>
    <hr />
    <p>${message.replace(/\n/g, "<br/>")}</p>`;

    // Instrument before sending
    console.log("About to send support email, using transporter", { usedTestAccount });

    let info;
    try {
      info = await transporter.sendMail({
        from: `${name} <${SMTP_USER || SUPPORT_RECEIVER}>`,
        to: SUPPORT_RECEIVER,
        subject,
        html,
        replyTo: email,
      });
    } catch (sendErr) {
      console.error("Error during transporter.sendMail:", sendErr);
      return res.status(500).json({ success: false, message: "Support failed", error: sendErr.message });
    }

    console.log("Support email sent:", info && info.messageId);
    const result = { success: true, messageId: info?.messageId };
    if (usedTestAccount) {
      try {
        const preview = nodemailer.getTestMessageUrl(info);
        console.log("Preview URL:", preview);
        result.previewUrl = preview;
      } catch (e) {
        console.warn("Failed to get test preview URL:", e);
      }
    }

    return res.json(result);
  } catch (error) {
    console.error("Support API error:", error);
    return res.status(500).json({ success: false, message: "Support failed", error: error?.message || String(error) });
  }
}

// Temporary test handler — returns success without sending email
export const sendSupportEmailTest = async (req, res) => {
  try {
    console.log("Support payload (test):", req.body);
    return res.json({ success: true, message: "Support API working (test mode)" });
  } catch (err) {
    console.error("Support test handler error:", err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
};
