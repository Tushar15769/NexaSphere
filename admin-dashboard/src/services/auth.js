const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
const TOKEN_KEY = 'ns_admin_token';
const EMAIL_KEY = 'ns_admin_email';

export const auth = {
  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Dev-only offline mode
    if (import.meta.env.DEV && cleanEmail === 'dev@nexasphere.org' && cleanPassword === 'dev') {
      const devToken = `dev-session-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(TOKEN_KEY, devToken);
      localStorage.setItem(EMAIL_KEY, cleanEmail);
      return { token: devToken, email: cleanEmail };
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Invalid credentials');
      }
      const data = await res.json();
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(EMAIL_KEY, email);
      return data;
    } catch (err) {
      throw err;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
  },

  getToken() { return localStorage.getItem(TOKEN_KEY); },
  getEmail() { return localStorage.getItem(EMAIL_KEY); },
  isAuthenticated() { return !!this.getToken(); },
};
