import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  // Use Production SMTP credentials if provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }

  // Fallback to Ethereal ONLY in non-production or if strict variables are missing during dev
  if (process.env.NODE_ENV === "production") {
    throw new Error("SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) are required in production!");
  }

  console.warn("⚠️ No SMTP credentials found. Falling back to Ethereal Email for development testing.");
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

export async function sendEmployeeCredentials(email: string, name: string, username: string, password: string) {
  try {
    const mailer = await getTransporter();

    const info = await mailer.sendMail({
      from: '"ForceTracker Admin" <admin@forcetracker.com>',
      to: email,
      subject: "Your ForceTracker Employee Account",
      text: `Hello ${name},\n\nYour employee account has been created. Here are your login credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease login at http://localhost:5000/login\n\nThanks,\nForceTracker Team`,
      html: `
        <h3>Hello ${name},</h3>
        <p>Your employee account has been created. Here are your login credentials:</p>
        <ul>
          <li><b>Username:</b> ${username}</li>
          <li><b>Password:</b> ${password}</li>
        </ul>
        <p>Please <a href="http://localhost:5000/login">login here</a>.</p>
        <br />
        <p>Thanks,<br />ForceTracker Team</p>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    if (info.messageId && info.messageId.includes("ethereal")) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
