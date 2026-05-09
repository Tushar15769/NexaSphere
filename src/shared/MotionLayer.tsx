/**
 * MotionLayer.jsx — NexaSphere Motion Engine v3 (Full-Site)
 *
 * Non-destructive: adds NEW effects only. Never modifies existing
 * pop-in / pop-word / ag animation logic.
 */

import { type DependencyList, type ReactNode, useEffect } from 'react';
import type { CssVars } from '../types/dom';

const REVEAL_THRESHOLD = 0.05;
const REVEAL_DELAY = 80;
const REVEAL_MARGIN = '0px 0px -20px 0px';
const PARALLAX_FACTOR = 0.28;
const NAV_TINT_SCROLL_LIMIT = 180;
const MAGNETIC_MAX_DIST_FACTOR = 1.2;
const MAGNETIC_PERSPECTIVE = 900;
const MAGNETIC_MAX_ROTATION = 10;

const ORBS_DARK = [
  { w: 600, h: 600, top: '5%', left: '2%', bg: 'rgba(0,212,255,.18)', dur: '18s', delay: '0s', lo: '.12', hi: '.22' },
  { w: 500, h: 500, top: '50%', left: '72%', bg: 'rgba(123,111,255,.20)', dur: '24s', delay: '-8s', lo: '.14', hi: '.24' },
  { w: 420, h: 420, top: '28%', left: '52%', bg: 'rgba(189,92,255,.15)', dur: '20s', delay: '-5s', lo: '.10', hi: '.20' },
  { w: 340, h: 340, top: '78%', left: '18%', bg: 'rgba(0,255,157,.12)', dur: '28s', delay: '-13s', lo: '.08', hi: '.16' },
  { w: 280, h: 280, top: '12%', left: '65%', bg: 'rgba(255,45,120,.12)', dur: '22s', delay: '-3s', lo: '.08', hi: '.16' },
];

const ORBS_LIGHT = [
  { w: 600, h: 600, top: '5%', left: '2%', bg: 'rgba(194,119,10,.14)', dur: '18s', delay: '0s', lo: '.08', hi: '.16' },
  { w: 500, h: 500, top: '50%', left: '72%', bg: 'rgba(91,33,182,.12)', dur: '24s', delay: '-8s', lo: '.07', hi: '.14' },
  { w: 420, h: 420, top: '28%', left: '52%', bg: 'rgba(157,23,77,.10)', dur: '20s', delay: '-5s', lo: '.06', hi: '.12' },
  { w: 340, h: 340, top: '78%', left: '18%', bg: 'rgba(6,95,70,.08)', dur: '28s', delay: '-13s', lo: '.05', hi: '.10' },
  { w: 280, h: 280, top: '12%', left: '65%', bg: 'rgba(232,99,122,.09)', dur: '22s', delay: '-3s', lo: '.05', hi: '.10' },
];

export function AmbientOrbs({ theme = 'dark' }: { theme?: string }): ReactNode {
  const orbs = theme === 'light' ? ORBS_LIGHT : ORBS_DARK;
  return (
    <div aria-hidden="true" className="orbs-container">
      {orbs.map((o, i) => (
        <div key={i} className="ambient-orb" style={{
          width:o.w, height:o.h, top:o.top, left:o.left,
          background:o.bg,
          '--orb-dur':o.dur, '--orb-delay':o.delay,
          '--orb-lo':o.lo,  '--orb-hi':o.hi,
        } as CssVars}/>
      ))}
    </div>
  );
}

/* ── SECTION DIVIDER ─────────────────────────────────── */
export function SectionDivider(): ReactNode {
  return <div className="section-divider" aria-hidden="true"/>;
}

/* ── PAGE FLASH — visible radial glow on tab-switch ──── */
export function PageFlash(): ReactNode {
  return <div className="page-flash" aria-hidden="true"/>;
}

/* ────────────────────────────────────────────────────────
   PAGE BANNER ORBS — decorative floating orbs inside
   each tab page's hero banner (not ambient layer)
   ──────────────────────────────────────────────────────── */
