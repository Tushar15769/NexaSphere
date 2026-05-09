import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Skeleton } from '../components/Skeleton';

export function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.events.getAll().catch(() => ({ events: [] })),
      api.coreTeam.getAll().catch(() => ({ members: [] })),
    ]).then(([eventsData, teamData]) => {
      const events = eventsData?.events ?? [];
      const team = teamData?.members ?? [];
      setStats({
        totalEvents: events.length,
        upcomingEvents: events.filter(e => e.status === 'upcoming').length,
        teamMembers: team.length,
      });
      setLoading(false);
    });
  }, []);

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>
      {loading ? (
        <div className="stats-grid">
          <Skeleton height={100} count={3} />
        </div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <div>
              <div className="stat-value">{stats.totalEvents}</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔜</span>
            <div>
              <div className="stat-value">{stats.upcomingEvents}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <div className="stat-value">{stats.teamMembers}</div>
              <div className="stat-label">Core Team Members</div>
            </div>
          </div>
        </div>
      )}
      <div className="quick-links">
        <h3>Quick Actions</h3>
        <div className="quick-grid">
          <a href="/dashboard/events" className="quick-card">📅 Manage Events</a>
          <a href="/dashboard/activity-events" className="quick-card">🎯 Activity Events</a>
          <a href="/dashboard/core-team" className="quick-card">👥 Core Team</a>
        </div>
      </div>
    </div>
  );
}
