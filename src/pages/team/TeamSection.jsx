import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { teamMembers } from '../../data/teamData';
import TeamMemberModal from './TeamMemberModal';
import { IconSpark } from '../../shared/Icons';
import './TeamSection.css';

const ANTI_GRAVITY_DELAYS = [0, -2.1, -4.2, -1.0, -3.3, -5.5, -0.7, -6.1, -2.8, -4.9, -1.6, -3.8];
const TILT_ANGLE = 18;
const TILT_SCALE = 1.06;
const CLICK_SCALE_DELAY = 140;
const CLICK_ACTION_DELAY = 110;

function MemberCard({ member, idx, onClick }) {
  const ref = useRef(null);

  const handleMouseMove = e => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.animationPlayState = 'paused';
    card.style.transform = `translateY(-14px) rotateX(${-y * TILT_ANGLE}deg) rotateY(${x * TILT_ANGLE}deg) scale(${TILT_SCALE})`;
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = '';
    card.style.animationPlayState = '';
  };

  const handleClick = () => {
    const card = ref.current;
    if (card) {
      card.style.transform = 'scale(0.9)';
      setTimeout(() => {
        card.style.transform = '';
      }, CLICK_SCALE_DELAY);
    }
    setTimeout(() => onClick(member), CLICK_ACTION_DELAY);
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

export default function TeamSection({ onApply }) {
  const [selectedMember, setSelectedMember] = useState(null);

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
