import './AboutSection.css';

const WHATSAPP = 'https://chat.whatsapp.com/Jjc5cuUKENu0RC1vWSEs20';
const LINKEDIN = 'https://www.linkedin.com/showcase/glbajaj-nexasphere/';
const NEXASPHERE_EMAIL = 'nexasphere@glbajajgroup.org';

const VALUES = ['Innovation', 'Collaboration', 'Learning', 'Growth', 'Community', 'Technology', 'Career', 'Mentorship'];

export default function AboutSection() {
  return (
    <section className="section about-section" id="section-about">
      <div className="about-glow" />
      <div className="container about-container">
        <div className="ns-reveal">
          <h2 className="section-title pop-word">About NexaSphere</h2>
          <p className="section-subtitle pop-in" style={{ animationDelay: '0.1s' }}>
            Building Tomorrow&apos;s Tech Leaders Today
          </p>
        </div>

        <div className="about-grid">
          <div className="ns-reveal-left">
            <p className="about-text pop-left" style={{ animationDelay: '0.08s' }}>
              <strong className="about-strong-red">NexaSphere</strong> is a student-driven tech ecosystem at{' '}
              <strong className="about-strong-dark-red">GL Bajaj Group of Institutions, Mathura</strong>.
              Founded to bridge the gap between academic learning and real-world technology, we run hackathons, workshops, knowledge-sharing sessions, and career guidance events.
            </p>
            <p className="about-text pop-left" style={{ marginTop: '12px', animationDelay: '0.16s' }}>
              From peer-led Knowledge Sharing Sessions and hands-on workshops to Industry Insider career guidance and competitive hackathons — NexaSphere runs events that connect curiosity with real opportunity, all year round.
            </p>
            
            <div className="contact-mini pop-left" style={{ animationDelay: '0.22s' }}>
              <div className="contact-label">Contact Us</div>
              <a href={`mailto:${NEXASPHERE_EMAIL}`} className="contact-email">{NEXASPHERE_EMAIL}</a>
            </div>
          </div>

          <div className="pop-right ag" style={{ animationDelay: '0.14s' }}>
            <div className="about-card-inner">
              <div className="about-card-glow" />
              <div className="corner-tl" />
              <div className="corner-br" />
              <div className="contact-label" style={{ marginBottom: '13px' }}>Our Values</div>
              <div className="values-container">
                {VALUES.map(value => (
                  <span key={value} className="value-tag">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="about-actions pop-in" style={{ animationDelay: '0.28s' }}>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 Join WhatsApp</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn-linkedin">🔗 LinkedIn</a>
          <a href={`mailto:${NEXASPHERE_EMAIL}`} className="btn btn-outline">📧 Email Us</a>
        </div>
      </div>
    </section>
  );
}
