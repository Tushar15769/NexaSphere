import { supabaseRequest } from '../utils/supabase.js';

export async function findUserByEmail(email) {
  try {
    const rows = await supabaseRequest(
      `users?email=eq.${encodeURIComponent(email.toLowerCase())}&select=*`
    );
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function findUserById(userId) {
  try {
    const rows = await supabaseRequest(`users?id=eq.${encodeURIComponent(userId)}&select=*`);
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function createUser(email, passwordHash, fullName) {
  const [user] = await supabaseRequest('users', {
    method: 'POST',
    body: [{
      email: email.toLowerCase(),
      password_hash: passwordHash,
      full_name: fullName || null,
      verified_email: false,
    }],
  });
  return user;
}

export async function updateUserEmailVerified(userId) {
  const [user] = await supabaseRequest(
    `users?id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      body: { verified_email: true, updated_at: new Date().toISOString() },
    }
  );
  return user || null;
}

export async function updateUserLastLogin(userId) {
  await supabaseRequest(
    `users?id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      body: { last_login_at: new Date().toISOString() },
    }
  );
}

export async function updateUserPassword(userId, newPasswordHash) {
  const [user] = await supabaseRequest(
    `users?id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      body: { password_hash: newPasswordHash, updated_at: new Date().toISOString() },
    }
  );
  return user || null;
}
