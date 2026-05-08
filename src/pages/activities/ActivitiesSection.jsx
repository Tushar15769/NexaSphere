import { useRef } from 'react';
import { activities } from '../../data/activitiesData';
import { DynamicIcon } from '../../shared/Icons';

const ANTI_GRAVITY_DELAYS = [0, -2.1, -4.2, -1.0, -3.3, -5.5, -0.7, -6.1];
const TILT_ANGLE = 16;
const TILT_SCALE = 1.04;
const CLICK_SCALE_DELAY = 130;
const NAVIGATION_DELAY = 160;

function ActivityCard({ a, idx, onNav }) {
  const ref = useRef(null);

  const handleMouseMove = e => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.animationPlayState = 'paused';
    card.style.transform = `translateY(-16px) rotateX(${-y * TILT_ANGLE}deg) rotateY(${x * TILT_ANGLE}deg) scale(${TILT_SCALE})`;
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
      card.style.transform = 'scale(0.92)';
      setTimeout(() => {
        card.style.transform = '';
      }, CLICK_SCALE_DELAY);
    }
    setTimeout(() => onNav('activity', a.title), NAVIGATION_DELAY);
  };

  return (
    <div
      ref={ref}
      className="activity-card shimmer mag-card"
      style={{
        animationDelay: `${ANTI_GRAVITY_DELAYS[idx % ANTI_GRAVITY_DELAYS.length]}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="card-accent-line" />
      <div className="card-num">{String(idx + 1).padStart(2, '0')}</div>
      <div className="activity-icon pop-in fired" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}><DynamicIcon name={a.icon} size={32} /></div>
      <div className="activity-title">{a.title}</div>
      <p className="activity-desc">{a.description}</p>
      <div className="activity-cta">
        <span>Explore</span>
        <span>→</span>
      </div>
      <div className="corner-tl" />
      <div className="corner-br" />
    </div>
  );
}

export default function ActivitiesSection({ onNavigate }) {
  return (
    <section className="section" id="section-activities">
      <div className="container">
        <div className="reveal-stagger">
          <h2 className="section-title pop-word">Our Activities</h2>
          <p className="section-subtitle pop-in" style={{ animationDelay: '0.1s' }}>
            Click any activity to explore sessions &amp; events
          </p>
        </div>
        <div className="activity-grid cin-container">
          {activities.map((a, i) => (
            <ActivityCard key={a.id} a={a} idx={i} onNav={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
}
