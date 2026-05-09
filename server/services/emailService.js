/**
 * Simple email service
 * In production, replace with SendGrid, Mailgun, Nodemailer, etc.
 */

export async function sendVerificationEmail(email, verificationToken, baseUrl = 'http://localhost:5173') {
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
  
  const emailBody = `
    <h2>Welcome to NexaSphere!</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link expires in 24 hours.</p>
    <hr />
    <p>Link: <code>${verificationLink}</code></p>
  `;

  // Mock: Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[EMAIL] Verification email to ${email}:\n${emailBody}`);
    return { ok: true, mocked: true };
  }

  // TODO: Replace with real email service
  // Example using Nodemailer:
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({
  //   to: email,
  //   subject: 'Verify your NexaSphere account',
  //   html: emailBody,
  // });

  return { ok: true };
}

export async function sendPasswordResetEmail(email, resetToken, baseUrl = 'http://localhost:5173') {
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
  
  const emailBody = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link expires in 24 hours.</p>
    <hr />
    <p>Link: <code>${resetLink}</code></p>
    <p>If you didn't request this, ignore this email.</p>
  `;

  // Mock: Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[EMAIL] Password reset email to ${email}:\n${emailBody}`);
    return { ok: true, mocked: true };
  }

  // TODO: Replace with real email service
  return { ok: true };
}
