/**
 * Shared Type Definitions for Admin Dashboard
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

export interface EventStats {
  totalRegistered: number;
  totalWaitlist: number;
  totalAttended: number;
  capacityUtilization: number;
  attendanceRate: number;
}

export interface CoreTeamEvent {
  id: string;
  eventType: 'MEMBER_ADDED' | 'MEMBER_UPDATED' | 'MEMBER_REMOVED';
  memberId: string;
  memberData?: Record<string, any>;
  timestamp: string;
}

export interface FormData {
  [key: string]: string | number | boolean | undefined;
}

export interface DashboardState {
  isLoggedIn: boolean;
  adminEmail?: string;
}
