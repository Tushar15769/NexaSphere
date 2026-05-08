import { useState, useEffect } from 'react';

export default function UserEventsDashboard({ accessToken, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

  useEffect(() => {
    if (!accessToken) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    fetchUserEvents();
  }, [accessToken]);

  const fetchUserEvents = async () => {
    try {
      const response = await fetch(`${apiBase}/api/user/events`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setUpcoming(data.upcoming || []);
      setPast(data.past || []);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>My Events</h1>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="dashboard-empty">
          <p>You haven't registered for any events yet.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="dashboard-section">
              <h2>Upcoming Events</h2>
              <div className="events-list">
                {upcoming.map((reg) => (
                  <div key={reg.eventId} className="event-card">
                    <div className="event-info">
                      <h3>{reg.eventName}</h3>
                      <p className="event-date">📅 {reg.eventDate}</p>
                      <span className={`status-badge ${reg.status}`}>
                        {reg.status === 'registered' && '✓ Registered'}
                        {reg.status === 'waitlist' && '⏳ Waitlist'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section className="dashboard-section">
              <h2>Past Events</h2>
              <div className="events-list">
                {past.map((reg) => (
                  <div key={reg.eventId} className="event-card past">
                    <div className="event-info">
                      <h3>{reg.eventName}</h3>
                      <p className="event-date">📅 {reg.eventDate}</p>
                      <span className={`status-badge ${reg.status}`}>
                        {reg.status === 'attended' && '✓ Attended'}
                        {reg.status === 'registered' && '✓ Registered'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
