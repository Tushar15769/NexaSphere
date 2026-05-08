import type { CSSProperties, ReactNode } from 'react';
import type { ActivityKey, ActivityPage, ActivitySummary } from './activities';
import type { ActivityEvent, CoreTeamMember, Event } from './api';

export interface BackProps {
  onBack: () => void;
}

export interface ThemedProps {
  theme?: 'dark' | 'light' | string;
}

export interface ChildrenProps {
  children: ReactNode;
}

export interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggleTheme: () => void;
}

export interface HeroSectionProps extends ThemedProps {
  onTabChange: (tab: string) => void;
  onApply: () => void;
  onJoin: () => void;
}

export interface ActivitiesSectionProps {
  onNavigate: (type: 'activity', title: ActivityKey) => void;
}

export interface ActivitiesPageProps extends BackProps, ActivitiesSectionProps {}

export interface ActivityDetailPageProps extends BackProps {
  activity: ActivityPage;
  onSelectEvent: (event: ActivityEvent) => void;
}

export interface EventsProps extends BackProps {
  onEventClick: (event: Event) => void;
  events?: Event[];
}

export interface EventDetailPageProps extends BackProps {
  event: Event | ActivityEvent;
  activityColor: string;
  activityIcon: string;
}

export interface TeamPageProps extends BackProps {
  onApply: () => void;
}

export interface TeamSectionProps {
  onApply: () => void;
}

export interface TeamMemberCardProps {
  member: CoreTeamMember;
  onClick: (member: CoreTeamMember) => void;
  extraClass?: string;
  style?: CSSProperties;
}

export interface TeamMemberModalProps {
  member: CoreTeamMember | null;
  onClose: () => void;
}

export interface ActivityCardProps {
  a: ActivitySummary;
  idx: number;
}
