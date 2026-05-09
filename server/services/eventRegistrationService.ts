import {
  getEventRegistrations,
  getEventRegistrationsByStatus,
  getUserEventRegistration,
  getUserRegistrations,
  createEventRegistration,
  updateEventRegistrationStatus,
  deleteEventRegistration,
  getEventRegistrationStats,
} from '../repositories/eventRegistrationRepository.js';
import { supabaseRequest } from '../utils/supabase.js';

// Get event by ID
async function getEventById(eventId) {
  try {
    const rows = await supabaseRequest(`events?id=eq.${encodeURIComponent(eventId)}&select=*`);
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

// Register user for event
export async function registerUserForEvent(eventId, userId) {
  // Check if event exists
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // Check if already registered
  const existing = await getUserEventRegistration(eventId, userId);
  if (existing) {
    if (existing.status === 'registered' || existing.status === 'attended') {
      throw new Error('Already registered for this event');
    }
    if (existing.status === 'waitlist') {
      throw new Error('Already on waitlist for this event');
    }
  }

  // Check capacity
  let status = 'registered';
  if (event.capacity && event.capacity > 0) {
    const registeredList = await getEventRegistrationsByStatus(eventId, 'registered');
    if (registeredList.length >= event.capacity) {
      // At capacity, add to waitlist
      status = 'waitlist';
    }
  }

  // Create registration
  const registration = await createEventRegistration(eventId, userId, status);

  return {
    registration,
    status,
    message: status === 'waitlist' 
      ? 'Added to waitlist. We will notify you if a spot becomes available.'
      : 'Successfully registered for event.',
  };
}

// Cancel registration
export async function cancelEventRegistration(eventId, userId) {
  // Check if registered
  const existing = await getUserEventRegistration(eventId, userId);
  if (!existing) {
    throw new Error('Not registered for this event');
  }

  if (existing.status === 'attended') {
    throw new Error('Cannot cancel after attending the event');
  }

  const wasWaitlist = existing.status === 'waitlist';

  // Delete registration
  await deleteEventRegistration(eventId, userId);

  // If was on waitlist, move next waitlisted person to registered
  if (wasWaitlist) {
    const event = await getEventById(eventId);
    const registeredList = await getEventRegistrationsByStatus(eventId, 'registered');
    
    if (event.capacity && registeredList.length < event.capacity) {
      const waitlist = await getEventRegistrationsByStatus(eventId, 'waitlist');
      if (waitlist.length > 0) {
        // Move first person from waitlist to registered
        const nextPerson = waitlist[0];
        await updateEventRegistrationStatus(eventId, nextPerson.user_id, 'registered');
      }
    }
  }

  return { ok: true, message: 'Registration cancelled.' };
}

// Mark user as attended
export async function markEventAttendance(eventId, userId) {
  // Check if registered
  const existing = await getUserEventRegistration(eventId, userId);
  if (!existing) {
    throw new Error('User not registered for this event');
  }

  if (existing.status === 'cancelled') {
    throw new Error('Cannot mark cancelled registration as attended');
  }

  // Update status to attended
  const updated = await updateEventRegistrationStatus(
    eventId,
    userId,
    'attended',
    new Date().toISOString()
  );

  return { ok: true, registration: updated };
}

// Get event registrations with detailed user info
export async function getEventRegistrationsDetailed(eventId) {
  const registrations = await getEventRegistrations(eventId);
  
  // Fetch user details for each registration
  const detailed = await Promise.all(
    registrations.map(async (reg) => {
      try {
        const users = await supabaseRequest(
          `users?id=eq.${encodeURIComponent(reg.user_id)}&select=id,email,full_name`
        );
        return {
          ...reg,
          user: users.length > 0 ? users[0] : null,
        };
      } catch {
        return { ...reg, user: null };
      }
    })
  );

  return detailed;
}

// Get registration statistics for event
export async function getEventStats(eventId) {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  const stats = await getEventRegistrationStats(eventId);
  
  return {
    eventName: event.name,
    eventDate: event.date_text,
    capacity: event.capacity || null,
    total: stats.registered + stats.attended + stats.waitlist,
    registered: stats.registered,
    attended: stats.attended,
    waitlist: stats.waitlist,
    capacityRemaining: event.capacity ? Math.max(0, event.capacity - stats.registered) : null,
  };
}

// Export registrations as CSV
export async function exportRegistrationsAsCSV(eventId) {
  const registrations = await getEventRegistrationsDetailed(eventId);
  
  if (registrations.length === 0) {
    return '';
  }

  // CSV headers
  const headers = ['User Name', 'Email', 'Status', 'Registered At', 'Attended At'];
  
  // CSV rows
  const rows = registrations.map((reg) => [
    reg.user?.full_name || 'Unknown',
    reg.user?.email || 'Unknown',
    reg.status,
    new Date(reg.registered_at).toLocaleString(),
    reg.attended_at ? new Date(reg.attended_at).toLocaleString() : '',
  ]);

  // Combine headers and rows
  const csvLines = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ];

  return csvLines.join('\n');
}

// Get user's events
export async function getUserEvents(userId) {
  const registrations = await getUserRegistrations(userId);
  
  // Fetch event details for each registration
  const events = await Promise.all(
    registrations.map(async (reg) => {
      try {
        const eventData = await getEventById(reg.event_id);
        return {
          ...reg,
          event: eventData,
        };
      } catch {
        return { ...reg, event: null };
      }
    })
  );

  return events.filter((e) => e.event !== null);
}
