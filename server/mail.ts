import nodemailer from "nodemailer";

// Using Ethereal Email for development/testing
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  // Generate test SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
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
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
