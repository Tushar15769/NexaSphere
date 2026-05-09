/**
 * Shared Type Definitions for NexaSphere Backend API
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

export interface CoreTeamEvent {
  id: string;
  eventType: 'MEMBER_ADDED' | 'MEMBER_UPDATED' | 'MEMBER_REMOVED';
  memberId: string;
  memberData?: Record<string, any>;
  timestamp: string;
}

export interface FormSubmission {
  id: string;
  email: string;
  fullName: string;
  year: string;
  branch: string;
  section: string;
  whatsapp: string;
  linkedin?: string;
  instagram?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  motivationMessage: string;
  submittedAt: string;
}

export interface EmailVerificationToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  fullName: string;
  iat: number;
  exp: number;
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
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventStats {
  totalRegistered: number;
  totalWaitlist: number;
  totalAttended: number;
  capacityUtilization: number;
  attendanceRate: number;
}

export interface RequestWithUser extends Express.Request {
  user?: User;
}

export interface AdminSession {
  email: string;
  loggedInAt: string;
}
