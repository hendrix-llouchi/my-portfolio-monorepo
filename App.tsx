import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './index.css';
import { PROFILE_INFO, EXPERIENCES, PROJECTS, CONTACT_INFO, SKILLS } from './constants';
import { HERO_PHOTO } from './photo';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="nav-name" href="#top">HENRY COBBINAH</a>
        <div className="nav-links">
          <a href="#about">ABOUT</a>
          <a href="#experience">EXPERIENCE</a>
          <a href="#work">WORK</a>
          <a href="#contact">CONTACT</a>
        </div>
      </div>
    </nav>
  );
}

function Badge() {
  return (
    <div className="badge" aria-hidden>
      <svg className="ring" viewBox="0 0 120 120">
        <defs>
          <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text style={{ fontSize: '10px', letterSpacing: '2.4px', fontWeight: 600, fontFamily: 'Inter, sans-serif', fill: '#161513' }}>
          <textPath href="#badge-circle" textLength="276" lengthAdjust="spacingAndGlyphs">AVAILABLE FOR PROJECTS ·</textPath>
        </text>
      </svg>
      <svg className="core-mark" viewBox="0 0 24 24" width="26" height="26" aria-hidden>
        <g stroke="#161513" strokeWidth="2.2" strokeLinecap="round">
          <line x1="12" y1="3.5" x2="12" y2="20.5" />
          <line x1="3.5" y1="12" x2="20.5" y2="12" />
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </g>
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-left">
        <motion.div className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <span>SOFTWARE ENGINEER</span>
          <span>BASED IN ACCRA, GHANA</span>
        </motion.div>
        <div className="hero-masthead">
          <motion.div className="hero-name" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>
            HENRY COBBINAH
          </motion.div>
          <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}>
            PORT<br />FOLIO
          </motion.h1>
          <motion.div className="hero-tag" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}>
            CLEAN CODE. INTELLIGENT SYSTEMS.
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
            <a className="btn" href="#work">
              VIEW WORK <span className="arr">→</span>
            </a>
          </motion.div>
        </div>
        <motion.div className="hero-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.85 }}>
          <span>PORTFOLIO © 2026</span>
          <span>SCROLL FOR MORE</span>
        </motion.div>
      </div>
      <div className="hero-right">
        <img src={HERO_PHOTO} alt="Henry Cobbinah" />
        <Badge />
      </div>
    </header>
  );
}

