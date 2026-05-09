import { type MouseEvent, type ReactNode, type Ref, useEffect, useRef, useState, useCallback } from 'react';
import nexasphereLogo from '../../assets/images/logos/nexasphere-logo.png';
import { IconArrowRight, IconSpark } from '../../shared/Icons';
import type { HeroSectionProps } from '../../types/components';

const RIPPLE_DURATION = 700;
const TILT_PERSPECTIVE = 700;
const TILT_SENSITIVITY = 220;
const TILT_ANGLE = 16;
const READY_DELAY = 80;
const STATS_VIS_DELAY = 900;

/* ── Ripple Button ── */
function RippleBtn({
  cls,
  children,
  href,
  onClick,
}: {
  cls: string;
  children: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}): ReactNode {
  const ref = useRef<HTMLElement | null>(null);
  const go = (e: MouseEvent<HTMLElement>): void => {
    const b = ref.current; if (!b) return;
    const r = b.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'rpl';
    el.style.left = (e.clientX - r.left) + 'px';
    el.style.top  = (e.clientY - r.top)  + 'px';
    b.appendChild(el);
    setTimeout(() => el.remove(), 700);
    onClick && onClick(e);
  };
  if (href) return <a ref={ref as Ref<HTMLAnchorElement>} href={href} target="_blank" rel="noopener noreferrer" className={`btn btn-ripple ${cls}`} onClick={go}>{children}</a>;
  return <button ref={ref as Ref<HTMLButtonElement>} className={`btn btn-ripple ${cls}`} onClick={go}>{children}</button>;
}

/* ── Animated gradient title — safe in both modes ── */
function HeroTitle({ isLight }: { isLight: boolean }): ReactNode {
  return (
    <div className="hero-title">
      <span className="hero-title-text">NexaSphere</span>
    </div>
  );
}

/* ── SVG Orbit rings ── */
function OrbitRings({ isLight }: { isLight: boolean }): ReactNode {
  const rings = isLight
    ? [{rx:105,ry:48,dur:8,r:2,col:'194,119,10',d:'0s'},{rx:58,ry:182,dur:13,r:1.5,col:'109,40,217',d:'-5s'},{rx:162,ry:37,dur:17,r:1,col:'190,24,93',d:'-9s'},{rx:78,ry:158,dur:6,r:2,col:'8,145,178',d:'-2s'}]
    : [{rx:105,ry:48,dur:8,r:2,col:'0,212,255',d:'0s'},{rx:58,ry:182,dur:13,r:1.5,col:'123,111,255',d:'-5s'},{rx:162,ry:37,dur:17,r:1,col:'189,92,255',d:'-9s'},{rx:78,ry:158,dur:6,r:2,col:'0,255,157',d:'-2s'}];
  const tilts=['rotate(-22 250 250)','rotate(14 250 250)','rotate(55 250 250)','rotate(-35 250 250)'];
  return (
    <svg 
      width="280" 
      height="280" 
      viewBox="0 0 500 500"
      data-parallax="8"
      className="orbit-rings-svg"
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0, overflow: 'visible' }}
    >
      {rings.map((rg, i) => (
        <g key={i} transform={tilts[i]}>
          <ellipse cx="250" cy="250" rx={rg.rx} ry={rg.ry} fill="none" stroke={`rgba(${rg.col},.18)`} strokeWidth="1" />
          <circle 
            r={rg.r * 3.5} 
            fill={`rgba(${rg.col},.95)`}
            style={{ filter: `drop-shadow(0 0 ${rg.r * 5}px rgba(${rg.col},.9))` }}
          >
            <animateMotion dur={`${rg.dur}s`} repeatCount="indefinite" begin={rg.d}>
              <mpath href={`#hr${i}`} />
            </animateMotion>
          </circle>
          <path 
            id={`hr${i}`} 
            d={`M ${250 - rg.rx} 250 a ${rg.rx} ${rg.ry} 0 1 1 ${rg.rx * 2} 0 a ${rg.rx} ${rg.ry} 0 1 1 -${rg.rx * 2} 0`} 
            fill="none" 
          />
        </g>
      ))}
    </svg>
  );
}

/* ── Logo with 3D mouse tilt ── */
function Logo3D({ ready, isLight }: { ready: boolean; isLight: boolean }): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = useCallback((e: MouseEvent<HTMLDivElement>): void => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / TILT_SENSITIVITY;
    const dy = (e.clientY - (rect.top + rect.height / 2)) / TILT_SENSITIVITY;
    el.style.transform = `perspective(${TILT_PERSPECTIVE}px) rotateX(${-dy * TILT_ANGLE}deg) rotateY(${dx * TILT_ANGLE}deg) scale(1.05)`;
  }, []);
  const onLeave = (): void => { if(ref.current) ref.current.style.transform=''; };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="hero-logo-wrap"
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'scale(1)' : 'scale(.3) rotateY(180deg)',
      }}
    >
      <OrbitRings />
      <img src={nexasphereLogo} alt="NexaSphere" className="hero-logo-img" />
      <div className="hero-logo-shadow" />
    </div>
  );
}

