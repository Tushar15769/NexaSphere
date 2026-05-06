const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const api = {
  async getEvents() {
    const response = await fetch(`${API_BASE}/api/content/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  async getActivityEvents(activityKey) {
    const response = await fetch(`${API_BASE}/api/content/activity-events/${activityKey}`);
    if (!response.ok) throw new Error('Failed to fetch activity events');
    return response.json();
  },

  async getCoreTeam() {
    const response = await fetch(`${API_BASE}/api/content/core-team`);
    if (!response.ok) throw new Error('Failed to fetch core team');
    return response.json();
  },
};
