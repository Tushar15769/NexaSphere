import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserEmailVerified,
  updateUserPassword,
  updateUserLastLogin,
} from '../repositories/userRepository.js';
import {
  createEmailVerificationToken,
  findEmailVerificationToken,
  markEmailVerificationTokenAsUsed,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenAsUsed,
} from '../repositories/tokenRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-prod';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-refresh-secret-key-change-in-prod';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
const EMAIL_VERIFICATION_EXPIRY_HOURS = Number(process.env.EMAIL_VERIFICATION_EXPIRY_HOURS || 24);
const PASSWORD_RESET_EXPIRY_HOURS = Number(process.env.PASSWORD_RESET_EXPIRY_HOURS || 24);

export function validatePassword(password) {
  // Password must be at least 8 chars, 1 uppercase, 1 number
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
  return true;
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return true;
}

export async function registerUser(email, password, fullName) {
  validateEmail(email);
  validatePassword(password);

  // Check if user already exists
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await createUser(email, passwordHash, fullName);

  // Generate email verification token (valid for 24 hours)
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);
  await createEmailVerificationToken(user.id, verificationToken, expiresAt.toISOString());

  return { user, verificationToken };
}

export async function verifyEmail(token) {
  const record = await findEmailVerificationToken(token);
  
  if (!record) {
    throw new Error('Invalid or expired verification token');
  }

  if (record.used) {
    throw new Error('Token already used');
  }

  // Check expiry
  if (new Date(record.expires_at) < new Date()) {
    throw new Error('Verification token expired');
  }

  // Mark as used
  await markEmailVerificationTokenAsUsed(record.id);

  // Update user as verified
  const user = await updateUserEmailVerified(record.user_id);

  return user;
}

export async function generateTokens(userId) {
  // Generate access token
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

  // Generate refresh token
  const refreshTokenString = crypto.randomBytes(32).toString('hex');
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await createRefreshToken(userId, refreshTokenString, refreshTokenExpiry.toISOString());

  return { accessToken, refreshToken: refreshTokenString };
}

export async function loginUser(email, password) {
  validateEmail(email);

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if email is verified
  if (!user.verified_email) {
    throw new Error('Email not verified. Please check your email for verification link.');
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await updateUserLastLogin(user.id);

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user.id);

  return {
    user: { id: user.id, email: user.email, fullName: user.full_name, verifiedEmail: user.verified_email },
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshTokenString) {
  const refreshTokenRecord = await findRefreshToken(refreshTokenString);

  if (!refreshTokenRecord) {
    throw new Error('Invalid or revoked refresh token');
  }

  if (refreshTokenRecord.revoked) {
    throw new Error('Refresh token has been revoked');
  }

  // Check expiry
  if (new Date(refreshTokenRecord.expires_at) < new Date()) {
    throw new Error('Refresh token expired');
  }

  const user = await findUserById(refreshTokenRecord.user_id);
  if (!user) {
    throw new Error('User not found');
  }

  // Generate new access token
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

  return { accessToken };
}

export async function logoutUser(refreshTokenString) {
  const refreshTokenRecord = await findRefreshToken(refreshTokenString);

  if (refreshTokenRecord) {
    await revokeRefreshToken(refreshTokenRecord.id);
  }

  return { ok: true };
}

export async function requestPasswordReset(email) {
  validateEmail(email);

  const user = await findUserByEmail(email);
  if (!user) {
    // Don't reveal if email exists for security
    return { ok: true };
  }

  // Generate password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000);
  await createPasswordResetToken(user.id, resetToken, expiresAt.toISOString());

  return { resetToken, userId: user.id };
}

export async function resetPassword(token, newPassword) {
  validatePassword(newPassword);

  const record = await findPasswordResetToken(token);

  if (!record) {
    throw new Error('Invalid or expired reset token');
  }

  if (record.used) {
    throw new Error('Reset token already used');
  }

  // Check expiry
  if (new Date(record.expires_at) < new Date()) {
    throw new Error('Reset token expired');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Update password
  await updateUserPassword(record.user_id, passwordHash);

  // Mark token as used
  await markPasswordResetTokenAsUsed(record.id);

  // Revoke all existing refresh tokens for security
  const user = await findUserById(record.user_id);

  return { ok: true, user };
}

export async function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    throw new Error(`Invalid token: ${err.message}`);
  }
}
