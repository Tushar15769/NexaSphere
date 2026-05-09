import { type ReactNode, useEffect } from 'react';
import { BannerOrbs } from '../shared/MotionLayer';
import * as LucideIcons from 'lucide-react';

function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <Icon {...props} />;
}

interface NotFoundPageProps {
  onBackHome: () => void;
}

export default function NotFoundPage({ onBackHome }: NotFoundPageProps): ReactNode {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div id="notfound-page" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <BannerOrbs color="rgba(204, 17, 17, 0.08)" />
      
      <div className="pop-scale" style={{ 
        background: 'var(--card)', 
        border: '1px solid var(--bdr)', 
        borderRadius: 'var(--r3)', 
        padding: '50px 40px', 
        maxWidth: '500px',
        position: 'relative',
        boxShadow: 'var(--sh2)'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '4px', 
          background: 'linear-gradient(90deg, var(--c1), var(--c2), var(--c3))', 
          borderRadius: 'var(--r3) var(--r3) 0 0' 
        }} />
        <div className="corner-tl" /><div className="corner-br" />
        
        <div style={{ 
          fontSize: '6rem', 
          fontFamily: "'Orbitron', monospace", 
          fontWeight: 900, 
          backgroundImage: 'linear-gradient(135deg, var(--c1), var(--c2))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px',
          letterSpacing: '-2px'
        }}>
          404
        </div>
        
        <h2 style={{ 
          fontFamily: "'Orbitron', monospace", 
          fontSize: '1.4rem', 
          fontWeight: 700, 
          color: 'var(--t1)', 
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Lost in the Sphere
        </h2>
        
        <p style={{ 
          fontSize: '.95rem', 
          color: 'var(--t2)', 
          lineHeight: 1.6, 
          marginBottom: '30px' 
        }}>
          The coordinates you requested do not exist in our system. You may have entered a broken link or the page has moved to another sector.
        </p>
        
        <button 
          onClick={onBackHome} 
          className="btn btn-primary" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 24px', 
            fontSize: '0.9rem',
            margin: '0 auto'
          }}
        >
          <DynamicIcon name="Home" size={16} /> Return to Home Sector
        </button>
      </div>
    </div>
  );
}
