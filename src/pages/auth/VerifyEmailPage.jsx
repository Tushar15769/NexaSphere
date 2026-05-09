import { useState, useEffect } from 'react';
import '../styles/auth.css';

export default function VerifyEmailPage({ token, onBack, onSuccess }) {
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${apiBase}/api/auth/verify-email?token=${encodeURIComponent(token)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Email verification failed');
      }

      setSuccess('✓ Email verified successfully!');
      
      // Notify parent after 2 seconds
      if (onSuccess) {
        setTimeout(() => {
          onSuccess({ verified: true });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Email verification failed. Please try again or request a new verification link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="auth-back-btn" onClick={onBack} title="Go back">←</button>
        <h1>Verify Email</h1>

        {loading && (
          <div className="auth-loading">
            <div className="spinner"></div>
            <p>Verifying your email...</p>
          </div>
        )}

        {error && !loading && (
          <>
            <div className="auth-error">{error}</div>
            <div className="auth-footer">
              <p>Please contact support for assistance.</p>
            </div>
          </>
        )}

        {success && !loading && (
          <>
            <div className="auth-success">{success}</div>
            <div className="auth-footer">
              <p>You can now access your account.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
