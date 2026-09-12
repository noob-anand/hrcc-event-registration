'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { RegistrationRecord } from '@/lib/utils';
import { Terminal, Shield, Code, Cpu, Layers, CheckCircle2, User, Hash, Phone, Mail, GraduationCap, Calendar, Download, RefreshCw, AlertTriangle } from 'lucide-react';

export type EventType = 'VECTOR 2.0' | 'AI/ML WORKSHOP' | 'BOTH';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<EventType | ''>('BOTH');
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
    setTimeout(() => {
      const formWrap = document.getElementById('formWrap');
      if (formWrap) {
        formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErr) setFormErr('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');

    if (!formData.name.trim() || !formData.scholar_number.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.branch.trim() || !formData.year || !selectedEvent) {
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
          registration_type: selectedEvent
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
            <span>HACKER<b className="text-[#05C770]">RANK</b> CAMPUS CREW // IIIT BHOPAL</span>
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
          <div className="meta">OFFICIAL EVENT REGISTRATION NODE</div>
          <h1>
            HACKER<span>RANK</span><br />
            CAMPUS <span>CREW</span>
          </h1>
          <p>
            Two corporate-grade technical experiences. One registration gateway. Choose Vector 2.0 Algorithmic OA Warfare, AI/ML Enterprise Model Engineering, or both and reserve your seat through the official IIIT Bhopal club node.
          </p>
        </section>

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
                <div className="tag">NODE / 01</div>
                <h3 className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#05C770]" /> VECTOR 2.0
                </h3>
                <p>
                  Competitive programming hackathon &amp; speed coding event simulating Goldman Sachs, Adobe, and Uber hiring assessments.
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs text-gray-400 font-mono">
                  <div>&gt;&gt; Time/Space Complexity (O) Strictness</div>
                  <div>&gt;&gt; Automated Stress-Testing</div>
                  <div>&gt;&gt; Logic Under Pressure Evaluation</div>
                </div>
              </article>

              {/* AI/ML WORKSHOP */}
              <article
                className={`card choice ${selectedEvent === 'AI/ML WORKSHOP' ? 'selected' : ''}`}
                onClick={() => handleSelectChoice('AI/ML WORKSHOP')}
              >
                <div className="tick">SELECTED ✓</div>
                <div className="tag">NODE / 02</div>
                <h3 className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#73D3FB]" /> AI/ML WORKSHOP
                </h3>
                <p>
                  Hands-on corporate workshop on building, fine-tuning, and deploying production LLMs and neural architectures.
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs text-gray-400 font-mono">
                  <div>&gt;&gt; LLM Fine-Tuning &amp; Prompting</div>
                  <div>&gt;&gt; PyTorch Model Deployment</div>
                  <div>&gt;&gt; Corporate Merit Certification</div>
                </div>
              </article>

              {/* BOTH TRACKS */}
              <article
                className={`card choice ${selectedEvent === 'BOTH' ? 'selected' : ''}`}
                onClick={() => handleSelectChoice('BOTH')}
              >
                <div className="tick">SELECTED ✓</div>
                <div className="tag">NODE / 03 // MOST POPULAR</div>
                <h3 className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#05C770]" /> BOTH TRACKS
                </h3>
                <p>
                  Register once for both experiences and unlock the complete event track with priority placement merit review.
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs text-gray-400 font-mono">
                  <div>&gt;&gt; Full Access Vector 2.0 &amp; AI/ML</div>
                  <div>&gt;&gt; Priority Placement Certification</div>
                  <div>&gt;&gt; 1-on-1 Resume &amp; OA Strategy</div>
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
              <div className="flex flex-col items-center justify-center my-6 p-4 bg-white rounded-xl max-w-[220px] mx-auto border border-white/20">
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
                <span className="font-mono text-[10px] text-black font-bold tracking-widest uppercase block mt-2">
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
                    setSelectedEvent('BOTH');
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
          <span>HRCC // INSTITUTIONAL.NODE.IIITB BY A.S.</span>
          <Link className="admin-link" href="/admin">
            ADMIN ACCESS PORTAL
          </Link>
        </footer>
      </main>
    </div>
  );
}
