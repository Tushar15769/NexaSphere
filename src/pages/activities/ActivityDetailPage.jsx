import { useEffect, useRef, useState } from 'react';
import Skeleton from '../../shared/Skeleton';
import * as LucideIcons from 'lucide-react';

function DynamicIcon({ name, ...props }) {
  const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
  return <Icon {...props} />;
}

function HighlightCard({ highlight, color }) {
  const rgb = hexToRgb(color);
  return (
    <div style={{
      background: 'var(--card)',
      border: `1px solid var(--bdr)`,
      borderRadius: 'var(--r3)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bdr)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: `rgba(${rgb},0.1)`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <DynamicIcon name={highlight.icon} size={24} />
      </div>
      <h4 style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', color: 'var(--t1)', marginBottom: '8px', fontWeight: 700 }}>
        {highlight.title}
      </h4>
      <p style={{ color: 'var(--t2)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
        {highlight.desc}
      </p>
    </div>
  );
}

function SectionTitle({ children, color, icon }) {
  return (
    <h2 style={{
      fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', fontWeight: 700,
      color, margin: '0 0 24px 0', letterSpacing: '0.08em',
      textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', gap: '10px',
    }}>
      <span style={{
        display: 'inline-block', width: '32px', height: '2px',
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      {icon && <DynamicIcon name={icon} size={18} style={{ marginRight: '4px' }} />}
      {children}
    </h2>
  );
}

function Counter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseInt(value) || 0;
        const dur = 1200;
        const step = 16;
        const inc = num / (dur / step);
        let cur = 0;
        const timer = setInterval(() => {
          cur += inc;
          if (cur >= num) { setCount(num); clearInterval(timer); }
          else setCount(Math.floor(cur));
        }, step);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function GlitchText({ text, color }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}
      className="glitch-text"
      data-text={text}
    >
      {text}
      <style>{`
        .glitch-text { color: ${color}; }
        .glitch-text::before, .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          opacity: 0;
        }
        .glitch-text:hover::before {
          opacity: 0.7;
          color: #ff0080;
          clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
          transform: translateX(-3px);
          animation: glitch1 0.3s steps(2) infinite;
        }
        .glitch-text:hover::after {
          opacity: 0.7;
          color: #00ffff;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          transform: translateX(3px);
          animation: glitch2 0.3s steps(2) infinite;
        }
        @keyframes glitch1 { 0%{transform:translateX(-3px)} 50%{transform:translateX(3px)} 100%{transform:translateX(-3px)} }
        @keyframes glitch2 { 0%{transform:translateX(3px)} 50%{transform:translateX(-3px)} 100%{transform:translateX(3px)} }
      `}</style>
    </span>
  );
}

function FloatingOrbs({ color }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${80 + i * 40}px`,
          height: `${80 + i * 40}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          top: `${10 + (i * 17) % 80}%`,
          left: `${5 + (i * 23) % 90}%`,
          animation: `float ${6 + i * 2}s ease-in-out infinite`,
          animationDelay: `${-i * 1.5}s`,
        }} />
      ))}
    </div>
  );
}

function ScanLine() {
  return (
    <>
      <style>{`
        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100%; }
        }
      `}</style>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
        opacity: 0.3, pointerEvents: 'none', zIndex: 0,
        animation: 'scanline 4s linear infinite',
      }} />
    </>
  );
}

