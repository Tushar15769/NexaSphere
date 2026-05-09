import {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  verifyAccessToken,
  validateEmail,
  validatePassword,
} from '../services/authService.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { findUserById } from '../repositories/userRepository.js';

const BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

function toSafeString(value, max = 4000) {
  return String(value ?? '').trim().slice(0, max);
}

export async function register(req, res) {
  try {
    const email = toSafeString(req.body?.email, 140).toLowerCase();
    const password = req.body?.password || '';
    const fullName = toSafeString(req.body?.fullName, 120);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { user, verificationToken } = await registerUser(email, password, fullName);

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, BASE_URL);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue despite email error - user can retry
    }

    return res.status(201).json({
      ok: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: { id: user.id, email: user.email, fullName: user.full_name },
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Registration failed' });
  }
}

export async function verifyEmailToken(req, res) {
  try {
    const token = toSafeString(req.query?.token, 500);

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await verifyEmail(token);

    return res.json({
      ok: true,
      message: 'Email verified successfully. You can now log in.',
      user: { id: user.id, email: user.email, fullName: user.full_name },
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Email verification failed' });
  }
}

export async function login(req, res) {
  try {
    const email = toSafeString(req.body?.email, 140).toLowerCase();
    const password = req.body?.password || '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { user, accessToken, refreshToken } = await loginUser(email, password);

    return res.json({
      ok: true,
      user,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    return res.status(401).json({ error: e.message || 'Login failed' });
  }
}

export async function refresh(req, res) {
  try {
    const refreshToken = req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const { accessToken } = await refreshAccessToken(refreshToken);

    return res.json({ ok: true, accessToken });
  } catch (e) {
    return res.status(401).json({ error: e.message || 'Token refresh failed' });
  }
}

export async function logout(req, res) {
  try {
    const refreshToken = req.body?.refreshToken;

    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    return res.json({ ok: true, message: 'Logged out successfully' });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Logout failed' });
  }
}

export async function forgotPassword(req, res) {
  try {
    const email = toSafeString(req.body?.email, 140).toLowerCase();

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    validateEmail(email);

    const { resetToken } = await requestPasswordReset(email);

    // Send password reset email
    if (resetToken) {
      try {
        await sendPasswordResetEmail(email, resetToken, BASE_URL);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }
    }

    // Always return success for security (don't reveal if email exists)
    return res.json({
      ok: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Request failed' });
  }
}

export async function doResetPassword(req, res) {
  try {
    const token = toSafeString(req.body?.token, 500);
    const newPassword = req.body?.newPassword || '';

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const result = await resetPassword(token, newPassword);

    return res.json({
      ok: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Password reset failed' });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const user = await verifyAccessToken(token);

    return res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        verifiedEmail: user.verified_email,
      },
    });
  } catch (e) {
    return res.status(401).json({ error: e.message || 'Authentication failed' });
  }
}

export function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.slice(7).trim();
    // Token will be verified when used, just attach to req for now
    req.userToken = token;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