function About() {
  return (
    <section className="block" id="about">
      <div className="wrap">
        <motion.div {...fadeUp}>
          <div className="sec-label"><span className="num">02</span><span>ABOUT</span></div>
          <div className="rule" />
          <h2 className="sec-title">About</h2>
        </motion.div>
        <motion.p className="about-statement" {...fadeUp}>
          I build clean, intelligent software — from farm-market platforms to AI tooling — out of Accra, Ghana.
        </motion.p>
        <div className="about-grid">
          <motion.div className="about-bio" {...fadeUp}>
            <p>{PROFILE_INFO.aboutParagraphs[0]}</p>
            <p className="dim">{PROFILE_INFO.aboutParagraphs[1]}</p>
          </motion.div>
          <motion.div {...fadeUp}>
            <div className="fact">
              <div className="fact-k">BASED IN</div>
              <div className="fact-v">{CONTACT_INFO.location}</div>
            </div>
            <div className="fact">
              <div className="fact-k">FOCUS</div>
              <div className="fact-v">Full-Stack · Mobile · AI</div>
            </div>
            <div className="fact">
              <div className="fact-k">STACK</div>
              <div className="fact-v">React · TypeScript · Vue · Laravel · Python</div>
            </div>
            <div className="fact">
              <div className="fact-k">STATUS</div>
              <div className="fact-v">Open to projects</div>
            </div>
          </motion.div>
        </div>
        <motion.div className="skills-strip" {...fadeUp}>
          {SKILLS.map((s) => s.name.toUpperCase()).join(' · ')}
        </motion.div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="block" id="experience">
      <div className="wrap">
        <motion.div {...fadeUp}>
          <div className="sec-label"><span className="num">03</span><span>EXPERIENCE</span></div>
          <div className="rule" />
          <h2 className="sec-title">Experience</h2>
          <p className="sec-sub">WHERE I'VE WORKED &amp; WHAT I SHIPPED.</p>
        </motion.div>
        <div style={{ marginTop: '3rem' }}>
          {EXPERIENCES.map((exp) => (
            <motion.div className="exp-row" key={exp.id} {...fadeUp}>
              <div className="exp-period">{exp.period}</div>
              <div>
                <div className="exp-role">{exp.role}</div>
                <div className="exp-co">
                  {exp.company.toUpperCase()} · {exp.type?.toUpperCase()}
                  {exp.location ? ` · ${exp.location.toUpperCase()}` : ''}
                </div>
                <p className="exp-desc">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p className="exp-note" {...fadeUp}>FULL RÉSUMÉ ON REQUEST — JUST ASK.</motion.p>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="block" id="work">
      <div className="wrap">
        <motion.div {...fadeUp}>
          <div className="sec-label"><span className="num">04</span><span>SELECTED WORK</span></div>
          <div className="rule" />
          <h2 className="sec-title">Work</h2>
          <p className="sec-sub">A FEW THINGS I'VE BUILT &amp; SHIPPED.</p>
        </motion.div>
        <div style={{ marginTop: '3rem' }}>
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.id}
              className="work-row"
              href={p.repo_link || CONTACT_INFO.github}
              target="_blank"
              rel="noreferrer"
              {...fadeUp}
            >
              <span className="work-idx">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="work-name">{p.title}</div>
                <p className="work-desc">{p.description}</p>
                <div className="work-meta">{(p.tech_stack || []).join(' · ').toUpperCase()}</div>
              </div>
              <span className="work-year">{p.year}</span>
              <span className="work-arrow"><ArrowUpRight size={30} strokeWidth={1.5} /></span>
            </motion.a>
          ))}
        </div>
        <motion.div className="work-more" {...fadeUp}>
          <a className="btn" href={CONTACT_INFO.github} target="_blank" rel="noreferrer">
            VIEW ALL ON GITHUB <span className="arr">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status !== 'idle') setStatus('idle');
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
      setStatus('ok');
      return;
    }
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name,
          email: form.email,
          message: form.message,
          from_name: 'Portfolio Contact Form',
          subject: `New portfolio message from ${form.name}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('ok');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('err');
      }
    } catch {
      setStatus('err');
    }
  };

  return (
    <section className="block" id="contact">
      <div className="wrap">
        <motion.div {...fadeUp}>
          <div className="sec-label"><span className="num">05</span><span>CONTACT</span></div>
          <div className="rule" />
          <h2 className="sec-title">Contact</h2>
        </motion.div>
        <motion.p className="contact-statement" {...fadeUp}>
          Have a project in mind? My inbox is always open.
        </motion.p>
        <motion.div {...fadeUp}>
          <a className="contact-email" href={`mailto:${CONTACT_INFO.email}`}>
            {CONTACT_INFO.email} ↗
          </a>
        </motion.div>
        <motion.form className="contact-form" onSubmit={onSubmit} {...fadeUp}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="cf-name">YOUR NAME</label>
              <input id="cf-name" name="name" value={form.name} onChange={onChange} required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="cf-email">EMAIL</label>
              <input id="cf-email" name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="cf-msg">MESSAGE</label>
            <textarea id="cf-msg" name="message" value={form.message} onChange={onChange} required />
          </div>
          <button className="btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'SENDING…' : 'SEND MESSAGE'} <span className="arr">→</span>
          </button>
          {status === 'ok' && <p className="form-msg ok">Message on its way — I'll get back to you soon.</p>}
          {status === 'err' && <p className="form-msg err">Something went wrong. Try the email link above instead.</p>}
        </motion.form>
        <footer className="footer">
          <div className="footer-row">
            <div className="footer-links">
              <a href={CONTACT_INFO.github} target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={14} /></a>
              <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={14} /></a>
            </div>
            <div className="footer-loc">{CONTACT_INFO.location.toUpperCase()}</div>
          </div>
          <div className="footer-base">© 2026 HENRY COBBINAH — DESIGNED &amp; BUILT WITH CARE.</div>
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Work />
      <Contact />
    </>
  );
}