function EventCard({ event, activityColor, onSelect, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onSelect && onSelect(event)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(${hexToRgb(activityColor)},0.12), var(--card))`
          : 'var(--card)',
        border: `1px solid ${hovered ? activityColor + '80' : 'var(--bdr)'}`,
        borderRadius: 'var(--r2)',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'translateY(-8px) scale(1.01)' : 'none',
        boxShadow: hovered ? `0 20px 60px ${activityColor}30, 0 0 0 1px ${activityColor}40` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
          background: `linear-gradient(105deg, transparent 20%, ${activityColor}15 50%, transparent 80%)`,
          animation: 'shimmer 0.6s ease forwards',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: 'Orbitron, monospace', fontSize: '0.95rem', fontWeight: 700,
              color: activityColor, margin: 0,
            }}>
              {event.name}
            </h3>
            {event.status === 'completed' && (
              <span style={{
                fontSize: '0.7rem', padding: '2px 10px', borderRadius: '20px',
                background: 'rgba(34,197,94,0.12)', color: '#22c55e',
                border: '1px solid rgba(34,197,94,0.3)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: '4px'
              }}><DynamicIcon name="CheckCircle" size={10} /> Completed</span>
            )}
          </div>
          <div style={{ color: 'var(--t3)', fontSize: '0.8rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DynamicIcon name="Calendar" size={14} style={{ opacity: 0.7 }} /> {event.date}
          </div>
          <p style={{ color: 'var(--t2)', fontSize: '0.88rem', margin: '0 0 12px', lineHeight: 1.6 }}>
            {event.tagline || event.description}
          </p>
          {event.stats && (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {event.stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: 700, color: activityColor }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(event.id); }}
              style={{ padding: '4px 12px', color: '#ff5f7a', borderColor: 'rgba(255,95,122,0.3)' }}
            >
              <DynamicIcon name="Trash2" size={12} style={{ marginRight: 4 }} /> Delete
            </button>
          </div>
        </div>
        <div style={{
          color: activityColor, fontSize: '1.4rem', flexShrink: 0,
          transform: hovered ? 'translateX(4px)' : '',
          transition: 'transform 0.3s ease',
        }}><DynamicIcon name="ArrowRight" size={20} /></div>
      </div>
    </div>
  );
}

function UpcomingCard({ event, color }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px dashed var(--bdr)',
      borderRadius: 'var(--r2)',
      padding: '20px 24px',
      opacity: 0.75,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          border: `2px solid ${color}`,
          animation: 'pulseRing 1.8s infinite',
          flexShrink: 0,
        }} />
        <h4 style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.85rem', color, margin: 0, fontWeight: 700 }}>
          {event.name}
        </h4>
        <span style={{
          fontSize: '0.68rem', padding: '2px 8px', borderRadius: '20px',
          background: `${color}15`, color, border: `1px solid ${color}40`,
          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '4px'
        }}><DynamicIcon name="Clock" size={10} /> Upcoming</span>
      </div>
      <div style={{ color: 'var(--t3)', fontSize: '0.78rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <DynamicIcon name="Calendar" size={14} style={{ opacity: 0.7 }} /> {event.date}
      </div>
      <p style={{ color: 'var(--t2)', fontSize: '0.85rem', margin: 0 }}>{event.description}</p>
    </div>
  );
}

function hexToRgb(hex) {
  if (!hex || !hex.startsWith('#')) return '0,212,255';
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

export default function ActivityDetailPage({ activity, onBack, onSelectEvent }) {
  const [mounted, setMounted] = useState(false);
  const [manualEvents, setManualEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const apiBase = (import.meta?.env?.VITE_API_BASE || '').replace(/\/+$/, '');
  const activityKey = encodeURIComponent(activity.title);

  const fetchManualEvents = async () => {
    setLoading(true);
    try {
      const url = apiBase ? `${apiBase}/api/content/activity-events/${activityKey}` : `/api/content/activity-events/${activityKey}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data?.events)) setManualEvents(data.events);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setTimeout(() => setMounted(true), 50);
    fetchManualEvents().catch(() => {});
  }, [activity.title]);

  const askAuth = () => {
    const name = window.prompt('Enter your full name (core team):');
    if (!name) return null;
    const email = window.prompt('Enter your email:');
    if (!email) return null;
    const phone = window.prompt('Enter your phone number:');
    if (!phone) return null;
    const password = window.prompt('Enter password:');
    if (!password) return null;
    return { name, email, phone, password };
  };

  const handleAddEvent = async () => {
    const auth = askAuth();
    if (!auth) return;
    const eventName = window.prompt('Event name:');
    if (!eventName) return;
    const eventDate = window.prompt('Event date (e.g. May 20, 2026):');
    if (!eventDate) return;
    const eventTagline = window.prompt('Short tagline (optional):') || '';
    const eventDescription = window.prompt('Event description:');
    if (!eventDescription) return;
    setBusy(true);
    try {
      const url = apiBase ? `${apiBase}/api/content/activity-events/${activityKey}` : `/api/content/activity-events/${activityKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...auth, eventName, eventDate, eventTagline, eventDescription }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to add event');
      alert('Event added successfully.');
      await fetchManualEvents();
    } catch (e) {
      alert(e?.message || 'Unable to add event.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const auth = askAuth();
    if (!auth) return;
    if (!window.confirm('Delete this event?')) return;
    setBusy(true);
    try {
      const url = apiBase ? `${apiBase}/api/content/activity-events/${activityKey}/${eventId}` : `/api/content/activity-events/${activityKey}/${eventId}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auth),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to delete event');
      alert('Event deleted.');
      await fetchManualEvents();
    } catch (e) {
      alert(e?.message || 'Unable to delete event.');
    } finally {
      setBusy(false);
    }
  };

  const color = activity.color || 'var(--c1)';
  const rgb = hexToRgb(color);

  const renderSkeletons = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px' }}>
      {[1, 2].map(i => (
        <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--r2)', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <Skeleton width="60%" height="22px" />
            <Skeleton width="80px" height="20px" borderRadius="10px" />
          </div>
          <Skeleton width="40%" height="16px" style={{ marginBottom: '12px' }} />
          <Skeleton width="90%" height="14px" style={{ marginBottom: '8px' }} />
          <Skeleton width="80%" height="14px" style={{ marginBottom: '16px' }} />
          <Skeleton width="100px" height="28px" borderRadius="6px" />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px', overflow: 'hidden' }}>

      
      <div style={{
        position: 'relative',
        background: `linear-gradient(180deg, rgba(${rgb},0.10) 0%, rgba(${rgb},0.03) 60%, transparent 100%)`,
        borderBottom: `1px solid rgba(${rgb},0.2)`,
        padding: '60px 0 52px',
        overflow: 'hidden',
      }}>
        <FloatingOrbs color={color} />
        <ScanLine />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'none', border: `1px solid rgba(${rgb},0.3)`,
              color: color, borderRadius: '20px', padding: '6px 18px',
              fontSize: '0.85rem', cursor: 'pointer', marginBottom: '36px',
              transition: 'all 0.2s', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
            }}
            onMouseEnter={e => { e.target.style.background = `rgba(${rgb},0.1)`; e.target.style.transform = 'translateX(-4px)'; }}
            onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.transform = ''; }}
          >
            <DynamicIcon name="ArrowLeft" size={16} /> Back to Activities
          </button>

          
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <div style={{
              fontSize: '5rem', marginBottom: '16px',
              filter: `drop-shadow(0 0 24px rgba(${rgb},0.6))`,
              animation: 'float 4s ease-in-out infinite',
              display: 'inline-block',
            }}>
              <DynamicIcon name={activity.icon} size={64} />
            </div>
            <h1 style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 900, marginBottom: '8px',
              lineHeight: 1.1,
            }}>
              <GlitchText text={activity.title} color={color} />
            </h1>
            <div style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: `rgba(${rgb},0.8)`,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '20px',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.7s 0.2s ease',
            }}>
              {activity.tagline}
            </div>
            <p style={{
              color: 'var(--t2)', maxWidth: '560px',
              fontSize: '1.05rem', lineHeight: 1.7,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.7s 0.35s ease',
            }}>
              {activity.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content Sections ── */}
      <div className="container" style={{ paddingTop: '56px' }}>

        {/* ── Highlights ── */}
        {activity.highlights && activity.highlights.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <SectionTitle color={color}>Key Highlights</SectionTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}>
              {activity.highlights.map((h, i) => (
                <HighlightCard key={i} highlight={h} color={color} />
              ))}
            </div>
          </div>
        )}

        {/* ── What You Learn ── */}
        {activity.whatYouLearn && activity.whatYouLearn.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <SectionTitle color={color}>What You will Learn</SectionTitle>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--bdr)',
              borderRadius: 'var(--r3)',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '200px', height: '200px',
                background: `radial-gradient(circle, rgba(${rgb},0.05), transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}>
                {activity.whatYouLearn.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ color: color, marginTop: '2px' }}><DynamicIcon name="CheckCircle" size={18} /></div>
                    <div style={{ color: 'var(--t2)', fontSize: '0.95rem', lineHeight: 1.5 }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tools ── */}
        {activity.tools && activity.tools.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <SectionTitle color={color}>Tools & Technologies</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {activity.tools.map(tool => (
                <span key={tool} style={{
                  padding: '8px 18px',
                  background: 'var(--card2)',
                  border: '1px solid var(--bdr2)',
                  borderRadius: '12px',
                  color: 'var(--t1)',
                  fontSize: '0.88rem',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bdr2)'; e.currentTarget.style.transform = 'none'; }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* ── Conducted Events ── */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
            <SectionTitle color={color}>Conducted Events</SectionTitle>
            <button className="btn btn-primary btn-sm" onClick={handleAddEvent} disabled={busy} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DynamicIcon name="Plus" size={14} /> {busy ? 'Processing...' : 'Add Event'}
            </button>
          </div>
          
          {loading ? renderSkeletons() : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px' }}>
              {([...manualEvents, ...(activity.conductedEvents || [])].length > 0) ? (
                [...manualEvents, ...(activity.conductedEvents || [])].map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    activityColor={color}
                    onSelect={onSelectEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--t3)', padding: '40px 0', border: '1px dashed var(--bdr)', borderRadius: 'var(--r2)' }}>
                   <DynamicIcon name="Rocket" size={32} style={{ color, marginBottom: '12px', opacity: 0.5 }} />
                   <p>No conducted events found for this activity.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Upcoming Events ── */}
        {activity.upcomingEvents && activity.upcomingEvents.length > 0 && (
          <div style={{ maxWidth: '760px' }}>
            <SectionTitle color={'var(--t2)'}>Coming Up</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activity.upcomingEvents.map((event, i) => (
                <UpcomingCard key={i} event={event} color={color} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
