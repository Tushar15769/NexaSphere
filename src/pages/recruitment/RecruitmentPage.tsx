import { useEffect, useMemo, useRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { IconArrowLeft, IconArrowRight, IconBolt, IconShieldCheck, IconUsers } from '../../shared/Icons';

function DynamicIcon({ name, ...props }) {
  const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
  return <Icon {...props} />;
}

const WHATSAPP_SCREENING = 'https://chat.whatsapp.com/Jjc5cuUKENu0RC1vWSEs20';
const LINKEDIN_PAGE      = 'https://www.linkedin.com/showcase/glbajaj-nexasphere/';

const COURSE_OPTIONS  = ['B-Tech', 'MBA', 'Other'];
const BRANCH_OPTIONS  = [
  'Computer Science Engineering (CSE)',
  'Computer Science (CS)',
  'Information Technology (IT)',
  'AI & Machine Learning (AIML)',
  'Computer Science & Design (CSD)',
  'MBA',
  'Other',
];
const SECTION_OPTIONS  = ['A', 'B', 'C', 'D', 'E', 'F', 'Other'];
const SEMESTER_OPTIONS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const DOMAIN_OPTIONS   = [
  'Technical (Web/App/Cloud/AI/Cyber)',
  'Management & Operations',
  'Public Relations & Outreach',
  'Design & Creative Media',
  'Editorial & Content',
];

const RECRUITMENT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzQpMhZ0P9tN8B9vS9mU1l_Z5o0JvXvft8ezD9sJdvjV3kf-VHm1l_mImHRDUAEqsilK0wb5QBD5GOkixwe/exec';

function clamp(n: number, min: number, max: number): number { return Math.max(min, Math.min(max, n)); }

function Field({ label, required, hint, children }: FieldProps): ReactNode {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{
          fontFamily: 'Orbitron,monospace',
          fontSize: '.72rem',
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--t1)',
        }}>
          {label}{required ? <span style={{ color: 'var(--c4)', marginLeft: 6 }}>*</span> : null}
        </div>
        {hint ? <div style={{ color: 'var(--t3)', fontSize: '.82rem' }}>{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', maxLength, inputMode: inputModeProp, onPaste }: InputProps): ReactNode {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      onPaste={onPaste}
      placeholder={placeholder}
      type={type}
      maxLength={maxLength}
      inputMode={inputModeProp || (type === 'tel' ? 'numeric' : undefined)}
      style={{
        width: '100%',
        padding: '12px 14px',
        background: 'var(--card2)',
        border: '1px solid var(--bdr2)',
        borderRadius: 'var(--r2)',
        color: 'var(--t1)',
        fontFamily: 'Rajdhani,sans-serif',
        fontSize: '.98rem',
        outline: 'none',
        boxSizing: 'border-box',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--c1b)'; e.target.style.boxShadow = 'var(--sh1)'; }}
      onBlur={e  => { e.target.style.borderColor = 'var(--bdr2)';  e.target.style.boxShadow = 'none'; }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 5 }: TextAreaProps): ReactNode {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '12px 14px',
        background: 'var(--card2)',
        border: '1px solid var(--bdr2)',
        borderRadius: 'var(--r2)',
        color: 'var(--t1)',
        fontFamily: 'Rajdhani,sans-serif',
        fontSize: '.98rem',
        outline: 'none',
        resize: 'vertical',
        boxSizing: 'border-box',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--c1b)'; e.target.style.boxShadow = 'var(--sh1)'; }}
      onBlur={e  => { e.target.style.borderColor = 'var(--bdr2)';  e.target.style.boxShadow = 'none'; }}
    />
  );
}

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23CC1111' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`;

function StyledSelect({ value, onChange, children, placeholder }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px 14px',
        background: 'var(--card2)',
        border: '1px solid var(--bdr2)',
        borderRadius: 'var(--r2)',
        color: value ? 'var(--t1)' : 'var(--t3)',
        fontFamily: 'Rajdhani,sans-serif',
        fontSize: '.98rem',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage: SELECT_ARROW,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: '36px',
        boxSizing: 'border-box',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--c1b)'; e.target.style.boxShadow = 'var(--sh1)'; }}
      onBlur={e  => { e.target.style.borderColor = 'var(--bdr2)';  e.target.style.boxShadow = 'none'; }}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {children}
    </select>
  );
}

