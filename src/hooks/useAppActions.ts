import { useCallback } from 'react';
import { NAV_HEIGHTS, SCROLL_TIMEOUT } from '../data/config';

export function useAppActions(nav, setPage, setActiveTab, mobile) {
  const onNavigate = useCallback((type, title) => {
    if (type === 'activity') nav(() => setPage({ type: 'activity', activityKey: title }));
  }, [nav, setPage]);

  const onEvent = useCallback((ev) => {
    nav(() => setPage(p => ({ ...p, type: 'event', event: ev })));
  }, [nav, setPage]);

  const onKSSClick = useCallback((ev) => {
    nav(() => setPage({ type: 'event', activityKey: 'Insight Session', event: ev }));
  }, [nav, setPage]);

  const onBackActivity = useCallback(() => {
    nav(() => setPage(p => ({ type: 'activity', activityKey: p.activityKey })));
  }, [nav, setPage]);

  const onBackMain = useCallback(() => {
    nav(() => {
      setPage(null);
      setTimeout(() => {
        const element = document.getElementById('section-activities');
        if (!element) return;
        const navHeight = mobile ? NAV_HEIGHTS.MOBILE : NAV_HEIGHTS.DESKTOP;
        window.scrollTo({ top: element.offsetTop - navHeight, behavior: 'smooth' });
      }, SCROLL_TIMEOUT);
    });
  }, [nav, setPage, mobile]);

  const onBackHome = useCallback(() => {
    nav(() => {
      setPage(null);
      setActiveTab('Home');
      window.scrollTo({ top: 0 });
    });
  }, [nav, setPage, setActiveTab]);

  const openApply = useCallback(() => {
    nav(() => setPage({ type: 'apply' }));
  }, [nav, setPage]);

  const openJoin = useCallback(() => {
    nav(() => setPage({ type: 'join' }));
  }, [nav, setPage]);

  return {
    onNavigate,
    onEvent,
    onKSSClick,
    onBackActivity,
    onBackMain,
    onBackHome,
    openApply,
    openJoin
  };
}
