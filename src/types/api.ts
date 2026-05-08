export type EventStatus = 'completed' | 'upcoming' | string;

export interface Event {
  id: string | number;
  name: string;
  shortName: string;
  date: string;
  description: string;
  status: EventStatus;
  icon: string;
  tags: string[];
}

export interface ActivityEvent {
  id?: string | number;
  title?: string;
  name?: string;
  subtitle?: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  status?: EventStatus | string;
  type?: string;
  theme?: string;
  participants?: string | number;
  speakers?: Person[];
  organizers?: Person[];
  guests?: Person[];
  topics?: unknown[];
  agenda?: unknown[];
  acknowledgements?: unknown[];
  media?: MediaLink[];
  highlights?: string[];
  stats?: unknown[];
  [key: string]: unknown;
}

export interface Person {
  name: string;
  role?: string;
  title?: string;
}

export interface MediaLink {
  href: string;
  icon?: string;
  label: string;
}

export interface Stat {
  label: string;
  value: string | number;
}

export interface CoreTeamMember {
  id: number;
  name: string;
  role: string;
  year: string;
  branch: string;
  section: string;
  photo: string;
  linkedin: string | null;
  email: string | null;
  whatsapp: string | null;
  instagram: string | null;
  achievements?: string[];
  testimonials?: Testimonial[];
}

export interface Testimonial {
  text: string;
  author: string;
}

export interface LoginResponse {
  token: string;
}

export interface ErrorResponse {
  error?: string;
  message?: string;
}

export interface EventsResponse {
  events: Event[];
}

export interface ActivityEventsResponse {
  events: ActivityEvent[];
}