function PillRadio({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {options.map((opt: string) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="btn btn-outline btn-sm"
            style={{
              background:   active ? 'linear-gradient(135deg,var(--c1),var(--c2))' : undefined,
              color:        active ? '#fff' : undefined,
              borderColor:  active ? 'transparent' : undefined,
              boxShadow:    active ? '0 0 18px var(--c1g)' : undefined,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function RecruitmentPage({ onBack }) {
  const [step, setStep]   = useState(0); 
  const [busy, setBusy]   = useState(false);
  const [done, setDone]   = useState(false);
  const [err,  setErr]    = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const topRef = useRef(null);

  
  useEffect(() => {
    try {
      const submitted = JSON.parse(localStorage.getItem('ns_applied_emails') || '[]');
      if (submitted.length > 0) setAlreadySubmitted(true);
    } catch { /* ignore */ }
  }, []);

  const [form, setForm] = useState({
    
    fullName:     '',
    collegeEmail: '',
    rollNumber:   '',
    course:       '',
    courseOther:  '',
    branch:       '',
    branchOther:  '',
    section:      '',
    sectionOther: '',
    semester:     '',
    whatsapp:     '',
    
    domain:       '',
    motivation:   '',
    experience:   '',
    commitment:   '',
    
    linkedin:     '',
    github:       '',
    portfolio:    '',
  });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  
  const missingRequired = useMemo(() => {
    const missing = [];
    
    if (step === 1) {
      if (!form.fullName.trim())     missing.push('fullName');
      if (!form.collegeEmail.trim()) missing.push('collegeEmail');
      if (!form.rollNumber.trim())   missing.push('rollNumber');
      if (!form.course)              missing.push('course');
      if (form.course === 'Other' && !form.courseOther.trim()) missing.push('courseOther');
      if (!form.branch)              missing.push('branch');
      if (form.branch === 'Other' && !form.branchOther.trim()) missing.push('branchOther');
      if (!form.section)             missing.push('section');
      if (form.section === 'Other' && !form.sectionOther.trim()) missing.push('sectionOther');
      if (!form.semester)            missing.push('semester');
      const phone = String(form.whatsapp || '').trim();
      if (!phone || !/^\d{10}$/.test(phone)) missing.push('whatsapp');
      
      const email = form.collegeEmail.trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push('collegeEmail');
    }
    if (step === 2) {
      if (!form.domain)             missing.push('domain');
      if (!form.motivation.trim())   missing.push('motivation');
    }
    if (step === 3) {
      if (!form.experience.trim())   missing.push('experience');
    }
    if (step === 4) {
      if (!form.commitment)          missing.push('commitment');
    }
    return missing;
  }, [form, step]);

  const canNext = missingRequired.length === 0;

  function scrollTop(): void {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  
  async function submit() {
    setErr('');
    setBusy(true);
    try {
      const emailKey = String(form.whatsapp || '').trim(); 
      try {
        const existing = JSON.parse(localStorage.getItem('ns_applied_emails') || '[]');
        if (existing.includes(emailKey)) {
          setErr('An application has already been submitted from this number. Each applicant may submit only once.');
          setBusy(false);
          return;
        }
      } catch { /* ignore */ }

      const payload = {
        fullName:     form.fullName.trim(),
        collegeEmail: form.collegeEmail.trim().toLowerCase(),
        rollNumber:   form.rollNumber.trim(),
        course:       form.course === 'Other' ? (form.courseOther.trim() || 'Other') : form.course,
        branch:       form.branch === 'Other' ? (form.branchOther.trim() || 'Other') : form.branch,
        section:      form.section === 'Other' ? form.sectionOther : form.section,
        semester:     form.semester,
        whatsapp:     form.whatsapp,
        domain:       form.domain,
        motivation:   form.motivation.trim(),
        experience:   form.experience.trim(),
        commitment:   form.commitment,
        linkedin:     form.linkedin.trim(),
        github:       form.github.trim(),
        portfolio:    form.portfolio.trim(),
        submittedAt:  new Date().toISOString(),
        userAgent:    navigator.userAgent,
        formType:     'recruitment',
      };

      const res = await fetch(RECRUITMENT_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!res.ok || (data && data.ok === false)) {
        throw new Error(data?.error || 'Submission failed');
      }

      
      try {
        const existing = JSON.parse(localStorage.getItem('ns_applied_emails') || '[]');
        existing.push(emailKey);
        localStorage.setItem('ns_applied_emails', JSON.stringify(existing));
      } catch { /* ignore */ }

      setDone(true);
      scrollTop();
    } catch (e) {
      setErr(getErrorMessage(e, 'Something went wrong. Please try again.'));
    } finally {
      setBusy(false);
    }
  }

  
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fired'); obs.unobserve(e.target); }
      });
    }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('#pg-apply .pop-flip, #pg-apply .pop-in, #pg-apply .pop-word, #pg-apply .pop-scale')
      .forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [step]);

  
  const steps = useMemo(() => [
    
    {
      title:    'About NexaSphere',
      subtitle: 'NexaSphere Core Team Recruitment — 2026',
      icon:     <IconBolt style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
             <div style={{
            background: 'rgba(255,180,0,.08)',
            border: '1px solid rgba(255,180,0,.32)',
            borderRadius: 'var(--r3)',
            padding: '14px 18px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <DynamicIcon name="AlertTriangle" size={24} style={{ color: 'var(--c4)', flexShrink: 0 }} />
            <div style={{ lineHeight: 1.75 }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '.75rem', letterSpacing: '.1em', color: 'var(--t1)', marginBottom: 6, textTransform: 'uppercase' }}>
                Important — Read Before Proceeding
              </div>
              <div style={{ fontSize: '.9rem', color: 'var(--t2)' }}>
                This application form can be filled <b style={{ color: 'var(--t1)' }}>only once</b> per device.
                Please <b style={{ color: 'var(--t1)' }}>read every question carefully</b> and
                <b style={{ color: 'var(--t1)' }}> verify all your details</b> before submitting.
                Once submitted, you will not be able to edit your response.
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--t2)', lineHeight: 1.8, fontSize: '.96rem' }}>
            We are building the <b style={{ color: 'var(--t1)' }}>Core Team for NexaSphere</b> — the central tech
            community that brings together GDG On Campus activities, cloud programs, workshops, hackathons,
            and multi-domain learning on campus.
          </p>

          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--bdr)',
            borderRadius: 'var(--r3)',
            padding: 18,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div className="corner-tl"/><div className="corner-br"/>
            <div style={{
              fontFamily: 'Space Mono,monospace', fontSize: '.65rem',
              color: 'var(--t3)', letterSpacing: '.22em',
              textTransform: 'uppercase', marginBottom: 10,
            }}>Important notes</div>
            <ul style={{ paddingLeft: 18, display: 'grid', gap: 8, color: 'var(--t2)', fontSize: '.92rem' }}>
              <li>By filling this form, you are committing <b>4–6 hours/week</b> to NexaSphere activities.</li>
              <li>Attendance support will be provided for <b>Core Team members</b> only for official events.</li>
              <li>You will get to work directly with faculty, industry experts, and student leaders.</li>
              <li>Certificates and official recognitions will be awarded based on performance.</li>
            </ul>
          </div>

          <div style={{
            background: 'linear-gradient(135deg,rgba(0,119,181,.10),rgba(0,212,255,.05))',
            border: '1px solid rgba(0,119,181,.24)',
            borderRadius: 'var(--r2)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}>
            <DynamicIcon name="Link" size={18} style={{ color: '#0077b5' }} />
            <span style={{ fontSize: '.88rem', color: 'var(--t2)', flex: 1 }}>
              Before applying, please follow our official LinkedIn page for updates:
            </span>
            <a
              href={LINKEDIN_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ textTransform: 'none', letterSpacing: 0, fontSize: '.82rem' }}
            >Follow on LinkedIn</a>
          </div>
        </div>
      ),
    },
    
    {
      title:    'Personal Details',
      subtitle: 'Step 2: Basic Information',
      icon:     <IconUsers style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
          <Field label="Full Name" required>
            <Input
              value={form.fullName}
              onChange={v => set('fullName', v.replace(/[^a-zA-Z\s.\-']/g, ''))}
              placeholder="Your full name"
              maxLength={60}
            />
          </Field>

          <Field label="College Email ID" required hint="Use your official college email">
            <Input
              value={form.collegeEmail}
              onChange={v => set('collegeEmail', v.trim().toLowerCase())}
              placeholder="yourname@glbajajgroup.org"
              type="email"
              maxLength={100}
            />
          </Field>

          <Field label="University Roll Number" required>
            <Input
              value={form.rollNumber}
              onChange={v => set('rollNumber', v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15))}
              placeholder="e.g. 2301234"
              maxLength={15}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
            <Field label="Course" required>
              <div style={{ display: 'grid', gap: 8 }}>
                <StyledSelect value={form.course} onChange={v => set('course', v)} placeholder="Select course">
                  {COURSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </StyledSelect>
                {form.course === 'Other' && (
                  <Input
                    value={form.courseOther}
                    onChange={v => set('courseOther', v.replace(/[^a-zA-Z0-9\s\-&().]/g, ''))}
                    placeholder="Specify your course"
                    maxLength={60}
                  />
                )}
              </div>
            </Field>

            <Field label="Branch / Department" required>
              <div style={{ display: 'grid', gap: 8 }}>
                <StyledSelect value={form.branch} onChange={v => set('branch', v)} placeholder="Select branch">
                  {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </StyledSelect>
                {form.branch === 'Other' && (
                  <Input
                    value={form.branchOther}
                    onChange={v => set('branchOther', v.replace(/[^a-zA-Z0-9\s\-&().]/g, ''))}
                    placeholder="Specify your branch"
                    maxLength={60}
                  />
                )}
              </div>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
            <Field label="Section" required hint="Academic Section (A/B/C/...)">
              <StyledSelect value={form.section} onChange={v => set('section', v)} placeholder="-- Select Section --">
                {SECTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </StyledSelect>
              {form.section === 'Other' && (
                <div style={{ marginTop: 10 }}>
                  <Input
                    value={form.sectionOther}
                    onChange={v => set('sectionOther', v)}
                    placeholder="Type your section manually..."
                  />
                </div>
              )}
            </Field>

            <Field label="Semester" required>
              <StyledSelect value={form.semester} onChange={v => set('semester', v)} placeholder="Select semester">
                {SEMESTER_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </StyledSelect>
            </Field>
          </div>

          <Field label="WhatsApp Number" required hint="10-digit mobile number">
            <Input
              value={form.whatsapp}
              onChange={v => set('whatsapp', String(v || '').replace(/[^\d]/g, '').slice(0, 10))}
              onPaste={e => {
                e.preventDefault();
                const pasted = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 10);
                set('whatsapp', pasted);
              }}
              placeholder="10-digit mobile number"
              type="tel"
              inputMode="numeric"
              maxLength={10}
            />
          </Field>
        </div>
      ),
    },
    
    {
      title:    'Domain & Interest',
      subtitle: 'Step 3: Tell us about your interests',
      icon:     <IconBolt style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 20 }}>
          <Field label="Primary Domain of Interest" required hint="The area you're most passionate about">
            <StyledSelect value={form.domain} onChange={v => set('domain', v)} placeholder="Select a domain">
              {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </StyledSelect>
          </Field>

          <Field label="Why do you want to join the NexaSphere Core Team?" required>
            <TextArea
              value={form.motivation}
              onChange={v => set('motivation', v)}
              placeholder="Explain your motivation and what makes you a good fit."
              rows={6}
            />
          </Field>
        </div>
      ),
    },
    
    {
      title:    'Experience & Skills',
      subtitle: 'Step 4: Show us what you can do',
      icon:     <IconBolt style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 20 }}>
          <Field label="Past Experience / Relevant Skills" required hint="Projects, workshops, clubs, etc.">
            <TextArea
              value={form.experience}
              onChange={v => set('experience', v)}
              placeholder="List your previous experience, projects, or any skills relevant to your chosen domain."
              rows={8}
            />
          </Field>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <Field label="LinkedIn Profile (Optional)">
              <Input
                value={form.linkedin}
                onChange={v => set('linkedin', v.trim())}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
            <Field label="GitHub Profile (Optional)">
              <Input
                value={form.github}
                onChange={v => set('github', v.trim())}
                placeholder="https://github.com/..."
              />
            </Field>
          </div>
          <Field label="Portfolio / Project Links (Optional)">
            <Input
              value={form.portfolio}
              onChange={v => set('portfolio', v.trim())}
              placeholder="Link to your best work or portfolio"
            />
          </Field>
        </div>
      ),
    },
    
    {
      title:    'Final Commitment',
      subtitle: 'Step 5: Almost there!',
      icon:     <IconBolt style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 20 }}>
          <Field label="Can you commit 4–6 hours/week to NexaSphere activities?" required>
            <PillRadio
              options={['Yes, absolutely', 'I will try my best', 'Not sure yet']}
              value={form.commitment}
              onChange={v => set('commitment', v)}
            />
          </Field>
          
          <div style={{
            background: 'rgba(255,180,0,.08)',
            border: '1px solid rgba(255,180,0,.32)',
            borderRadius: 'var(--r3)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <DynamicIcon name="PartyPopper" size={32} style={{ color: 'var(--c3)', marginBottom: 12, display: 'inline-block' }} />
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '.85rem', color: 'var(--t1)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
              Final Submission
            </div>
            <p style={{ color: 'var(--t2)', fontSize: '.9rem', lineHeight: 1.6, margin: 0 }}>
              By clicking submit, you confirm that all information provided is accurate.
              Shortlisted candidates will be contacted for further rounds.
            </p>
          </div>
        </div>
      ),
    },
  ], [form]);

  const current  = steps[step];
  const progress = step / (steps.length - 1);

  
  return (
    <div id="pg-apply" ref={topRef}>
      <style>{`
        .apply-hero { text-align:center; padding:64px 24px 46px; position:relative; }
        .apply-hero-bg {
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 60% 55% at 50% 0%, rgba(123,111,255,.10) 0%, transparent 62%),
            radial-gradient(ellipse 40% 40% at 20% 85%, rgba(0,212,255,.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 80% 70%, rgba(189,92,255,.05) 0%, transparent 55%);
        }
        [data-theme="light"] .apply-hero-bg {
          background:
            radial-gradient(ellipse 60% 55% at 50% 0%, rgba(109,40,217,.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 85%, rgba(194,119,10,.04) 0%, transparent 55%);
        }
        .apply-divider {
          width:100%; height:1px;
          background:linear-gradient(90deg,transparent,var(--c2) 18%,var(--c1) 50%,var(--c3) 82%,transparent);
          opacity:.18; margin:0 auto;
        }
        .apply-shell {
          max-width:860px; margin:0 auto;
          background:var(--card); border:1px solid var(--bdr);
          border-radius:var(--r4); overflow:hidden;
          position:relative; box-shadow:var(--shcard);
        }
        [data-theme="light"] .apply-shell {
          background:#fff; border-color:rgba(28,25,23,.1);
          box-shadow:0 8px 44px rgba(0,0,0,.10);
        }
        .apply-topbar {
          padding:18px 18px 14px; border-bottom:1px solid var(--bdr);
          background:linear-gradient(180deg,rgba(123,111,255,.04),transparent);
        }
        [data-theme="light"] .apply-topbar { background:linear-gradient(180deg,rgba(109,40,217,.03),transparent); }
        .apply-progress {
          height:8px; background:rgba(255,255,255,.04);
          border:1px solid var(--bdr); border-radius:999px; overflow:hidden;
        }
        [data-theme="light"] .apply-progress { background:rgba(28,25,23,.04); }
        .apply-progress > div {
          height:100%; width:0%;
          background:linear-gradient(90deg,var(--c2),var(--c1),var(--c3));
          box-shadow:0 0 18px var(--c1g);
          transition:width .35s cubic-bezier(.22,1,.36,1);
        }
        .apply-body { padding:22px 18px 18px; }
        @media (min-width:720px){
          .apply-body  { padding:26px 26px 22px; }
          .apply-topbar{ padding:18px 26px 14px; }
        }
      `}</style>

      
      <div className="apply-hero">
        <div className="apply-hero-bg"/>
        {onBack ? (
          <button
            onClick={onBack}
            className="btn btn-outline btn-sm"
            style={{ position:'absolute', top:24, left:24 }}
          >
            <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
              <IconArrowLeft style={{ width:14, height:14 }}/> Back
            </span>
          </button>
        ) : null}

        <div className="pop-in" style={{
          display:'inline-block',
          background:'linear-gradient(135deg,var(--c2),var(--c3))',
          borderRadius:999, padding:'7px 22px',
          fontFamily:'Orbitron,monospace', fontSize:'.85rem',
          fontWeight:700, letterSpacing:'.1em',
          color:'#fff', textTransform:'uppercase',
          boxShadow:'0 0 24px rgba(123,111,255,.4)',
          marginBottom:16,
        }}>
          Recruitment Open
        </div>

        <h1 className="section-title pop-word" style={{ marginBottom:14 }}>
          Join Core Team 2026
        </h1>
        <p className="pop-in" style={{
          color:'var(--t2)',
          fontSize:'clamp(.9rem,2vw,1.08rem)',
          maxWidth:660, margin:'0 auto',
          lineHeight:1.75, animationDelay:'.12s',
        }}>
          Apply to be a part of the central tech community at GL Bajaj Group of Institutions.
          We're looking for passionate developers, managers, and designers.
        </p>
        <div className="apply-divider" style={{ marginTop:34, maxWidth:780 }}/>
      </div>

      <div className="container" style={{ paddingBottom:86 }}>
        <div className="apply-shell pop-scale">
          <div className="corner-tl"/><div className="corner-br"/>

          
          <div className="apply-topbar">
            <div style={{
              display:'flex', justifyContent:'space-between',
              alignItems:'center', gap:14, flexWrap:'wrap', marginBottom:12,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{
                  width:44, height:44, borderRadius:14,
                  background:'linear-gradient(135deg,rgba(123,111,255,.25),rgba(0,212,255,.15))',
                  border:'1px solid var(--bdr2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 0 20px rgba(123,111,255,.12)',
                  fontSize:'1.25rem',
                }}>
                  {done ? <IconShieldCheck style={{ width:18, height:18 }}/> : current.icon}
                </div>
                <div>
                  <div style={{
                    fontFamily:'Orbitron,monospace', fontSize:'.9rem',
                    letterSpacing:'.08em', color:'var(--t1)',
                    display:'flex', gap:10, alignItems:'baseline', flexWrap:'wrap',
                  }}>
                    <span>{done ? 'Application Complete' : current.title}</span>
                    {!done ? (
                      <span style={{ fontFamily:'Space Mono,monospace', fontSize:'.62rem', letterSpacing:'.18em', color:'var(--t3)' }}>
                        STEP {step + 1}/{steps.length}
                      </span>
                    ) : null}
                  </div>
                  <div style={{ color:'var(--t2)', fontSize:'.9rem' }}>
                    {done
                      ? 'Your application has been received successfully.'
                      : current.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'.62rem', letterSpacing:'.14em', color:'var(--t3)', textTransform:'uppercase', textAlign:'right' }}>
                {done ? 'Form Submitted' : `Step ${step + 1} of ${steps.length}`}
              </div>
            </div>

            <div className="apply-progress">
              <div style={{ width: `${Math.round(progress * 100)}%` }}/>
            </div>
          </div>

          <div className="apply-body">
            {alreadySubmitted && !done ? (
              <div style={{
                background: 'rgba(255,45,120,.08)',
                border: '1px solid rgba(255,45,120,.22)',
                borderRadius: 'var(--r3)',
                padding: '20px 22px',
                textAlign: 'center',
              }}>
                <div style={{ color: 'var(--c4)', fontSize: '2.4rem', marginBottom: 10, display: 'flex', justifyContent: 'center' }}><DynamicIcon name="AlertTriangle" size={48} /></div>
                <div style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '1rem', marginBottom: 12 }}>Application Already Submitted</div>
                <div style={{ color: 'var(--t2)', fontSize: '.88rem', lineHeight: 1.65, marginBottom: 24 }}>
                  An application form has already been submitted from this device.<br/>
                  If you believe this is an error, please <strong>contact NexaSphere team directly</strong>.
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a
                    href={WHATSAPP_SCREENING}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
                  >
                    Join WhatsApp Group
                  </a>
                  <a
                    href={LINKEDIN_PAGE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
                  >
                    Follow on LinkedIn
                  </a>
                </div>
              </div>
            ) : done ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(34,197,94,.12)',
                  border: '1px solid rgba(34,197,94,.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', color: '#22c55e',
                }}>
                  <DynamicIcon name="Check" size={40} />
                </div>
                <h2 style={{ fontFamily: 'Orbitron,monospace', fontSize: '1.4rem', fontWeight: 700, color: 'var(--t1)', marginBottom: 14 }}>Application Received!</h2>
                <p style={{ color: 'var(--t2)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 32px' }}>
                  Thank you for applying to the NexaSphere Core Team. Our selection committee will review your application soon.
                </p>
                <div style={{
                  background: 'var(--card2)',
                  border: '1px solid var(--bdr2)',
                  borderRadius: 'var(--r3)',
                  padding: '24px',
                  maxWidth: 540,
                  margin: '0 auto 32px',
                  textAlign: 'left',
                }}>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '.75rem', color: 'var(--c1)', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.1em' }}>What's next?</div>
                  <ul style={{ paddingLeft: 18, color: 'var(--t2)', fontSize: '.92rem', display: 'grid', gap: 10 }}>
                    <li>Join the applicant WhatsApp group for immediate updates.</li>
                    <li>Wait for the initial screening results (check your email).</li>
                    <li>Prepare for a brief interaction/interview round if shortlisted.</li>
                  </ul>
                </div>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={WHATSAPP_SCREENING} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-ripple">Join WhatsApp</a>
                  <button onClick={onBack} className="btn btn-outline">Back to Home</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 32 }}>
                <div className="form-step-content" style={{ minHeight: 300 }}>
                  {current.render()}
                </div>
                
                {err && (
                  <div style={{
                    padding: '12px 16px', borderRadius: '8px',
                    background: 'rgba(255,45,120,.1)',
                    border: '1px solid rgba(255,45,120,.2)',
                    color: 'var(--c4)', fontSize: '.9rem', textAlign: 'center',
                  }}>
                    {err}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center', borderTop: '1px solid var(--bdr)', paddingTop: 26 }}>
                  <button
                    onClick={() => { setStep(s => s - 1); scrollTop(); }}
                    disabled={step === 0 || busy}
                    className="btn btn-outline"
                    style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}
                  >
                    Previous
                  </button>
                  <div style={{ flex: 1 }} />
                  {step < steps.length - 1 ? (
                    <button
                      onClick={() => { setStep(s => s + 1); scrollTop(); }}
                      disabled={!canNext}
                      className="btn btn-primary"
                      style={{ padding: '12px 32px', minWidth: 140 }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        Continue <IconArrowRight style={{ width: 16, height: 16 }} />
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      disabled={busy || !canNext}
                      className="btn btn-primary"
                      style={{ padding: '12px 40px', minWidth: 160, background: 'linear-gradient(135deg,var(--c1),var(--c2))', border: 'none' }}
                    >
                      {busy ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
