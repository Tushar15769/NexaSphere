import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/dashboard', label: '🏠 Dashboard' },
  { to: '/dashboard/events', label: '📅 Events' },
  { to: '/dashboard/activity-events', label: '🎯 Activity Events' },
  { to: '/dashboard/core-team', label: '👥 Core Team' },
];

export function Sidebar() {
  const { email, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot" />
        <span>NexaSphere Admin</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="sidebar-email">{email}</span>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
