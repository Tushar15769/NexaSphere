/**
 * Shared Type Definitions for NexaSphere Frontend
 */

export interface Event {
  id: string;
  name: string;
  shortName: string;
  date: string;
  description: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  icon: string;
  tags: string[];
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  status: 'upcoming' | 'completed';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  verifiedEmail: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CoreTeamMember {
  id: string;
  name: string;
  role: string;
  year: string;
  branch: string;
  section: string;
  email: string;
  whatsapp: string;
  linkedin?: string;
  instagram?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  userId: string;
  eventId: string;
  status: 'registered' | 'waitlist' | 'cancelled' | 'attended';
  registeredAt: string;
  attendedAt?: string;
  cancelledAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface EventRegistrationRequest {
  eventId: string;
  userId: string;
}

export interface UserEventsResponse {
  registered: Event[];
  waitlist: Event[];
  attended: Event[];
}
