import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "localhost";
const port = parseInt(process.env.SMTP_PORT || "1025", 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || "CyberPlus Security <security@cyberplus.id>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

let transporter: nodemailer.Transporter | null = null;

try {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
} catch (e) {
  console.warn("Nodemailer transport initialization warning:", e);
}

async function sendMail(to: string, subject: string, html: string) {
  try {
    if (transporter) {
      await transporter.sendMail({ from, to, subject, html });
      console.log(`[Email Dispatched] To: ${to} | Subject: "${subject}"`);
      return true;
    }
  } catch (err) {
    console.warn(`[Email Delivery Simulated] Failed to send via SMTP:`, err);
  }
  // Fallback log for local dev when SMTP/Mailpit isn't running
  console.log(`[Email Log - Local Fallback]\nTo: ${to}\nSubject: ${subject}\nBody: ${html.slice(0, 300)}...`);
  return true;
}

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${appUrl}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0d9488; margin-bottom: 16px;">Verify your CyberPlus account</h2>
      <p style="color: #334155; line-height: 1.6;">Welcome to CyberPlus. Please verify your email address to unlock your proof-of-human enrollment.</p>
      <div style="margin: 28px 0;">
        <a href="${url}" style="background: #0d9488; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="color: #64748b; font-size: 13px;">Or copy and paste this link: <br/><a href="${url}">${url}</a></p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 11px;">If you did not request this account, please ignore this email.</p>
    </div>
  `;
  return sendMail(to, "Verify your CyberPlus account", html);
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${appUrl}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0d9488; margin-bottom: 16px;">Reset your password</h2>
      <p style="color: #334155; line-height: 1.6;">You requested a password reset for your CyberPlus profile. This single-use link expires in 1 hour.</p>
      <div style="margin: 28px 0;">
        <a href="${url}" style="background: #0d9488; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 13px;">Link: <a href="${url}">${url}</a></p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 11px;">If you did not request a password reset, your key remains safe. No changes have been made.</p>
    </div>
  `;
  return sendMail(to, "CyberPlus Password Reset Request", html);
}

export async function sendEmergencyFreezeEmail(to: string, token: string) {
  const url = `${appUrl}/api/key/emergency-freeze?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #fca5a5; border-radius: 12px; background: #fff5f5;">
      <h2 style="color: #dc2626; margin-bottom: 16px;">EMERGENCY KEY FREEZE LINK</h2>
      <p style="color: #334155; line-height: 1.6;">
        A new key lifecycle event occurred on your CyberPlus profile. Keep this email in a safe place.
      </p>
      <p style="color: #334155; line-height: 1.6;">
        If your phone was stolen or your key compromised, click the link below to <strong>freeze your key instantly without needing to log in</strong>:
      </p>
      <div style="margin: 28px 0;">
        <a href="${url}" style="background: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Freeze Identity Key Instantly</a>
      </div>
      <p style="color: #64748b; font-size: 13px;">Single-use signed URL: <br/><a href="${url}">${url}</a></p>
      <hr style="border: none; border-top: 1px solid #fecaca; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 11px;">CyberPlus Zero-Trust Security Protocol</p>
    </div>
  `;
  return sendMail(to, "URGENT: Your CyberPlus Emergency Freeze Link", html);
}

export async function sendAppointmentConfirmationEmail(to: string, locationName: string, dateTime: Date) {
  const dateStr = dateTime.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0d9488; margin-bottom: 16px;">In-Person Verification Appointment Confirmed</h2>
      <p style="color: #334155; line-height: 1.6;">Your appointment to upgrade your assurance tier has been booked.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Location:</strong> ${locationName}</p>
        <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${dateStr}</p>
      </div>
      <p style="color: #334155; font-size: 13px;">Please bring a valid physical government-issued identity document (Passport or Driver's License). Remember: our officers never take photos of your face, fingerprints, or iris.</p>
    </div>
  `;
  return sendMail(to, "CyberPlus Appointment Confirmation", html);
}

export async function sendContactConfirmationEmail(to: string, name: string, subject: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0d9488; margin-bottom: 16px;">Message Received — CyberPlus Security</h2>
      <p style="color: #334155; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #334155; line-height: 1.6;">We have received your message regarding &ldquo;${subject}&rdquo;. A member of our security team will review it and reply promptly.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 11px;">CyberPlus Inquiries Desk</p>
    </div>
  `;
  return sendMail(to, "We received your message — CyberPlus", html);
}

