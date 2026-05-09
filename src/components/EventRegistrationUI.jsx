import { useState } from 'react';

export default function EventRegistrationUI({ event, userRegistration, onRegister, onCancel, isAuthenticated, onLoginRequired }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onRegister();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onCancel();
    } catch (err) {
      setError(err.message || 'Cancellation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-registration">
      {error && <div className="registration-error">{error}</div>}

      {!userRegistration ? (
        <button
          className="registration-button register"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : '📝 Register for Event'}
        </button>
      ) : (
        <div className="registration-status">
          <span className={`status-badge ${userRegistration.status}`}>
            {userRegistration.status === 'registered' && '✓ Registered'}
            {userRegistration.status === 'attended' && '✓ Attended'}
            {userRegistration.status === 'waitlist' && '⏳ Waitlist'}
            {userRegistration.status === 'cancelled' && '✗ Cancelled'}
          </span>
          <button
            className="registration-button cancel"
            onClick={handleCancel}
            disabled={loading || userRegistration.status === 'attended'}
            title={userRegistration.status === 'attended' ? 'Cannot cancel after attending' : 'Cancel registration'}
          >
            {loading ? 'Cancelling...' : 'Cancel Registration'}
          </button>
        </div>
      )}
    </div>
  );
}
