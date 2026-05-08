import nexasphereAppLogo from '../assets/images/logos/nexasphere-app-logo.png';
import glbajajLogo       from '../assets/images/logos/glbajaj-logo.png';
import * as LucideIcons from 'lucide-react';

function DynamicIcon({ name, ...props }) {
  const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
  return <Icon {...props} />;
}

const NEXASPHERE_EMAIL = 'nexasphere@glbajajgroup.org';

export default function Footer() {
  return (
    <footer className="ns-footer">
      <div className="container">
        <div className="ns-footer-inner">
          <div className="ns-footer-divider"/>
          <div className="ns-footer-logos">
            <img src={nexasphereAppLogo} alt="NexaSphere" className="ns-footer-logo-ns"/>
            <div style={{width:1,height:24,background:'var(--bdr2)'}}/>
            <img src={glbajajLogo}    alt="GL Bajaj"   className="ns-footer-logo-gl"/>
          </div>
          <p className="ns-footer-text">© {new Date().getFullYear()} <span>NexaSphere</span> — GL Bajaj Group of Institutions, Mathura</p>
          <p className="ns-footer-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <DynamicIcon name="Mail" size={14} style={{ color: 'var(--c1)' }} />
            <a href={`mailto:${NEXASPHERE_EMAIL}`} className="ns-footer-email-link">
              {NEXASPHERE_EMAIL}
            </a>
          </p>
          <p className="ns-footer-text ns-footer-built" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            Built with <DynamicIcon name="Heart" size={12} fill="var(--c1)" stroke="var(--c1)" /> by the NexaSphere Core Team · Architected by Ayush Sharma
          </p>
        </div>
      </div>
    </footer>
  );
}
