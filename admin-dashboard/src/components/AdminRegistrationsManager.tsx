import { useState, useEffect } from 'react';

export default function AdminRegistrationsManager({ eventId, accessToken }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [exporting, setExporting] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

  useEffect(() => {
    if (eventId && accessToken) {
      fetchRegistrations();
    }
  }, [eventId, accessToken, filter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiBase}/api/events/${eventId}/registrations`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!response.ok) throw new Error('Failed to fetch registrations');

      const data = await response.json();
      let filtered = data;

      if (filter !== 'all') {
        filtered = data.filter((reg) => reg.status === filter);
      }

      setRegistrations(filtered);
    } catch (err) {
      setError(err.message || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttended = async (userId) => {
    try {
      const response = await fetch(
        `${apiBase}/api/events/${eventId}/registrations/${userId}/attend`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error('Failed to mark attendance');

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.userId === userId ? { ...reg, status: 'attended' } : reg
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const response = await fetch(
        `${apiBase}/api/admin/events/${eventId}/registrations/export`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations-${eventId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading registrations...</div>;

  return (
    <div className="admin-registrations">
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-controls">
        <div className="filter-buttons">
          {['all', 'registered', 'waitlist', 'attended'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <button
          className="export-btn"
          onClick={handleExportCSV}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : '📥 Export CSV'}
        </button>
      </div>

      <div className="registrations-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Registration Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">
                  No registrations
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.userId} className={`status-${reg.status}`}>
                  <td>{reg.fullName}</td>
                  <td>{reg.email}</td>
                  <td>
                    <span className={`status-badge ${reg.status}`}>
                      {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                    </span>
                  </td>
                  <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                  <td>
                    {reg.status === 'registered' && (
                      <button
                        className="action-btn"
                        onClick={() => handleMarkAttended(reg.userId)}
                      >
                        ✓ Mark Attended
                      </button>
                    )}
                    {reg.status === 'attended' && <span className="completed">✓ Done</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
