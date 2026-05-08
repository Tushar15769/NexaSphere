import { useMemo, useState, useEffect } from 'react';
import { Calendar, Users, Rocket, LogOut, RefreshCw, Plus, Edit2, Trash2, Mail, Lock } from 'lucide-react';

const API_BASE = (import.meta.env?.VITE_API_BASE || '').replace(/\/+$/, '');
const api = (path) => API_BASE ? `${API_BASE}${path}` : path;

const initialEventForm = { id: '', name: '', shortName: '', date: '', description: '', status: 'upcoming', icon: 'Calendar', tags: '' };
const initialActivityEventForm = { activityTitle: '', eventName: '', eventDate: '', eventTagline: '', eventDescription: '' };
const initialTeamForm = { id: '', name: '', role: 'Core Team Member', branch: '', section: '', photo: '', linkedin: '', github: '', bio: '' };

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('ns_admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'activity-events', 'team'
  
  const [data, setData] = useState([]); // List for current tab
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [activityEventForm, setActivityEventForm] = useState(initialActivityEventForm);
  const [teamForm, setTeamForm] = useState(initialTeamForm);
  const [editingId, setEditingId] = useState('');

  const authHeaders = useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  useEffect(() => {
    if (token) loadTabData();
  }, [activeTab, token]);

  async function login() {
    setErr(''); setMsg(''); setBusy(true);
    try {
      const res = await fetch(api('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      setToken(data.token);
      localStorage.setItem('ns_admin_token', data.token);
      setMsg('Logged in successfully.');
    } catch (e) {
      setErr(e?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function loadTabData() {
    setErr('');
    let endpoint = '';
    if (activeTab === 'events') endpoint = '/api/admin/events';
    else if (activeTab === 'activity-events') endpoint = '/api/admin/activity-events';
    else if (activeTab === 'team') endpoint = '/api/admin/core-team';

    try {
      const res = await fetch(api(endpoint), { headers: { Authorization: `Bearer ${token}` } });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error || 'Failed to load data');
      
      if (activeTab === 'events') setData(d.events || []);
      else if (activeTab === 'activity-events') setData(d.activityEvents || []);
      else if (activeTab === 'team') setData(d.members || []);
    } catch (e) {
      setData([]);
      setErr(e.message);
    }
  }

  async function handleSave() {
    setBusy(true); setErr(''); setMsg('');
    try {
      let endpoint = '';
      let payload = {};
      let method = editingId ? 'PUT' : 'POST';

      if (activeTab === 'events') {
        endpoint = editingId ? `/api/admin/events/${editingId}` : '/api/admin/events';
        payload = { ...eventForm, tags: eventForm.tags.split(',').map(t => t.trim()).filter(Boolean) };
      } else if (activeTab === 'activity-events') {
        endpoint = editingId ? `/api/admin/activity-events/${editingId}` : '/api/admin/activity-events';
        payload = { ...activityEventForm };
      } else if (activeTab === 'team') {
        endpoint = editingId ? `/api/admin/core-team/${editingId}` : '/api/admin/core-team';
        payload = { ...teamForm };
      }

      const res = await fetch(api(endpoint), {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error || 'Save failed');
      
      setMsg('Changes saved successfully.');
      resetForms();
      await loadTabData();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(id) {
    if (!window.confirm('Delete this item?')) return;
    setBusy(true); setErr(''); setMsg('');
    try {
      let endpoint = '';
      if (activeTab === 'events') endpoint = `/api/admin/events/${id}`;
      else if (activeTab === 'activity-events') endpoint = `/api/admin/activity-events/${id}`;
      else if (activeTab === 'team') endpoint = `/api/admin/core-team/${id}`;

      const res = await fetch(api(endpoint), { method: 'DELETE', headers: authHeaders });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d?.error || 'Delete failed');
      }
      setMsg('Item deleted.');
      await loadTabData();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  function resetForms() {
    setEditingId('');
    setEventForm(initialEventForm);
    setActivityEventForm(initialActivityEventForm);
    setTeamForm(initialTeamForm);
  }

  function startEdit(item) {
    setEditingId(item.id || item.activityTitle); 
    if (activeTab === 'events') {
      setEventForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : '' });
    } else if (activeTab === 'activity-events') {
      setActivityEventForm({ ...item });
    } else if (activeTab === 'team') {
      setTeamForm({ ...item });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function logout() {
    localStorage.removeItem('ns_admin_token');
    setToken('');
    setData([]);
    setMsg('Logged out.');
  }

  return (
    <div className="container" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <h1 className="section-title">Admin Dashboard</h1>
      <p className="section-subtitle" style={{ marginBottom: 32 }}>
        Manage platform content dynamically across different modules.
      </p>

      {!token ? (
        <div style={{ maxWidth: 400, margin: '0 auto', background: 'var(--card)', padding: '32px', borderRadius: 'var(--r2)', border: '1px solid var(--bdr)' }}>
          <div style={{ display: 'grid', gap: 16 }}>
             <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: 14, opacity: 0.5 }} />
                <input placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="admin-input" style={{ paddingLeft: 40 }} />
             </div>
             <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: 14, opacity: 0.5 }} />
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="admin-input" style={{ paddingLeft: 40 }} />
             </div>
             <button className="btn btn-primary" onClick={login} disabled={busy} style={{ height: 48 }}>
               {busy ? 'Verifying...' : 'Login to Dashboard'}
             </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            <button className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setActiveTab('events'); resetForms(); }}>
              <Calendar size={16} style={{ marginRight: 8 }} /> Events
            </button>
            <button className={`btn ${activeTab === 'activity-events' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setActiveTab('activity-events'); resetForms(); }}>
              <Rocket size={16} style={{ marginRight: 8 }} /> Activity Events
            </button>
            <button className={`btn ${activeTab === 'team' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setActiveTab('team'); resetForms(); }}>
              <Users size={16} style={{ marginRight: 8 }} /> Core Team
            </button>
            <button className="btn btn-outline" onClick={logout} style={{ marginLeft: 'auto' }}>
              <LogOut size={16} style={{ marginRight: 8 }} /> Logout
            </button>
          </div>

          <div style={{ maxWidth: 800, margin: '0 auto 40px', background: 'var(--card)', padding: '24px', borderRadius: 'var(--r2)', border: '1px solid var(--bdr)' }}>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', marginBottom: 20, color: 'var(--c1)' }}>
              {editingId ? 'Update Entry' : 'Create New Entry'}
            </h3>
            
            <div style={{ display: 'grid', gap: 12 }}>
              {activeTab === 'events' && (
                <>
                  <input className="admin-input" placeholder="Event Name" value={eventForm.name} onChange={e => setEventForm(f => ({ ...f, name: e.target.value }))} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <input className="admin-input" placeholder="Short Name" value={eventForm.shortName} onChange={e => setEventForm(f => ({ ...f, shortName: e.target.value }))} />
                    <input className="admin-input" placeholder="Date (e.g. May 12, 2026)" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <textarea className="admin-input" placeholder="Description" rows={3} value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <select className="admin-input" value={eventForm.status} onChange={e => setEventForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                    <input className="admin-input" placeholder="Icon Name" value={eventForm.icon} onChange={e => setEventForm(f => ({ ...f, icon: e.target.value }))} />
                    <input className="admin-input" placeholder="Tags (comma separated)" value={eventForm.tags} onChange={e => setEventForm(f => ({ ...f, tags: e.target.value }))} />
                  </div>
                </>
              )}

              {activeTab === 'activity-events' && (
                <>
                  <input className="admin-input" placeholder="Activity Title (matches data exactly)" value={activityEventForm.activityTitle} onChange={e => setActivityEventForm(f => ({ ...f, activityTitle: e.target.value }))} />
                  <input className="admin-input" placeholder="Event Name" value={activityEventForm.eventName} onChange={e => setActivityEventForm(f => ({ ...f, eventName: e.target.value }))} />
                  <input className="admin-input" placeholder="Event Date" value={activityEventForm.eventDate} onChange={e => setActivityEventForm(f => ({ ...f, eventDate: e.target.value }))} />
                  <input className="admin-input" placeholder="Tagline" value={activityEventForm.eventTagline} onChange={e => setActivityEventForm(f => ({ ...f, eventTagline: e.target.value }))} />
                  <textarea className="admin-input" placeholder="Event Description" rows={3} value={activityEventForm.eventDescription} onChange={e => setActivityEventForm(f => ({ ...f, eventDescription: e.target.value }))} />
                </>
              )}

              {activeTab === 'team' && (
                <>
                  <input className="admin-input" placeholder="Full Name" value={teamForm.name} onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <select className="admin-input" value={teamForm.role} onChange={e => setTeamForm(f => ({ ...f, role: e.target.value }))}>
                      <option value="Organiser">Organiser</option>
                      <option value="Co-organiser">Co-organiser</option>
                      <option value="Core Team Member">Core Team Member</option>
                    </select>
                    <input className="admin-input" placeholder="Branch" value={teamForm.branch} onChange={e => setTeamForm(f => ({ ...f, branch: e.target.value }))} />
                    <input className="admin-input" placeholder="Section" value={teamForm.section} onChange={e => setTeamForm(f => ({ ...f, section: e.target.value }))} />
                  </div>
                  <input className="admin-input" placeholder="Photo URL" value={teamForm.photo} onChange={e => setTeamForm(f => ({ ...f, photo: e.target.value }))} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <input className="admin-input" placeholder="LinkedIn URL" value={teamForm.linkedin} onChange={e => setTeamForm(f => ({ ...f, linkedin: e.target.value }))} />
                    <input className="admin-input" placeholder="GitHub URL" value={teamForm.github} onChange={e => setTeamForm(f => ({ ...f, github: e.target.value }))} />
                  </div>
                  <textarea className="admin-input" placeholder="Short Bio" rows={2} value={teamForm.bio} onChange={e => setTeamForm(f => ({ ...f, bio: e.target.value }))} />
                </>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={busy} style={{ flex: 1 }}>
                  {busy ? 'Saving...' : editingId ? 'Update Entry' : 'Add to Platform'}
                </button>
                {editingId && (
                  <button className="btn btn-outline" onClick={resetForms}>Cancel</button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 16, maxWidth: 900, margin: '0 auto' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', margin: 0 }}>Existing {activeTab.replace('-', ' ')}</h2>
                <button className="btn btn-sm btn-outline" onClick={loadTabData} disabled={busy}><RefreshCw size={14} style={{ marginRight: 6 }} /> Sync</button>
             </div>
            {data.map(item => (
              <div key={item.id || item.activityTitle || item.name} style={{ border: '1px solid var(--bdr)', borderRadius: 'var(--r2)', padding: '20px', background: 'var(--card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--t1)' }}>{item.name || item.eventName || item.activityTitle}</strong>
                    {item.status && <span className={`timeline-badge ${item.status}`} style={{ fontSize: '.65rem' }}>{item.status}</span>}
                  </div>
                  <p style={{ fontSize: '.85rem', color: 'var(--t2)', margin: 0, opacity: 0.8 }}>{item.description || item.eventDescription || item.bio || 'No description provided.'}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(item)}><Edit2 size={14} /></button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleRemove(item.id || item.activityTitle || item.name)} style={{ color: '#ff5f7a', borderColor: 'rgba(255,95,122,0.2)' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--bdr)', borderRadius: 'var(--r2)', opacity: 0.5 }}>
                 No items found in this category.
              </div>
            )}
          </div>
        </>
      )}

      {err ? <p style={{ color: '#ff5f7a', textAlign: 'center', marginTop: 24, fontWeight: 600 }}>{err}</p> : null}
      {msg ? <p style={{ color: '#22c55e', textAlign: 'center', marginTop: 24, fontWeight: 600 }}>{msg}</p> : null}

      <style>{`
        .admin-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid var(--bdr);
          background: var(--card2);
          color: var(--t1);
          font-family: Rajdhani, sans-serif;
          font-size: .95rem;
          transition: all 0.2s;
        }
        .admin-input:focus {
          border-color: var(--c1);
          outline: none;
          box-shadow: 0 0 0 2px rgba(204,17,17,0.1);
        }
      `}</style>
    </div>
  );
}
