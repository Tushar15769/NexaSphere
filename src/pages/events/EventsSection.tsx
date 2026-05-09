import { type ReactNode, useEffect } from 'react';
import { events as fallbackEvents } from '../../data/eventsData';
import * as LucideIcons from 'lucide-react';

function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <Icon {...props} />;
}

const ANIMATION_STAGGER_DELAY = 0.1;


export default function EventsSection({
  onEventClick,
  events = fallbackEvents,
}: {
  onEventClick?: (event: Event) => void;
  events?: Event[];
}): ReactNode {
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('fired');obs.unobserve(e.target);}});
    },{threshold:.1});
    document.querySelectorAll('#section-events .pop-in,#section-events .pop-left,#section-events .pop-right,#section-events .pop-word').forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  },[]);

  return (
    <section className="section" id="section-events">
      <div className="container">
        <div className="ns-reveal">
          <h2 className="section-title pop-word">Our Events</h2>
          <p className="section-subtitle pop-in" style={{ animationDelay: '0.1s' }}>
            Where Ideas Come to Life
          </p>
        </div>
        
        <div className="events-timeline">
          {events.map((ev, i) => {
            const isKSS = ev.id === 1 || ev.id === 'kss-153' || String(ev.shortName || '').toLowerCase().includes('kss');
            
            return (
              <div className="timeline-item" key={ev.id}>
                <div className={`timeline-dot${ev.status === 'upcoming' ? ' upcoming' : ''}`} />
                <div
                  className={`timeline-card shimmer ${i % 2 === 0 ? 'pop-left' : 'pop-right'} ${isKSS ? 'clickable' : ''}`}
                  style={{
                    animationDelay: `${i * ANIMATION_STAGGER_DELAY}s`,
                    cursor: isKSS ? 'none' : 'default',
                  }}
                  onClick={isKSS ? () => onEventClick?.(ev) : undefined}
                >
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'7px'}}>
                    <div style={{color: isKSS ? '#a855f7' : 'var(--c1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <DynamicIcon name={ev.icon} size={22} />
                    </div>
                    <div className="timeline-event-name" style={isKSS ? { color: '#a855f7' } : {}}>{ev.name}</div>
                    {isKSS && (
                      <span style={{
                        marginLeft: 'auto', fontSize: '.6rem', padding: '2px 8px',
                        borderRadius: '10px', background: 'rgba(168,85,247,.12)',
                        color: '#a855f7', border: '1px solid rgba(168,85,247,.3)',
                        fontFamily: "'Space Mono', monospace", whiteSpace: 'nowrap',
                      }}>View Details →</span>
                    )}
                  </div>
                  <div className="timeline-event-date">
                    <DynamicIcon name="Calendar" size={13} style={{verticalAlign:'middle', marginRight:'6px', opacity:0.8}} />
                    {ev.date}
                  </div>
                  <p className="timeline-event-desc">{ev.description}</p>
                  <div style={{display:'flex',alignItems:'center',gap:'7px',flexWrap:'wrap'}}>
                    <span className={`timeline-badge ${ev.status}`}>
                      {ev.status==='completed' ? (
                        <><DynamicIcon name="CheckCircle" size={10} style={{marginRight:4}}/> Completed</>
                      ) : (
                        <><DynamicIcon name="Clock" size={10} style={{marginRight:4}}/> Upcoming</>
                      )}
                    </span>
                    {ev.tags?.map(t=>(
                      <span key={t} style={{fontSize:'.68rem',padding:'2px 8px',borderRadius:'10px',background:'var(--c2a)',color:'var(--c2)',border:'1px solid var(--c2b)',fontWeight:600}}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          
          {events.length > 0 && (
            <div className="timeline-item">
              <div className="timeline-dot upcoming"/>
              <div className="timeline-card pop-in" style={{textAlign:'center',color:'var(--t3)'}}>
                <div style={{color:'var(--c1)', display:'flex', justifyContent:'center', marginBottom:'8px'}}>
                  <DynamicIcon name="Rocket" size={24} />
                </div>
                <p style={{marginTop:'6px',fontSize:'.84rem'}}>More events are being planned. Watch this space!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
