import { supabaseRequest } from '../utils/supabase.js';

// Email verification tokens
export async function createEmailVerificationToken(userId, token, expiresAt) {
  const [record] = await supabaseRequest('email_verification_tokens', {
    method: 'POST',
    body: [{
      user_id: userId,
      token,
      expires_at: expiresAt,
      used: false,
    }],
  });
  return record;
}

export async function findEmailVerificationToken(token) {
  try {
    const rows = await supabaseRequest(
      `email_verification_tokens?token=eq.${encodeURIComponent(token)}&select=*`
    );
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function markEmailVerificationTokenAsUsed(tokenId) {
  await supabaseRequest(
    `email_verification_tokens?id=eq.${encodeURIComponent(tokenId)}`,
    {
      method: 'PATCH',
      body: { used: true },
    }
  );
}

// Refresh tokens
export async function createRefreshToken(userId, token, expiresAt) {
  const [record] = await supabaseRequest('refresh_tokens', {
    method: 'POST',
    body: [{
      user_id: userId,
      token,
      expires_at: expiresAt,
      revoked: false,
    }],
  });
  return record;
}

export async function findRefreshToken(token) {
  try {
    const rows = await supabaseRequest(
      `refresh_tokens?token=eq.${encodeURIComponent(token)}&select=*`
    );
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function revokeRefreshToken(tokenId) {
  await supabaseRequest(
    `refresh_tokens?id=eq.${encodeURIComponent(tokenId)}`,
    {
      method: 'PATCH',
      body: { revoked: true },
    }
  );
}

// Password reset tokens
export async function createPasswordResetToken(userId, token, expiresAt) {
  const [record] = await supabaseRequest('password_reset_tokens', {
    method: 'POST',
    body: [{
      user_id: userId,
      token,
      expires_at: expiresAt,
      used: false,
    }],
  });
  return record;
}

export async function findPasswordResetToken(token) {
  try {
    const rows = await supabaseRequest(
      `password_reset_tokens?token=eq.${encodeURIComponent(token)}&select=*`
    );
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function markPasswordResetTokenAsUsed(tokenId) {
  await supabaseRequest(
    `password_reset_tokens?id=eq.${encodeURIComponent(tokenId)}`,
    {
      method: 'PATCH',
      body: { used: true },
    }
  );
}
