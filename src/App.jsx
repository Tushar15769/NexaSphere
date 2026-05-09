import { useState, useEffect, useMemo } from 'react';
import './styles/themes.css';
import './styles/globals.css';
import './styles/animations.css';
import './styles/chatbot.css';
import './styles/components.css';
import './styles/aurora.css';
import './styles/motion.css';

import ParticleBackground from './shared/ParticleBackground';
import GeometricGridBackground from './shared/GeometricGridBackground';
import ScrollProgress from './shared/ScrollProgress';
import Navbar from './shared/Navbar';
import HeroSection from './pages/home/HeroSection';
import ActivitiesSection from './pages/activities/ActivitiesSection';
import EventsSection from './pages/events/EventsSection';
import AboutSection from './pages/about/AboutSection';
import TeamSection from './pages/team/TeamSection';
import Footer from './shared/Footer';
import ActivityDetailPage from './pages/activities/ActivityDetailPage';
import EventDetailPage from './pages/events/EventDetailPage';
import CinematicOpening from './shared/CinematicOpening';
import Chatbot from './shared/Chatbot';

import {
  AmbientOrbs, SectionDivider,
  useNsReveal, useHeroParallax,
  useNavScrollTint, useGlobalMouseParallax, useMagneticCards,
} from './shared/MotionLayer';

import ActivitiesPage from './pages/activities/ActivitiesPage';
import EventsPage from './pages/events/EventsPage';
import AboutPage from './pages/about/AboutPage';
import TeamPage from './pages/team/TeamPage';
import ContactPage from './pages/contact/ContactPage';
import RecruitmentPage from './pages/recruitment/RecruitmentPage';
import MembershipPage from './pages/membership/MembershipPage';
import AdminPage from './pages/admin/AdminPage';

import { activityPages } from './data/activities/index';
import { events as fallbackEvents } from './data/eventsData';
import Cursor from './components/Cursor';
import Wipe from './components/Wipe';
import PageIn from './components/PageIn';

import { useInteractionEffects } from './hooks/useInteractionEffects';
import { useBackToTop, useActiveTabObserver } from './hooks/useScrollLogic';
import { useThemeManagement, useDynamicEvents } from './hooks/useDataHooks';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useAppActions } from './hooks/useAppActions';

import { NAV_HEIGHTS, SCROLL_TIMEOUT } from './data/config';

const NAV_TABS = ['Home', 'Activities', 'Events', 'About', 'Team', 'Contact'];

export default function App() {
  // Skip the intro for returning visitors; set the flag when it completes for the first time
  const [cinDone, setCinDone] = useState(() => !!localStorage.getItem('ns_intro_seen'));
  const [activeTab, setActiveTab] = useState('Home');
  const [page, setPage] = useState(null);
  const [mobile, setMobile] = useState(window.innerWidth <= 768);

  const { theme, toggleTheme } = useThemeManagement();
  const eventsData = useDynamicEvents(fallbackEvents);
  const { wipeOn, wipePh, handleTabChange, performTransition } = useAppNavigation(setPage, setActiveTab, mobile);
  const actions = useAppActions(performTransition, setPage, setActiveTab, mobile);

  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname === '/admin';

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useInteractionEffects(cinDone, page);
  useBackToTop();
  useActiveTabObserver(page, mobile, NAV_TABS, NAV_HEIGHTS, setActiveTab);
  
  useNsReveal([cinDone, page]);
  useHeroParallax();
  useNavScrollTint();
  useGlobalMouseParallax();
  useMagneticCards();

  const navHeight = mobile ? NAV_HEIGHTS.MOBILE : NAV_HEIGHTS.DESKTOP;
  const currentActivity = page?.activityKey ? activityPages[page.activityKey] : null;

  return (
    <>
      <Chatbot />
      {!cinDone && <CinematicOpening theme={theme} onDone={() => {
        localStorage.setItem('ns_intro_seen', '1');
        setCinDone(true);
      }} />}
      
      {cinDone && (
        <>
          <ScrollProgress />
          <Cursor />
          <Wipe on={wipeOn} ph={wipePh} />
          <AmbientOrbs theme={theme} />
          <GeometricGridBackground theme={theme} />
          <ParticleBackground theme={theme} />
          <Navbar activeTab={activeTab} onTabChange={handleTabChange} onToggleTheme={toggleTheme} theme={theme} onApply={actions.openApply} onJoin={actions.openJoin} />
        </>
      )}

      <main className="app-main" style={{ paddingTop: navHeight }}>
        {isAdminRoute ? (
          <PageIn k="pg-admin">
            <AdminPage />
          </PageIn>
        ) : (
          <>
            {page?.type === 'section' && (
              <SectionContent page={page} eventsData={eventsData} actions={actions} />
            )}

            {page?.type === 'activity' && currentActivity && (
              <PageIn k={`a-${page.activityKey}`}>
                <ActivityDetailPage 
                  activity={currentActivity} 
                  onBack={() => performTransition(() => setPage({ type: 'section', section: 'Activities' }))} 
                  onSelectEvent={actions.onEvent} 
                />
              </PageIn>
            )}

            {page?.type === 'event' && page.event && currentActivity && (
              <PageIn k={`e-${page.event?.id}`}>
                <EventContent page={page} currentActivity={currentActivity} onBack={actions.onBackActivity} />
              </PageIn>
            )}

            {page?.type === 'apply' && (
              <PageIn k="pg-apply">
                <RecruitmentPage onBack={actions.onBackHome} />
              </PageIn>
            )}

            {page?.type === 'join' && (
              <PageIn k="pg-join">
                <MembershipPage onBack={actions.onBackHome} />
              </PageIn>
            )}

            {/* Fallback: unknown page type — show 404 */}
            {page && !['section', 'activity', 'event', 'apply', 'join'].includes(page?.type) && (
              <PageIn k="pg-404">
                <NotFoundPage onGoHome={actions.onBackHome} />
              </PageIn>
            )}

            {!page && cinDone && (
              <PageIn k="main">
                <MainContent actions={actions} theme={theme} handleTabChange={handleTabChange} eventsData={eventsData} />
              </PageIn>
            )}
          </>
        )}
      </main>

      {cinDone && <button id="back-to-top" aria-label="Back to top">↑</button>}
    </>
  );
}

