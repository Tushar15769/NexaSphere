import { supabaseRequest } from '../utils/supabase.js';

// Get all registrations for an event
export async function getEventRegistrations(eventId) {
  try {
    const rows = await supabaseRequest(
      `event_registrations?event_id=eq.${encodeURIComponent(eventId)}&select=*&order=registered_at.desc`
    );
    return rows;
  } catch {
    return [];
  }
}

// Get registrations by status
export async function getEventRegistrationsByStatus(eventId, status) {
  try {
    const rows = await supabaseRequest(
      `event_registrations?event_id=eq.${encodeURIComponent(eventId)}&status=eq.${encodeURIComponent(status)}&select=*`
    );
    return rows;
  } catch {
    return [];
  }
}

// Check if user already registered for event
export async function getUserEventRegistration(eventId, userId) {
  try {
    const rows = await supabaseRequest(
      `event_registrations?event_id=eq.${encodeURIComponent(eventId)}&user_id=eq.${encodeURIComponent(userId)}&select=*`
    );
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

// Get all registrations for a user
export async function getUserRegistrations(userId) {
  try {
    const rows = await supabaseRequest(
      `event_registrations?user_id=eq.${encodeURIComponent(userId)}&select=*&order=registered_at.desc`
    );
    return rows;
  } catch {
    return [];
  }
}

// Create registration
export async function createEventRegistration(eventId, userId, status = 'registered') {
  const [record] = await supabaseRequest('event_registrations', {
    method: 'POST',
    body: [{
      event_id: eventId,
      user_id: userId,
      status,
      registered_at: new Date().toISOString(),
    }],
  });
  return record;
}

// Update registration status
export async function updateEventRegistrationStatus(eventId, userId, status, attendedAt = null) {
  const [record] = await supabaseRequest(
    `event_registrations?event_id=eq.${encodeURIComponent(eventId)}&user_id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      body: {
        status,
        attended_at: attendedAt,
        updated_at: new Date().toISOString(),
      },
    }
  );
  return record || null;
}

// Delete registration
export async function deleteEventRegistration(eventId, userId) {
  const rows = await supabaseRequest(
    `event_registrations?event_id=eq.${encodeURIComponent(eventId)}&user_id=eq.${encodeURIComponent(userId)}`,
    { method: 'DELETE' }
  );
  return Array.isArray(rows) && rows.length > 0;
}

// Get registration count by status
export async function getEventRegistrationStats(eventId) {
  try {
    const registered = await supabaseRequest(
      `event_registrations?event_id=eq.${encodeURIComponent(eventId)}&status=eq.registered&select=count`
    );
    const attended = await supabaseRequest(
      `event_registrations?event_id=eq.${encodeURIComponent(eventId)}&status=eq.attended&select=count`
    );
    const waitlist = await supabaseRequest(
      `event_registrations?event_id=eq.${encodeURIComponent(eventId)}&status=eq.waitlist&select=count`
    );

    return {
      registered: registered.length || 0,
      attended: attended.length || 0,
      waitlist: waitlist.length || 0,
    };
  } catch {
    return { registered: 0, attended: 0, waitlist: 0 };
  }
}
