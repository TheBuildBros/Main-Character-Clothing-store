import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: "signup" | "reset",
) {
  const subject =
    purpose === "signup" ? "Your verification code" : "Reset your password";
  const intro =
    purpose === "signup"
      ? "Use this code to finish creating your account."
      : "Use this code to reset your password.";

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text: `${intro}\n\nYour code: ${code}\n\nIt expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `
      <p>${intro}</p>
      <p style="font-size:28px;letter-spacing:6px;font-weight:bold">${code}</p>
      <p>It expires in 10 minutes. If you did not request this, ignore this email.</p>`,
  });
}