function SectionContent({ page, eventsData, actions }) {
  switch (page.section) {
    case 'Activities':
      return <PageIn k="pg-activities"><ActivitiesPage onNavigate={actions.onNavigate} onBack={actions.onBackHome} /></PageIn>;
    case 'Events':
      return <PageIn k="pg-events"><EventsPage onBack={actions.onBackHome} onEventClick={actions.onKSSClick} events={eventsData} /></PageIn>;
    case 'About':
      return <PageIn k="pg-about"><AboutPage onBack={actions.onBackHome} /></PageIn>;
    case 'Team':
      return <PageIn k="pg-team"><TeamPage onBack={actions.onBackHome} onApply={actions.openApply} /></PageIn>;
    case 'Contact':
      return <PageIn k="pg-contact"><ContactPage onBack={actions.onBackHome} /></PageIn>;
    default:
      return <PageIn k="pg-404"><NotFoundPage onGoHome={actions.onBackHome} /></PageIn>;
  }
}

function NotFoundPage({ onGoHome }) {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: 'clamp(5rem, 18vw, 10rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #CC1111 0%, #EE2222 50%, #FF4444 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
        marginBottom: '16px',
      }}>
        404
      </div>
      <h2 style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        fontWeight: 700,
        color: 'var(--t1)',
        marginBottom: '12px',
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: 'var(--t2)',
        fontSize: '1rem',
        maxWidth: '380px',
        lineHeight: 1.7,
        marginBottom: '32px',
      }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <button
        className="btn btn-primary"
        onClick={onGoHome}
        style={{ cursor: 'pointer' }}
      >
        ← Go Home
      </button>
    </div>
  );
}

function EventContent({ page, currentActivity, onBack }) {
  const displayEvent = useMemo(() => {
    const isKssEvent = page.event.id === 1 || page.event.id === 'kss-153' || String(page.event.shortName || '').toLowerCase().includes('kss');
    if (page.activityKey === 'Insight Session' && isKssEvent) {
      return currentActivity.conductedEvents?.find(e => e.id === 'kss-153') || page.event;
    }
    return page.event;
  }, [page.event, page.activityKey, currentActivity.conductedEvents]);

  return (
    <EventDetailPage 
      event={displayEvent} 
      activityColor={currentActivity.color} 
      activityIcon={currentActivity.icon} 
      onBack={onBack} 
    />
  );
}

function MainContent({ actions, theme, handleTabChange, eventsData }) {
  return (
    <>
      <HeroSection onTabChange={handleTabChange} onApply={actions.openApply} onJoin={actions.openJoin} theme={theme} />
      <SectionDivider />
      <ActivitiesSection onNavigate={actions.onNavigate} />
      <SectionDivider />
      <EventsSection onEventClick={actions.onKSSClick} events={eventsData} />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <TeamSection onApply={actions.openApply} />
      <Footer />
    </>
  );
}
