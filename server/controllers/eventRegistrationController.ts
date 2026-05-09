import {
  registerUserForEvent,
  cancelEventRegistration,
  markEventAttendance,
  getEventRegistrationsDetailed,
  getEventStats,
  exportRegistrationsAsCSV,
  getUserEvents,
} from '../services/eventRegistrationService.js';
import { verifyAccessToken } from './authController.js';

function toSafeString(value, max = 4000) {
  return String(value ?? '').trim().slice(0, max);
}

// Register user for event (requires authentication)
export async function registerForEvent(req, res) {
  try {
    const eventId = toSafeString(req.params.eventId, 200);
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Verify token and get user
    let user;
    try {
      user = await verifyAccessToken(token);
    } catch (e) {
      return res.status(401).json({ error: e.message || 'Invalid token' });
    }

    // Register user
    const result = await registerUserForEvent(eventId, user.id);

    return res.status(201).json({
      ok: true,
      message: result.message,
      status: result.status,
      registration: result.registration,
    });
  } catch (e) {
    if (e.message.includes('already')) {
      return res.status(409).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message || 'Registration failed' });
  }
}

// Cancel registration (requires authentication)
export async function cancelRegistration(req, res) {
  try {
    const eventId = toSafeString(req.params.eventId, 200);
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Verify token and get user
    let user;
    try {
      user = await verifyAccessToken(token);
    } catch (e) {
      return res.status(401).json({ error: e.message || 'Invalid token' });
    }

    // Cancel registration
    const result = await cancelEventRegistration(eventId, user.id);

    return res.json(result);
  } catch (e) {
    if (e.message.includes('not registered') || e.message.includes('not found')) {
      return res.status(404).json({ error: e.message });
    }
    if (e.message.includes('Cannot')) {
      return res.status(400).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message || 'Cancellation failed' });
  }
}

// Get event registrations (admin only)
export async function getEventRegistrationsAdmin(req, res) {
  try {
    const eventId = toSafeString(req.params.eventId, 200);

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Check admin authentication
    if (!req.adminSession) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const registrations = await getEventRegistrationsDetailed(eventId);

    return res.json({
      ok: true,
      eventId,
      count: registrations.length,
      registrations,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Failed to fetch registrations' });
  }
}

// Mark user as attended (admin only)
export async function markAttended(req, res) {
  try {
    const eventId = toSafeString(req.params.eventId, 200);
    const userId = toSafeString(req.params.userId, 200);

    if (!eventId || !userId) {
      return res.status(400).json({ error: 'Event ID and User ID are required' });
    }

    // Check admin authentication
    if (!req.adminSession) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const result = await markEventAttendance(eventId, userId);

    return res.json(result);
  } catch (e) {
    if (e.message.includes('not registered')) {
      return res.status(404).json({ error: e.message });
    }
    return res.status(400).json({ error: e.message || 'Failed to mark attendance' });
  }
}

// Get event registration statistics (admin only)
export async function getEventRegistrationStats(req, res) {
  try {
    const eventId = toSafeString(req.params.eventId, 200);

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Check admin authentication
    if (!req.adminSession) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const stats = await getEventStats(eventId);

    return res.json({ ok: true, stats });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Failed to fetch stats' });
  }
}

// Export registrations as CSV (admin only)
export async function exportRegistrations(req, res) {
  try {
    const eventId = toSafeString(req.params.eventId, 200);

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Check admin authentication
    if (!req.adminSession) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const csv = await exportRegistrationsAsCSV(eventId);

    if (!csv) {
      return res.status(404).json({ error: 'No registrations found' });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="event-${eventId}-registrations.csv"`);
    return res.send(csv);
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Failed to export registrations' });
  }
}

// Get user's event registrations (requires authentication)
export async function getUserEventsRegistrations(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token and get user
    let user;
    try {
      user = await verifyAccessToken(token);
    } catch (e) {
      return res.status(401).json({ error: e.message || 'Invalid token' });
    }

    const events = await getUserEvents(user.id);

    // Categorize events
    const now = new Date();
    const upcoming = [];
    const past = [];

    events.forEach((registration) => {
      const eventDate = new Date(registration.event.date_text);
      const eventObj = {
        eventId: registration.event.id,
        eventName: registration.event.name,
        eventDate: registration.event.date_text,
        status: registration.status,
        registeredAt: registration.registered_at,
      };

      if (eventDate > now && registration.status !== 'cancelled') {
        upcoming.push(eventObj);
      } else {
        past.push(eventObj);
      }
    });

    return res.json({
      ok: true,
      upcoming: upcoming.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)),
      past: past.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)),
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Failed to fetch user events' });
  }
}