export function BannerOrbs({ color = 'rgba(0,212,255,.06)' }: { color?: string }): ReactNode {
  const specs = [
    { w:260, h:260, t:'30%', l:'15%', dur:'14s', delay:'0s'  },
    { w:200, h:200, t:'20%', l:'70%', dur:'18s', delay:'-6s' },
    { w:140, h:140, t:'70%', l:'50%', dur:'12s', delay:'-3s' },
  ];
  return (
    <div className="banner-orbs" aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div className="ambient-orb" style={{ width: 400, height: 400, top: '-10%', left: '-5%', background: color, '--orb-dur': '15s', '--orb-lo': '.04', '--orb-hi': '.12' }} />
      <div className="ambient-orb" style={{ width: 300, height: 300, bottom: '-10%', right: '-5%', background: color, '--orb-dur': '18s', '--orb-delay': '-5s', '--orb-lo': '.04', '--orb-hi': '.12' }} />
    </div>
  );
}

/* ── useScrollProgress ───────────────────────────────── */
export function useScrollProgress(): void {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    const update = () => {
      const d = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = d > 0 ? (window.scrollY / d * 100).toFixed(2) + '%' : '0%';
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
}

/* ── useNsReveal — fires .ns-visible on scroll ────────── */
export function useNsReveal(deps: DependencyList = []): void {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const selector = '.ns-reveal, .ns-reveal-left, .ns-reveal-right, .ns-reveal-scale';
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        entries =>
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('ns-visible');
              observer.unobserve(entry.target);
            }
          }),
        {
          threshold: REVEAL_THRESHOLD,
          rootMargin: REVEAL_MARGIN,
        }
      );

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 80) {
          el.classList.add('ns-visible');
        } else {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }, REVEAL_DELAY);

    return () => clearTimeout(timeout);
  }, deps);
}

/* Backwards-compat alias */
export function useRevealStagger(deps: DependencyList = []): void { useNsReveal(deps); }

/* ── useHeroParallax ──────────────────────────────────── */
export function useHeroParallax(): void {
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = document.querySelector<HTMLElement>('.hero-bg-parallax');
      if (el) el.style.transform = `scale(1.06) translateY(${window.scrollY * 0.28}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
}

/* ── useNavScrollTint ─────────────────────────────────── */
export function useNavScrollTint(): void {
  useEffect(() => {
    const update = () => {
      const nav = document.querySelector<HTMLElement>('.ns-navbar');
      if (!nav) return;
      const ratio = Math.min(window.scrollY / NAV_TINT_SCROLL_LIMIT, 1);
      nav.style.backdropFilter = `blur(${24 + ratio * 10}px) saturate(${180 + ratio * 60}%)`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
}

/* ── useGlobalMouseParallax ───────────────────────────── */
export function useGlobalMouseParallax(): void {
  useEffect(() => {
    if (window.matchMedia('(hover:none)').matches) return;
    let mx = 0, my = 0, raf = 0;
    const onMove = (e: MouseEvent): void => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (mx - cx) / cx;
      const dy = (my - cy) / cy;
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
        const depth = parseFloat(el.dataset.parallax ?? '') || 10;
        el.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);
}

/* ── useMagneticCards — .mag-card 3D tilt ────────────── */
export function useMagneticCards(): void {
  useEffect(() => {
    if (window.matchMedia('(hover:none)').matches) return;
    const apply = (e: MouseEvent): void => {
      document.querySelectorAll<HTMLElement>('.mag-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = Math.max(rect.width, rect.height) * MAGNETIC_MAX_DIST_FACTOR;
        if (dist < maxD) {
          const t = 1 - dist / maxD;
          const rx = (dy / rect.height * t * MAGNETIC_MAX_ROTATION).toFixed(2);
          const ry = (-dx / rect.width * t * MAGNETIC_MAX_ROTATION).toFixed(2);
          card.style.transform = `perspective(${MAGNETIC_PERSPECTIVE}px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
        } else {
          card.style.transform = '';
        }
      });
    };
    const reset = (): void => document.querySelectorAll<HTMLElement>('.mag-card').forEach(c => { c.style.transform = ''; });
    window.addEventListener('mousemove', apply, { passive:true });
    window.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('mousemove', apply);
      window.removeEventListener('mouseleave', reset);
    };
  }, []);
}
