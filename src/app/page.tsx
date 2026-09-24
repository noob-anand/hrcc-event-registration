'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { RegistrationRecord } from '@/lib/utils';
import { Terminal, Code, Cpu, Layers, User, Hash, Phone, Mail, GraduationCap, Calendar, Download, RefreshCw, AlertTriangle, Mic, ExternalLink, Sparkles, BookOpen, Compass, Flame } from 'lucide-react';

const DEGREES = ['B.Tech', 'M.Tech', 'MCA'];

const getAvailableYears = (degree: string) => {
  if (['M.Tech', 'MCA'].includes(degree)) {
    return ['1st Year', '2nd Year', '3rd Year'];
  }
  return ['2nd Year', '3rd Year', '4th Year'];
};

export default function Home() {
  const [confirmedRecord, setConfirmedRecord] = useState<RegistrationRecord | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    scholar_number: '',
    phone: '',
    email: '',
    degree: 'B.Tech',
    branch: '',
    year: '2nd Year',
  });

  const [formErr, setFormErr] = useState('');
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available year options dynamically calculated based on selected degree
  const availableYears = getAvailableYears(formData.degree);

  // Compute session track dynamically by student year
  const computedTrack = ['3rd Year', '4th Year'].includes(formData.year)
    ? 'Placement & Internship Session (3rd & 4th Year)'
    : 'Roadmap for DSA & Development (1st & 2nd Year)';

  // Real-time duplicate scholar check
  useEffect(() => {
    const scholar = formData.scholar_number.trim();
    if (scholar.length < 4) {
      setDuplicateAlert(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-scholar?scholar=${encodeURIComponent(scholar)}`);
        const data = await res.json();
        if (data.exists) {
          setDuplicateAlert(data.message || `REGISTRATION ALREADY EXISTS: Scholar Number ${scholar.toUpperCase()} is already registered.`);
        } else {
          setDuplicateAlert(null);
        }
      } catch (err) {
        // Silent
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.scholar_number]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'degree') {
      const validYears = getAvailableYears(value);
      setFormData(prev => ({
        ...prev,
        degree: value,
        year: validYears.includes(prev.year) ? prev.year : validYears[0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (formErr) setFormErr('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');

    if (!formData.name.trim() || !formData.scholar_number.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.branch.trim() || !formData.year) {
      setFormErr('Please complete every required field.');
      return;
    }

    if (duplicateAlert) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          registration_type: computedTrack
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.code === 'DUPLICATE_SCHOLAR'
          ? 'REGISTRATION ALREADY EXISTS — this scholar number is already registered.'
          : data.code === 'CAPACITY_REACHED'
            ? 'REGISTRATION CLOSED — capacity reached.'
            : data.code === 'INVALID_EMAIL'
              ? 'Enter a valid email address.'
              : data.code === 'INVALID_PHONE'
                ? 'Enter a valid phone number.'
                : data.code === 'INVALID_SCHOLAR'
                  ? 'Enter a valid scholar number.'
                  : data.message || 'Unable to complete registration. Please retry.';

        setFormErr(msg);
        return;
      }

      setConfirmedRecord(data.record);

      // Celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#05C770', '#73D3FB', '#ffffff']
        });
      } catch (e) { }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setFormErr('NETWORK ERROR — please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg"></div>

      <main className="wrap">
        {/* TOP HEADER BAR */}
        <div className="top">
          <div className="brand flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#05C770]" />
            <span>HACKER<b className="text-[#05C770]">RANK</b> CAMPUS CREW X TNP // IIIT BHOPAL</span>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="hero">
          <div className="meta">SPECIAL GUEST SPEAKER &amp; MASTERCLASS // 25 SEPTEMBER 2026 // FIRST COME FIRST SERVED</div>
          <h1>
            HACKER<span>RANK</span><br />
            CAMPUS <span>CREW</span><br />
            X <span>TNP</span>
          </h1>
          <h2 className="text-lg sm:text-2xl font-black text-[#05C770] font-mono tracking-tight mt-3 uppercase flex items-center gap-2">
            &gt;&gt; ROHIT NEGI &amp; ADITYA TANDON SPEAKER SESSION
          </h2>
          <p className="mt-3">
            An exclusive live masterclass &amp; placement mentorship session with <strong>Rohit Negi</strong> (Founder of <strong>Coder Army</strong>, Ex-Uber, M.Tech IIT Guwahati AIR 202) &amp; <strong>Aditya Tandon</strong> (Co-Founder of <strong>Coder Army</strong>) organized by HackerRank Campus Crew IIIT Bhopal on <strong>25 September 2026</strong>.
          </p>
        </section>

        {/* ROHIT NEGI & ADITYA TANDON SPEAKER PROMOTION & CODER ARMY BANNER */}
        {!confirmedRecord && (
          <div className="speaker-banner">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#05C770]/15 border border-[#05C770]/40 text-[#05C770] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Mic className="w-3 h-3 text-[#05C770]" /> GUEST SPEAKERS &amp; MENTORS
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 text-red-400" /> FIRST COME FIRST SERVED // LIMITED SEATS
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#73D3FB]/15 border border-[#73D3FB]/40 text-[#73D3FB] font-mono text-[10px] font-bold uppercase tracking-wider">
                  FRIDAY, 25 SEPT 2026
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                ROHIT NEGI &amp; ADITYA TANDON // <span className="text-[#05C770]">CODER ARMY</span>
              </h3>

              <div className="space-y-1.5 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                <p>
                  <strong>Rohit Negi:</strong> Founder of <strong>Coder Army</strong>, Ex-Uber Software Engineer, and M.Tech IIT Guwahati topper (GATE AIR 202) who achieved a record-breaking <strong>₹2+ Cr placement package</strong>.
                </p>
                <p>
                  <strong>Aditya Tandon:</strong> Co-Founder of <strong>Coder Army</strong>, tech mentor &amp; educator empowering thousands of engineering students to master software development &amp; placement readiness.
                </p>
              </div>

              {/* YEAR TRACK HIGHLIGHTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
                  <div className="text-[#05C770] font-bold flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> 3rd &amp; 4th YEAR: PLACEMENT &amp; INTERNSHIP SESSION
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
                  <div className="text-[#73D3FB] font-bold flex items-center gap-1.5">
                    <Compass className="w-4 h-4" /> 2nd YEAR: ROADMAP FOR DSA &amp; DEVELOPMENT
                  </div>
                </div>
              </div>

              {/* CODER ARMY PROMOTION LINK */}
              <div className="pt-2">
                <a
                  href="https://coderarmy.in/#home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="insta-badge"
                  style={{ borderColor: 'rgba(5, 199, 112, 0.4)', background: 'rgba(5, 199, 112, 0.1)', color: '#05C770' }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#05C770]" />
                  <span>EXPLORE CODER ARMY PLATFORM (CODERARMY.IN)</span>
                  <ExternalLink className="w-3 h-3 text-[#05C770]" />
                </a>
                <span className="text-[11px] text-gray-400 block mt-1 font-mono">
                  Master coding, interactive DSA courses &amp; placement readiness on India&apos;s leading tech learning platform.
                </span>
              </div>
            </div>

            {/* DUAL SPEAKER PHOTOS IN CIRCLES ON RIGHT */}
            <div className="dual-speaker-wrapper">
              <div className="speaker-card-item">
                <div className="speaker-avatar-circle-sm">
                  <img
                    src="/speaker.png"
                    alt="Rohit Negi - Founder, Coder Army"
                    className="speaker-img"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] text-[#05C770] font-bold">ROHIT NEGI</span>
                <span className="font-mono text-[9px] text-gray-400 uppercase">FOUNDER</span>
              </div>

              <div className="speaker-card-item">
                <div className="speaker-avatar-circle-sm">
                  <img
                    src="/speaker2.png"
                    alt="Aditya Tandon - Co-Founder, Coder Army"
                    className="speaker-img"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] text-[#73D3FB] font-bold">ADITYA TANDON</span>
                <span className="font-mono text-[9px] text-gray-400 uppercase">CO-FOUNDER</span>
              </div>
            </div>
          </div>
        )}

        {/* SINGLE REGISTRATION FORM */}
        {!confirmedRecord && (
          <section id="formWrap" className="form-wrap show mt-8">
            <div className="meta">EVENT REGISTRATION FORM // COMPLETED DETAILS</div>
            <div className="card">
              {duplicateAlert && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{duplicateAlert}</span>
                </div>
              )}

              <form id="regForm" onSubmit={handleSubmit}>
                <div className="form">
                  <div className="field">
                    <label>Full Name *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      autoComplete="name"
                      placeholder="e.g. Anand Sharma"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Scholar Number *</label>
                    <input
                      name="scholar_number"
                      value={formData.scholar_number}
                      onChange={handleInputChange}
                      placeholder="e.g. 230001234"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Phone Number *</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      inputMode="tel"
                      placeholder="e.g. +91 9876543210"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      placeholder="name@student.iiitbhopal.ac.in"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Degree *</label>
                    <select
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      required
                    >
                      {DEGREES.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Branch *</label>
                    <input
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      placeholder="e.g. Computer Science & Engineering"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Year *</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    >
                      {availableYears.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field full">
                    <label>Assigned Session Track (Based on Selected Year) *</label>
                    <input
                      id="selectedType"
                      name="registration_type"
                      value={computedTrack}
                      readOnly
                      style={{ background: 'rgba(5,199,112,0.08)', color: 'var(--g)', fontWeight: 700 }}
                    />
                  </div>
                </div>

                {formErr && <div id="formErr" className="err" style={{ marginTop: '12px' }}>{formErr}</div>}

                <div className="actions">
                  <button className="btn" id="submitBtn" type="submit" disabled={isSubmitting || Boolean(duplicateAlert)}>
                    {isSubmitting ? 'SUBMITTING…' : 'CONFIRM REGISTRATION FOR ROHIT NEGI SESSION'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* SUCCESS CONFIRMATION PASS */}
        {confirmedRecord && (
          <section id="success" className="success show">
            <div className="card confirm">
              <div className="meta">DATABASE STATUS // WRITE COMPLETE</div>
              <h2 style={{ margin: '0 0 10px' }}>REGISTRATION CONFIRMED</h2>
              <p style={{ color: '#aaa' }}>Your seat for Rohit Negi Speaker Session &amp; Masterclass on 25 Sept 2026 has been confirmed in IIIT Bhopal database.</p>

              <div className="rid" id="rid">
                {confirmedRecord.registration_id}
              </div>

              <div className="details">
                <div className="detail">
                  <small>STUDENT</small>
                  <b id="sname">{confirmedRecord.name}</b>
                </div>

                <div className="detail">
                  <small>ASSIGNED TRACK</small>
                  <b id="stype" style={{ color: 'var(--g)' }}>{confirmedRecord.registration_type}</b>
                </div>

                <div className="detail">
                  <small>SCHOLAR NUMBER</small>
                  <b id="sscholar">{confirmedRecord.scholar_number}</b>
                </div>

                <div className="detail">
                  <small>DEGREE, BRANCH &amp; YEAR</small>
                  <b>{confirmedRecord.degree || 'B.Tech'} - {confirmedRecord.branch} ({confirmedRecord.year})</b>
                </div>

                <div className="detail">
                  <small>EVENT &amp; DATE</small>
                  <b style={{ color: '#73D3FB' }}>FRIDAY, 25 SEPT 2026 // ROHIT NEGI</b>
                </div>

                <div className="detail">
                  <small>EMAIL</small>
                  <b className="truncate">{confirmedRecord.email}</b>
                </div>
              </div>

              <div className="actions" style={{ justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
                <button
                  className="btn"
                  type="button"
                  onClick={() => window.print()}
                >
                  PRINT / SAVE PASS
                </button>
                <button
                  className="btn alt"
                  id="homeBtn"
                  type="button"
                  onClick={() => {
                    setConfirmedRecord(null);
                  }}
                >
                  RETURN TO HOME
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TOAST NOTIFICATION */}
        <div id="toast" className={`toast ${toastMessage ? 'show' : ''}`}>
          {toastMessage}
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <span>HACKERRANK CAMPUS CREW X SPARK // CODER ARMY SPEAKER NODE IIITB</span>
        </footer>
      </main>
    </div>
  );
}
