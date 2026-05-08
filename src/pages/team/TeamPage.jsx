import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import TeamMemberModal from './TeamMemberModal';
import { BannerOrbs } from '../../shared/MotionLayer';
import Skeleton from '../../shared/Skeleton';
import { ArrowLeft, Sparkles, Rocket, User, ExternalLink } from 'lucide-react';

function MemberCard({ member, idx, onClick }) {
  const ref = useRef(null);
  const agDelays = [-0.0, -2.1, -4.2, -1.0, -3.3, -5.5, -0.7, -6.1, -2.8, -4.9, -1.6, -3.8];

  const onMove = e => {
    const c = ref.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    c.style.animationPlayState = 'paused';
    c.style.transform = `translateY(-14px) rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale(1.06)`;
  };
  const onLeave = () => {
    const c = ref.current; if (!c) return;
    c.style.transform = ''; c.style.animationPlayState = '';
  };
  const click = () => {
    const c = ref.current;
    if (c) { c.style.transform = 'scale(.9)'; setTimeout(() => { c.style.transform = ''; }, 140); }
    setTimeout(() => onClick(member), 110);
  };

  return (
    <div ref={ref}
      className="team-card shimmer mag-card"
      style={{
        cursor: 'pointer', perspective: '800px',
        animation: `ag 7s ease-in-out ${agDelays[idx % 12]}s infinite`,
        willChange: 'transform',
        animationFillMode: 'both',
        opacity: 1,
      }}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={click}
      role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') click(); }}
    >
      <div className="team-card-photo-wrap">
        {member.photo ? (
           <img src={member.photo} alt={member.name} className="team-card-photo" />
        ) : (
          <div className="team-card-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card2)' }}>
            <User size={40} style={{ opacity: 0.3 }} />
          </div>
        )}
      </div>
      <div className="team-card-name">{member.name}</div>
      <div className="team-card-role">{member.role}</div>
      <div className="team-card-chips">
        <span className="chip-branch">{member.branch}</span>
        <span className="chip-section">§{member.section}</span>
      </div>
      <div className="team-card-hint">View Profile <ExternalLink size={10} style={{ marginLeft: 4 }} /></div>
      <div className="corner-tl" /><div className="corner-br" />
    </div>
  );
}

function MemberSkeleton() {
  return (
    <div className="team-card" style={{ border: '1px solid var(--bdr)', background: 'var(--card)', cursor: 'default' }}>
      <div className="team-card-photo-wrap">
        <Skeleton width="100%" height="100%" borderRadius="14px" />
      </div>
      <div style={{ padding: '0 10px 15px' }}>
        <Skeleton width="70%" height="18px" style={{ margin: '10px auto 6px' }} />
        <Skeleton width="50%" height="14px" style={{ margin: '0 auto 12px' }} />
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <Skeleton width="50px" height="20px" borderRadius="10px" />
          <Skeleton width="30px" height="20px" borderRadius="10px" />
        </div>
      </div>
    </div>
  );
}

export default function TeamPage({ onBack, onApply, team = [], loading = false }) {
  const [sel, setSel] = useState(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const organiser = team.filter(m => m.role === 'Organiser' || m.role === 'Co-organiser');
  const coreTeam  = team.filter(m => m.role === 'Core Team Member');

  const renderSection = (title, members, colorClass, startIdx) => (
    <div style={{ marginBottom: '52px' }}>
      <div style={{
        fontFamily: "'Orbitron', monospace", fontSize: '.68rem', fontWeight: 700,
        color: `var(--${colorClass})`, letterSpacing: '.2em', textTransform: 'uppercase',
        textAlign: 'center', marginBottom: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--bdr2))' }} />
        {title}
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--bdr2), transparent)' }} />
      </div>
      {loading ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: title === 'Leadership' ? 'repeat(auto-fill, minmax(175px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '16px', 
          maxWidth: title === 'Leadership' ? '500px' : '100%', 
          margin: '0 auto' 
        }}>
          {[1, 2, 3, 4].map(i => <MemberSkeleton key={i} />)}
        </div>
      ) : (
        <div className={title === 'Leadership' ? '' : 'team-grid'} style={title === 'Leadership' ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '16px', maxWidth: '500px', margin: '0 auto' } : {}}>
          {members.map((m, i) => <MemberCard key={m.id} member={m} idx={i + startIdx} onClick={setSel} />)}
        </div>
      )}
    </div>
  );

  return (
    <div id="team-page" style={{ minHeight: '100vh', padding: '0 0 100px' }}>
      
      <div className="page-banner" style={{
        background: 'linear-gradient(135deg, rgba(123,111,255,.07), rgba(189,92,255,.04))',
        borderBottom: '1px solid var(--bdr)',
        padding: '70px 0 50px',
        textAlign: 'center',
        marginBottom: '60px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="page-banner-line" style={{ position:'absolute',top:0,left:0,right:0,height:'3px',background:'linear-gradient(90deg,var(--c2),var(--c3),var(--c1))' }}/>
        <BannerOrbs color="rgba(123,111,255,.07)"/>
        <button onClick={onBack} className="ns-back-btn" style={{
          position: 'absolute', top: '24px', left: '28px',
          background: 'var(--card)', border: '1px solid var(--bdr)',
          borderRadius: '50px', padding: '7px 16px',
          color: 'var(--t2)', fontSize: '.8rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
          zIndex: 10
        }}>
          <ArrowLeft size={14} /> Back
        </button>

        <span className="cin-section-label" style={{ display: 'block', textAlign: 'center', marginBottom: '8px', fontFamily: "'Space Mono', monospace", fontSize: '.6rem', color: 'var(--t3)', letterSpacing: '.3em', textTransform: 'uppercase', position:'relative',zIndex:1 }}>
          GL Bajaj Group of Institutions · Mathura
        </span>
        <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', position:'relative',zIndex:1 }}>Core Team</h1>
        <p className="section-subtitle" style={{ maxWidth: '500px', margin: '0 auto', position:'relative',zIndex:1 }}>
          The minds and hands behind NexaSphere — meet the people driving the vision forward.
        </p>
      </div>

      <div className="container">
        {renderSection('Leadership', organiser, 'c2', 0)}
        {renderSection('Core Members', coreTeam, 'c1', 2)}

        <div className="ns-reveal-scale" style={{
          textAlign: 'center', padding: '32px',
          background: 'var(--card)', border: '1px solid var(--bdr)',
          borderRadius: 'var(--r3)', maxWidth: '520px', margin: '0 auto',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--c1), var(--c2), var(--c3))' }} />
          <div className="corner-tl" /><div className="corner-br" />
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
            <Rocket size={40} style={{ color: 'var(--c1)' }} />
          </div>
          <h3 style={{ fontFamily: 'Orbitron,monospace', fontSize: '1rem', fontWeight: 700, color: 'var(--c1)', marginBottom: '8px', letterSpacing: '.05em' }}>
            Want to Join NexaSphere?
          </h3>
          <p style={{ color: 'var(--t2)', fontSize: '.88rem', marginBottom: '18px', lineHeight: 1.65 }}>
            We&apos;re looking for passionate students to drive NexaSphere forward. Fill in the form and we&apos;ll reach out!
          </p>
          <button
            type="button"
            onClick={() => onApply && onApply()}
            className="btn btn-join btn-ripple"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            Apply Here <Sparkles size={16} />
          </button>
        </div>
      </div>

      {sel && createPortal(
        <TeamMemberModal member={sel} onClose={() => setSel(null)} />,
        document.body
      )}
    </div>
  );
}

