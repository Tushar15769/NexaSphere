import { useState } from 'react';
import { api } from '../services/api';

import { ROLE_OPTIONS as ROLES, DOMAIN_OPTIONS } from '../../../src/shared/roles';
const empty = { name: '', role: 'Core Team Member', domain: '', branch: '', year: '', email: '', linkedin: '', photo: '' };

export function CoreTeamForm({ onClose }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.coreTeam.add(form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Add Core Team Member</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Domain (Optional)</label>
            <select value={form.domain} onChange={e => set('domain', e.target.value)}>
              <option value="">None / General</option>
              {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Branch</label>
            <input value={form.branch} onChange={e => set('branch', e.target.value)} placeholder="e.g. CSE" />
          </div>
          <div className="form-row">
            <label>Year</label>
            <input value={form.year} onChange={e => set('year', e.target.value)} placeholder="e.g. 2nd Year" />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input value={form.email} onChange={e => set('email', e.target.value)} type="email" />
          </div>
          <div className="form-row">
            <label>LinkedIn URL</label>
            <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} type="url" />
          </div>
          <div className="form-row">
            <label>Photo URL</label>
            <input value={form.photo} onChange={e => set('photo', e.target.value)} type="url" />
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
