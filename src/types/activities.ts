import type { ActivityEvent, Event } from './api';

export interface ActivitySummary {
  id: number;
  icon: string;
  title: ActivityKey | string;
  description: string;
  comingSoon?: boolean;
}

export interface ActivityPage {
  key?: ActivityKey;
  title: ActivityKey | string;
  tagline?: string;
  icon: string;
  color: string;
  shortDesc?: string;
  longDesc?: string;
  description?: string;
  hero?: string;
  stats?: ActivityStat[];
  outcomes?: string[];
  features?: string[];
  upcomingEvents?: ActivityEvent[];
  conductedEvents?: ActivityEvent[];
  events?: Event[];
  [key: string]: unknown;
}

export interface ActivityStat {
  label: string;
  value: string | number;
  suffix?: string;
}

export type ActivityKey =
  | 'Hackathon'
  | 'Codathon'
  | 'Ideathon'
  | 'Promptathon'
  | 'Workshop'
  | 'Insight Session'
  | 'Open Source Day'
  | 'Tech Debate';

export type ActivityPages = Record<ActivityKey, ActivityPage>;
