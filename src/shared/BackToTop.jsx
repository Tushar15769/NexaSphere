import { useEffect, useCallback, useRef } from 'react';

export default function BackToTop() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const updateVisibility = () => {
      const isVisible = window.scrollY > 360;
      if (buttonRef.current) {
        buttonRef.current.classList.toggle('visible', isVisible);
      }
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <button
      ref={buttonRef}
      id="back-to-top"
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        width: '48px',
        height: '48px',
        zIndex: 9000,
      }}
    >
      ↑
    </button>
  );
}