/* ── Stats bar ── */
function StatsBar({ vis, isLight }: { vis: boolean; isLight: boolean }): ReactNode {
  const items = [{v:'12',l:'Members',i:'👥'},{v:'8',l:'Activities',i:'⚡'},{v:'1',l:'Events Done',i:'📅'},{v:'∞',l:'Ideas',i:'💡'}];
  return (
    <div 
      className="stats-bar" 
      style={{ 
        opacity: vis ? 1 : 0, 
        transform: vis ? 'none' : 'translateY(22px)' 
      }}
    >
      {items.map((s, i) => (
        <div key={i} className="stats-item">
          <div className={`home-icon-pop ${vis ? 'pop-in fired' : ''}`} style={{fontSize:'.9rem',marginBottom:'2px', color: 'var(--c1)', transition: 'transform .3s var(--t-smooth)', animationDelay: `${.5+i*.1}s` }}><DynamicIcon name={s.i} size={16} /></div>
          <div 
            className="stats-value"
            style={{
              fontFamily: 'Orbitron,monospace',
              fontSize: 'clamp(1.1rem,3vw,1.75rem)',
              fontWeight: 900,
              backgroundImage: 'linear-gradient(135deg,#EE2222,#CC1111)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: vis ? `countUp .5s ${0.4 + i * 0.1}s both` : 'none',
            }}
          >
            {s.v}
          </div>
          <div className="stats-label" style={{ fontSize: '.58rem', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: '1px', fontFamily: "'Space Mono',monospace" }}>
            {s.l}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Particles / atmosphere ── */
function Atmosphere({ isLight }: { isLight: boolean }): ReactNode {
  if (isLight) return (
    <div style={{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',
      backgroundImage:`radial-gradient(circle at 60% 38%,rgba(194,119,10,.05) 0%,transparent 55%),radial-gradient(circle at 30% 68%,rgba(109,40,217,.04) 0%,transparent 48%)`}}/>
  );
  return (
    <>
      <div className="data-streams">
        {Array.from({ length: 9 }, (_, i) => (
          <div 
            key={i} 
            className="data-stream" 
            style={{ 
              left: `${6 + i * 11}%`, 
              animation: `dataStream ${4.2 + i * 0.65}s linear infinite`, 
              animationDelay: `${-i * 1.3}s` 
            }}
          >
            {Array.from({ length: 28 }, () => (Math.random() > 0.5 ? '1' : '0')).join('\n')}
          </div>
        ))}
      </div>
      
      <div className="atmosphere-dark-overlay">
        <div className="scanline" />
        <div className="crt-lines" />
      </div>
    </>
  );
}

export default function HeroSection({ onTabChange, onApply, onJoin, theme = 'dark' }: HeroSectionProps): ReactNode {
  const [ready, setReady]     = useState(false);
  const [statsVis, setStatsVis] = useState(false);
  const isLight = theme === 'light';

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), READY_DELAY);
    const t2 = setTimeout(() => setStatsVis(true), STATS_VIS_DELAY);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section className="hero-section" id="section-home">
      <div className="hero-overlay" />
      <Atmosphere isLight={isLight} />

      <div className="hero-content">
        <Logo3D ready={ready} />
        <HeroTitle />

        <p className="hero-tagline">
          GL Bajaj&apos;s Student-Driven Tech Ecosystem
          <span className="hero-tagline-cursor">_</span>
        </p>

        <div className="hero-buttons">
          <div className="hero-buttons-row">
            <RippleBtn cls="btn-primary" onClick={() => (onJoin ? onJoin() : onTabChange('Team'))}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Join as Member <IconArrowRight />
              </span>
            </RippleBtn>
            <RippleBtn cls="btn-outline" onClick={() => onTabChange('Team')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Core Team <IconArrowRight />
              </span>
            </RippleBtn>
          </div>
          
          <div className="apply-container">
            <p style={{ fontSize: '.82rem', marginBottom: '10px', lineHeight: 1.5 }}>
              Want to be part of the NexaSphere Core Team?
            </p>
            <RippleBtn cls="btn-join" onClick={() => (onApply ? onApply() : onTabChange('Team'))}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Apply for Core Team <IconSpark />
              </span>
            </RippleBtn>
          </div>
        </div>

        <StatsBar vis={statsVis} />
      </div>

      <div className="hero-bottom-fade" />
      
      <div className="scroll-indicator">
        <div className="scroll-label">SCROLL</div>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
