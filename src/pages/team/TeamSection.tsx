import { type KeyboardEvent, type MouseEvent, type ReactNode, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { teamMembers } from '../../data/teamData';
import TeamMemberModal from './TeamMemberModal';
import { IconArrowRight, IconSpark } from '../../shared/Icons';
import type { CoreTeamMember } from '../../types/api';
import type { TeamSectionProps } from '../../types/components';

function MemberCard({ member, idx, onClick }: {
  member: CoreTeamMember;
  idx: number;
  onClick: (member: CoreTeamMember) => void;
}): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  const agDelay = [-0.0,-2.1,-4.2,-1.0,-3.3,-5.5,-0.7,-6.1,-2.8,-4.9,-1.6,-3.8];

  const onMove = (e: MouseEvent<HTMLDivElement>): void => {
    const c = ref.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left)/rect.width  - .5;
    const y = (e.clientY - rect.top )/rect.height - .5;
    c.style.animationPlayState = 'paused';
    c.style.transform = `translateY(-14px) rotateX(${-y*18}deg) rotateY(${x*18}deg) scale(1.06)`;
  };
  const onLeave = (): void => {
    const c = ref.current; if(!c) return;
    c.style.transform=''; c.style.animationPlayState='';
  };
  const click = (): void => {
    const c = ref.current;
    if(c){c.style.transform='scale(.9)';setTimeout(()=>{c.style.transform='';},140);}
    setTimeout(()=>onClick(member),110);
  };

  return (
    <div
      ref={ref}
      className="team-card shimmer mag-card"
      style={{
        animationDelay: `${ANTI_GRAVITY_DELAYS[idx % 12]}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={click}
      role="button" tabIndex={0}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>)=>{if(e.key==='Enter'||e.key===' ')click();}}
    >
      <div className="team-card-photo-wrap">
        <img src={member.photo} alt={member.name} className="team-card-photo" />
      </div>
      <div className="team-card-name">{member.name}</div>
      <div className="team-card-role">{member.role}</div>
      <div className="team-card-chips">
        <span className="chip-branch">{member.branch}</span>
        <span className="chip-section">§{member.section}</span>
      </div>
      <div className="team-card-hint">Click to view ↗</div>
      <div className="corner-tl" />
      <div className="corner-br" />
    </div>
  );
}

export default function TeamSection({ onApply }: TeamSectionProps): ReactNode {
  const [sel, setSel] = useState<CoreTeamMember | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll('#section-team .pop-flip, #section-team .pop-in, #section-team .pop-word');
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('fired');obs.unobserve(e.target);}});
    },{threshold:0, rootMargin:'0px 0px -10px 0px'});
    elements.forEach(el=>obs.observe(el));
    // Fallback: if already scrolled into view, fire immediately
    const fallback = setTimeout(() => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) el.classList.add('fired');
      });
    }, 120);
    return()=>{obs.disconnect(); clearTimeout(fallback);};
  },[]);

  return (
    <section className="section" id="section-team">
      <div className="container">
        <div className="ns-reveal">
          <span className="cin-section-label pop-in">GL Bajaj Group of Institutions · Mathura</span>
          <h2 className="section-title pop-word">Core Team</h2>
          <p className="section-subtitle pop-in" style={{ animationDelay: '0.1s' }}>
            The Minds Behind NexaSphere
          </p>
        </div>

        <div className="team-grid cin-container">
          {teamMembers.map((member, i) => (
            <MemberCard key={member.id} member={member} idx={i} onClick={setSelectedMember} />
          ))}
        </div>

        <div className="ns-reveal-scale join-banner">
          <div className="corner-tl" />
          <div className="corner-br" />
          <h3>Want to Join NexaSphere?</h3>
          <p>
            We&apos;re looking for passionate students to drive NexaSphere forward. Fill in the form and we&apos;ll reach out!
          </p>
          <button
            type="button"
            onClick={() => onApply && onApply()}
            className="btn btn-join btn-ripple"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            Apply Here <IconSpark />
          </button>
        </div>
      </div>

      {selectedMember &&
        createPortal(
          <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />,
          document.body
        )}
    </section>
  );
}
