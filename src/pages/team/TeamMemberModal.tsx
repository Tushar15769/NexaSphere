import { type MouseEvent, type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CoreTeamMember } from '../../types/api';
import type { TeamMemberModalProps } from '../../types/components';

// ── Copy Popup ──
function CopyPopup({ value, onClose }: { value: string; onClose: () => void }): ReactNode {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent): void => {
      if (e.target instanceof Element && !e.target.closest('.copy-popup')) onClose();
    };
    setTimeout(() => document.addEventListener('click', handler), 0);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  return (
    <div className="copy-popup">
      <span className="copy-popup-value">{value}</span>
      <button className="copy-popup-btn" onClick={handleCopy}>
        {copied ? '✅ Copied!' : '📋 Copy'}
      </button>
    </div>
  );
}

// ── Normalize WhatsApp: handle plain numbers OR full URLs ──
function getWhatsappDisplay(raw: string | null): string | null {
  if (!raw) return null;
  
  if (raw.startsWith('http')) return raw;
  
  return raw;
}

// ── Modal Content ──
function ModalContent({ member, onClose }: { member: CoreTeamMember; onClose: () => void }): ReactNode {
  const [activePopup, setActivePopup] = useState<'whatsapp' | 'email' | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const hasSocial = member.linkedin || member.whatsapp || member.instagram || member.email;
  const whatsappValue = getWhatsappDisplay(member.whatsapp);

  return (
    <div
      className="modal-overlay"
      onClick={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <DynamicIcon name="X" size={20} />
        </button>

        <div className="modal-glow-orb" style={{ position: 'absolute', top: '-20px', left: '-20px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(238,34,34,0.3) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />

        {/* Photo with glowing ring */}
        <div style={{ position: 'relative', width: '108px', height: '108px', margin: '0 auto 16px' }}>
          <img src={member.photo} alt={member.name} className="modal-photo" />
          <div className="modal-photo-ring" />
        </div>

        
        <div className="modal-name">{member.name}</div>
        <div className="modal-role">{member.role}</div>

        
        <div className="modal-info">
          <div className="modal-info-row">
            <span className="modal-info-label">🎓 Year</span>
            <span className="modal-info-value">{member.year}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">🔬 Branch</span>
            <span className="modal-info-value">{member.branch}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">📋 Section</span>
            <span className="modal-info-value">{member.section}</span>
          </div>
        </div>

        
        {member.achievements && member.achievements.length > 0 && (
          <div className="modal-achievements">
            <div className="modal-achievements-title">🏆 Achievements</div>
            <ul className="modal-achievements-list">
              {member.achievements.map((ach, idx) => (
                <li key={idx} className="modal-achievement-item">{ach}</li>
              ))}
            </ul>
          </div>
        )}

        
        {member.testimonials && member.testimonials.length > 0 && (
          <div className="modal-testimonials">
            <div className="modal-testimonials-title">💬 Testimonials</div>
            <ul className="modal-testimonials-list">
              {member.testimonials.map((t, idx) => (
                <li key={idx} className="modal-testimonial-item">
                  <span className="testimonial-text">“{t.text}”</span>
                  <span className="testimonial-author">- {t.author}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        
        {hasSocial && (
          <div className="modal-social">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="modal-social-btn btn-linkedin">
                <DynamicIcon name="Linkedin" size={14} /> LINKEDIN
              </a>
            )}

            {member.whatsapp && (
              <div style={{ position: 'relative' }}>
                <button
                  className="modal-social-btn btn-whatsapp"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopup(activePopup === 'whatsapp' ? null : 'whatsapp');
                  }}
                >
                  <DynamicIcon name="MessageSquare" size={14} /> WHATSAPP
                </button>
                {activePopup === 'whatsapp' && (
                  <CopyPopup value={whatsappValue ?? ''} onClose={() => setActivePopup(null)} />
                )}
              </div>
            )}

            {member.instagram && (
              <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="modal-social-btn btn-instagram">
                <DynamicIcon name="Instagram" size={14} /> INSTAGRAM
              </a>
            )}

            {member.email && (
              <div style={{ position: 'relative' }}>
                <button
                  className="modal-social-btn btn-contact"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopup(activePopup === 'email' ? null : 'email');
                  }}
                >
                  <DynamicIcon name="Mail" size={14} /> EMAIL
                </button>
                {activePopup === 'email' && (
                  <CopyPopup value={member.email} onClose={() => setActivePopup(null)} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Export: renders via Portal so parent containers never clip it ──
export default function TeamMemberModal({ member, onClose }: TeamMemberModalProps): ReactNode {
  if (!member) return null;
  return createPortal(
    <ModalContent member={member} onClose={onClose} />,
    document.body
  );
}

