'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SideRail from '@/components/SideRail';
import EventCard, { EventType } from '@/components/EventCard';
import RegistrationForm from '@/components/RegistrationForm';
import SuccessModal from '@/components/SuccessModal';
import { EventStats, RegistrationRecord } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<EventType>('BOTH');
  const [confirmedRecord, setConfirmedRecord] = useState<RegistrationRecord | null>(null);

  const [stats, setStats] = useState<EventStats>({
    total: 0,
    vector: 0,
    aiml: 0,
    both: 0,
    max_capacity: 1000,
    remaining: 1000
  });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (e) {
      // Use initial state fallback
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectEvent = (type: EventType) => {
    setSelectedEvent(type);
    const formElement = document.getElementById('registration-form-node');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegistrationSuccess = (record: RegistrationRecord) => {
    setConfirmedRecord(record);
    fetchStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFull = stats.total >= 1000;

  return (
    <div className="min-h-screen pb-20 relative">
      <Header />
      <SideRail statusText="NODE: PUBLIC" subText="SYSTEM: OPERATIONAL" />

      <div className="lg:pl-28 px-6 max-w-7xl mx-auto pt-8 sm:pt-12">
        {confirmedRecord ? (
          <SuccessModal
            record={confirmedRecord}
            onReset={() => {
              setConfirmedRecord(null);
              fetchStats();
            }}
          />
        ) : (
          <>
            {/* HERO TITLE BANNER */}
            <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 pt-4">
              <span className="card-meta inline-block mb-3 px-4 py-1.5 rounded-full bg-[#05C770]/10 border border-[#05C770]/30 font-bold">
                OFFICIAL STRATEGIC CHAPTER LAUNCH 2026
              </span>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-4">
                HACKER<span className="text-[#05C770]">RANK</span>
              </h1>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-6">
                CAMPUS <span className="text-[#05C770]">CREW</span>
              </h1>
              <p className="font-mono text-sm sm:text-base tracking-[0.3em] text-gray-400 uppercase mb-6">
                IIIT BHOPAL // INSTITUTIONAL TECHNICAL NODE
              </p>
              <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Building corporate-grade technical merit through real-time algorithmic proctoring, speed coding, and enterprise AI model deployment.
              </p>
            </div>

            {/* 3 EVENT REGISTRATION OPTIONS */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <span className="card-meta">STEP 1: SELECT REGISTRATION OPTION</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  AVAILABLE <span className="text-[#05C770]">EVENT NODES</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* VECTOR 2.0 */}
                <EventCard
                  type="VECTOR 2.0"
                  title="VECTOR 2.0"
                  subtitle="ALGORITHMIC OA WARFARE"
                  description="Competitive programming hackathon & speed coding event simulating Goldman Sachs, Adobe, and Uber hiring assessments."
                  highlights={[
                    'Time/Space Complexity (O) Strictness',
                    'Automated Stress-Testing Benchmarks',
                    'Logic Under Pressure Evaluation'
                  ]}
                  selected={selectedEvent === 'VECTOR 2.0'}
                  onSelect={handleSelectEvent}
                />

                {/* AI/ML WORKSHOP */}
                <EventCard
                  type="AI/ML WORKSHOP"
                  title="AI/ML WORKSHOP"
                  subtitle="ENTERPRISE MODEL ENGINEERING"
                  description="Hands-on corporate workshop on building, fine-tuning, and deploying production LLMs and neural architectures."
                  highlights={[
                    'LLM Fine-Tuning & Prompt Engineering',
                    'PyTorch & Model Pipeline Deployment',
                    'Corporate Technical Certification'
                  ]}
                  selected={selectedEvent === 'AI/ML WORKSHOP'}
                  onSelect={handleSelectEvent}
                />

                {/* BOTH TRACKS */}
                <EventCard
                  type="BOTH"
                  title="BOTH TRACKS"
                  subtitle="COMPLETE ACCESS NODE"
                  description="All-access pass for both Vector 2.0 Competitive Programming & AI/ML Corporate Engineering Workshop."
                  highlights={[
                    'Full Access to Vector 2.0 & AI/ML Sessions',
                    'Priority Placement Merit Certification',
                    '1-on-1 Resume & OA Strategy Review'
                  ]}
                  selected={selectedEvent === 'BOTH'}
                  onSelect={handleSelectEvent}
                  badgeText="MOST POPULAR"
                />
              </div>
            </div>

            {/* REGISTRATION FORM SECTION */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <span className="card-meta">STEP 2: ENTER STUDENT CREDENTIALS</span>
                <h2 className="text-2xl font-extrabold text-[#05C770] tracking-tight flex items-center justify-center gap-2">
                  <ArrowDown className="w-5 h-5 text-[#05C770] animate-bounce" /> REGISTRATION FORM
                </h2>
              </div>

              <RegistrationForm
                selectedEvent={selectedEvent}
                onSuccess={handleRegistrationSuccess}
                isCapacityFull={isFull}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
