'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { RegistrationRecord } from '@/lib/utils';
import { Terminal, Code, Cpu, Layers, User, Hash, Phone, Mail, GraduationCap, Calendar, Download, RefreshCw, AlertTriangle, Mic, ExternalLink } from 'lucide-react';

export type EventType = 'VECTOR 2.0' | 'AI/ML WORKSHOP' | 'BOTH';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<EventType | ''>('AI/ML WORKSHOP');
  const [confirmedRecord, setConfirmedRecord] = useState<RegistrationRecord | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    scholar_number: '',
    phone: '',
    email: '',
    branch: '',
    year: YEARS[1],
  });

  const [formErr, setFormErr] = useState('');
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4200);
  };

  const handleSelectChoice = (type: EventType) => {
    setSelectedEvent(type);
    setFormErr('');

    // Check eligibility
    if ((type === 'VECTOR 2.0' || type === 'BOTH') && formData.year && formData.year !== '4th Year') {
      setFormErr('ELIGIBILITY RESTRICTION: Vector 2.0 is open exclusively for 4th Year students. Please select AI/ML Workshop or update Year to 4th Year.');
    }

    setTimeout(() => {
      const formWrap = document.getElementById('formWrap');
      if (formWrap) {
        formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Eligibility re-check when year changes
      if (name === 'year') {
        if ((selectedEvent === 'VECTOR 2.0' || selectedEvent === 'BOTH') && value !== '4th Year') {
          setFormErr('ELIGIBILITY RESTRICTION: Vector 2.0 is open exclusively for 4th Year students. Please select AI/ML Workshop or select 4th Year.');
        } else {
          setFormErr('');
        }
      }

      return updated;
    });

    if (name !== 'year' && formErr) setFormErr('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');

    if (!formData.name.trim() || !formData.scholar_number.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.branch.trim() || !formData.year || !selectedEvent) {
      setFormErr('Please complete every required field.');
      return;
    }

    // Eligibility check for Vector 2.0 & Both
    if ((selectedEvent === 'VECTOR 2.0' || selectedEvent === 'BOTH') && formData.year !== '4th Year') {
      setFormErr('ELIGIBILITY RESTRICTION: Vector 2.0 is open exclusively for 4th Year students. Please select AI/ML Workshop or select 4th Year.');
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
          registration_type: selectedEvent
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.code === 'DUPLICATE_SCHOLAR'
          ? 'REGISTRATION ALREADY EXISTS — this scholar number is already registered.'
          : data.code === 'CAPACITY_REACHED'
          ? 'REGISTRATION CLOSED — capacity reached.'
          : data.code === 'ELIGIBILITY_RESTRICTION'
          ? data.message
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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#05C770', '#73D3FB', '#ffffff']
        });
      } catch (e) {}

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
            <span>TNP X HACKER<b className="text-[#05C770]">RANK</b> CAMPUS CREW // IIIT BHOPAL</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="sys">SYSTEM: OPERATIONAL</div>
            <Link href="/admin" className="admin-link text-xs font-mono border border-white/10 px-2.5 py-1 rounded bg-white/5 hover:border-[#05C770]">
              ADMIN ACCESS
            </Link>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="hero">
          <div className="meta">OFFICIAL EVENT REGISTRATION NODE // 15-16 SEPT 2026</div>
          <h1>
            TNP X HACKER<span>RANK</span><br />
            CAMPUS <span>CREW</span>
          </h1>
          <p>
            Two corporate-grade technical experiences organized by TNP Cell &amp; HackerRank Campus Crew IIIT Bhopal. <strong>Vector 2.0 (DSA &amp; CP) is on 15 Sept</strong> (exclusively for 4th Year), and <strong>AI/ML Workshop is on 16 Sept</strong> (open for all years).
          </p>
        </section>

        {/* HORIZONTAL SPEAKER PROMOTION BANNER */}
        {!confirmedRecord && (
          <div className="speaker-banner">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#05C770]/15 border border-[#05C770]/40 text-[#05C770] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Mic className="w-3 h-3 text-[#05C770]" /> SPECIAL GUEST SPEAKER
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#73D3FB]/15 border border-[#73D3FB]/40 text-[#73D3FB] font-mono text-[10px] font-bold uppercase tracking-wider">
                  TUESDAY, 15 SEPT 2026
                </span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                SPEAKER SESSION // <span className="text-[#05C770]">@underratedcoder</span>
              </h3>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Joining live for <strong>Vector 2.0 (DSA &amp; CP Contest)</strong> &amp; Placement OA Strategy session on <strong>Tuesday, 15th Sept</strong>. Learn advanced problem-solving techniques and algorithmic warfare directly from top tech creators.
              </p>

              <a
                href="https://www.instagram.com/underratedcoder?igsi=MXBqbHc1cTBvM25kcA=="
                target="_blank"
                rel="noopener noreferrer"
                className="insta-badge"
              >
                <svg className="w-3.5 h-3.5 text-[#73D3FB] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>FOLLOW @underratedcoder ON INSTAGRAM</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>

            {/* SPEAKER AVATAR IN CIRCLE ON RIGHT */}
            <div className="speaker-avatar-circle">
              <img
                src="/speaker.png"
                alt="Guest Speaker @underratedcoder"
                className="speaker-img"
                onError={(e) => {
                  // Fallback avatar
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
                }}
              />
            </div>
          </div>
        )}

        {/* CHOICE GRID SECTION */}
        {!confirmedRecord && (
          <section className="section">
            <div className="meta">EVENT NODE // SELECT ACCESS</div>
            <div className="grid">
              {/* VECTOR 2.0 */}
              <article
                className={`card choice ${selectedEvent === 'VECTOR 2.0' ? 'selected' : ''}`}
                onClick={() => handleSelectChoice('VECTOR 2.0')}
              >
                <div className="tick">SELECTED ✓</div>
                <div className="tag">NODE / 01 // 15 SEPT 2026</div>
                <h3 className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#05C770]" /> VECTOR 2.0
                </h3>
                <p>
                  Premier Data Structures, Algorithms (DSA) &amp; Competitive Programming (CP) contest simulating top tech company hiring assessments.
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs text-gray-400 font-mono">
                  <div className="text-[#05C770] font-bold">&gt;&gt; DATE: TUESDAY, 15 SEPT 2026</div>
                  <div className="text-gray-300">&gt;&gt; ELIGIBILITY: EXCLUSIVELY 4TH YEAR</div>
                  <div>&gt;&gt; Data Structures (DSA) &amp; Competitive Programming</div>
                  <div>&gt;&gt; Live Session by @underratedcoder</div>
                </div>
              </article>

              {/* AI/ML WORKSHOP */}
              <article
                className={`card choice ${selectedEvent === 'AI/ML WORKSHOP' ? 'selected' : ''}`}
                onClick={() => handleSelectChoice('AI/ML WORKSHOP')}
              >
                <div className="tick">SELECTED ✓</div>
                <div className="tag">NODE / 02 // 16 SEPT 2026</div>
                <h3 className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#73D3FB]" /> AI/ML WORKSHOP
                </h3>
                <p>
                  Hands-on corporate workshop on building, fine-tuning, and deploying production LLMs and neural architectures.
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs text-gray-400 font-mono">
                  <div className="text-[#73D3FB] font-bold">&gt;&gt; DATE: WEDNESDAY, 16 SEPT 2026</div>
                  <div className="text-gray-300">&gt;&gt; ELIGIBILITY: OPEN FOR ALL YEARS</div>
                  <div>&gt;&gt; LLM Fine-Tuning &amp; Prompt Engineering</div>
                  <div>&gt;&gt; PyTorch Model Deployment</div>
                </div>
              </article>

              {/* BOTH TRACKS */}
              <article
                className={`card choice ${selectedEvent === 'BOTH' ? 'selected' : ''}`}
                onClick={() => handleSelectChoice('BOTH')}
              >
                <div className="tick">SELECTED ✓</div>
                <div className="tag">NODE / 03 // 15 &amp; 16 SEPT</div>
                <h3 className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#05C770]" /> BOTH TRACKS
                </h3>
                <p>
                  Register once for both experiences: DSA &amp; CP Contest (15 Sept) + AI/ML Corporate Engineering Workshop (16 Sept).
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs text-gray-400 font-mono">
                  <div className="text-[#05C770] font-bold">&gt;&gt; DATES: 15 &amp; 16 SEPT 2026</div>
                  <div className="text-gray-300">&gt;&gt; ELIGIBILITY: 4TH YEAR STUDENTS ONLY</div>
                  <div>&gt;&gt; Complete 2-Day Event Track Access</div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* ACCESS REGISTRATION FORM */}
        {!confirmedRecord && (
          <section id="formWrap" className={`form-wrap ${selectedEvent ? 'show' : ''}`}>
            <div className="meta">ACCESS FORM // REQUIRED FIELDS</div>
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
                    />
                  </div>

                  <div className="field">
                    <label>Scholar Number *</label>
                    <input
                      name="scholar_number"
                      value={formData.scholar_number}
                      onChange={handleInputChange}
                      placeholder="e.g. 230001234"
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
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="field">
                    <label>Branch *</label>
                    <input
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      placeholder="e.g. Computer Science & Engineering"
                    />
                  </div>

                  <div className="field">
                    <label>Year *</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                    >
                      <option value="">Select year</option>
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field full">
                    <label>Selected Registration Option *</label>
                    <input
                      id="selectedType"
                      name="registration_type"
                      value={selectedEvent}
                      readOnly
                      style={{ background: 'rgba(5,199,112,0.08)', color: 'var(--g)', fontWeight: 700 }}
                    />
                  </div>
                </div>

                {formErr && <div id="formErr" className="err" style={{ marginTop: '12px' }}>{formErr}</div>}

                <div className="actions">
                  <button className="btn" id="submitBtn" type="submit" disabled={isSubmitting || Boolean(duplicateAlert)}>
                    {isSubmitting ? 'SUBMITTING…' : 'CONFIRM REGISTRATION'}
                  </button>
                  <button className="btn alt" type="button" id="changeBtn" onClick={() => setSelectedEvent('')}>
                    CHANGE EVENT
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* SUCCESS CONFIRMATION PASS WITH QR CODE */}
        {confirmedRecord && (
          <section id="success" className="success show">
            <div className="card confirm">
              <div className="meta">DATABASE STATUS // WRITE COMPLETE</div>
              <h2 style={{ margin: '0 0 10px' }}>REGISTRATION CONFIRMED</h2>
              <p style={{ color: '#aaa' }}>Your seat has been recorded successfully in IIIT Bhopal database.</p>

              <div className="rid" id="rid">
                {confirmedRecord.registration_id}
              </div>

              <div className="details">
                <div className="detail">
                  <small>STUDENT</small>
                  <b id="sname">{confirmedRecord.name}</b>
                </div>

                <div className="detail">
                  <small>SELECTED EVENT</small>
                  <b id="stype">{confirmedRecord.registration_type}</b>
                </div>

                <div className="detail">
                  <small>SCHOLAR NUMBER</small>
                  <b id="sscholar">{confirmedRecord.scholar_number}</b>
                </div>

                <div className="detail">
                  <small>BRANCH &amp; YEAR</small>
                  <b>{confirmedRecord.branch} ({confirmedRecord.year})</b>
                </div>

                <div className="detail">
                  <small>STATUS</small>
                  <b style={{ color: 'var(--g)' }}>VERIFIED CONFIRMED</b>
                </div>

                <div className="detail">
                  <small>EMAIL</small>
                  <b className="truncate">{confirmedRecord.email}</b>
                </div>
              </div>

              {/* EVENT CHECK-IN QR CODE */}
              <div className="flex flex-col items-center justify-center my-6 p-4 bg-[#08080A] rounded-xl max-w-[220px] mx-auto border border-white/20">
                <div className="p-3 bg-white rounded-lg">
                  <QRCodeSVG
                    value={JSON.stringify({
                      reg_id: confirmedRecord.registration_id,
                      scholar: confirmedRecord.scholar_number,
                      name: confirmedRecord.name,
                      type: confirmedRecord.registration_type
                    })}
                    size={150}
                    bgColor="#FFFFFF"
                    fgColor="#08080A"
                  />
                </div>
                <span className="font-mono text-[10px] text-[#05C770] font-bold tracking-widest uppercase block mt-2">
                  EVENT CHECK-IN QR
                </span>
              </div>

              <div className="actions" style={{ justifyContent: 'center', gap: '12px' }}>
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
                    setSelectedEvent('AI/ML WORKSHOP');
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
          <span>TNP X HRCC // INSTITUTIONAL.NODE.IIITB</span>
          <Link className="admin-link" href="/admin">
            ADMIN ACCESS PORTAL
          </Link>
        </footer>
      </main>
    </div>
  );
}
