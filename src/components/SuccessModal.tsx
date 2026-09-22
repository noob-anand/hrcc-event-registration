'use client';

import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, Download, RefreshCw, Terminal, User, Hash, Calendar, GraduationCap, Mail, Phone, Sparkles } from 'lucide-react';
import { RegistrationRecord, formatDate } from '@/lib/utils';

interface SuccessModalProps {
  record: RegistrationRecord;
  onReset: () => void;
}

export default function SuccessModal({ record, onReset }: SuccessModalProps) {
  useEffect(() => {
    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#05C770', '#73D3FB', '#ffffff']
    });
  }, []);

  const handlePrintPass = () => {
    window.print();
  };

  const qrPayload = JSON.stringify({
    reg_id: record.registration_id,
    scholar: record.scholar_number,
    name: record.name,
    type: record.registration_type,
    status: 'VERIFIED'
  });

  return (
    <div className="bento-card w-full border-[#05C770] p-6 sm:p-10 relative animate-fade-in shadow-[0_0_50px_rgba(5,199,112,0.2)]">
      {/* SUCCESS TOP BANNER */}
      <div className="text-center pb-8 mb-8 border-b border-white/10">
        <div className="w-16 h-16 rounded-2xl bg-[#05C770]/15 border-2 border-[#05C770] flex items-center justify-center mx-auto mb-4 text-[#05C770] shadow-[0_0_25px_rgba(5,199,112,0.4)]">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="card-meta text-[#05C770] flex items-center justify-center gap-1.5 font-bold">
          <Sparkles className="w-4 h-4" /> OFFICIAL INSTITUTIONAL PASS GENERATED
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
          REGISTRATION <span className="text-[#05C770]">CONFIRMED</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto font-mono">
          Your access node for HackerRank Campus Crew Chapter Launch 2026 has been authenticated and recorded in IIIT Bhopal database.
        </p>
      </div>

      {/* PASS CONTAINER FOR DISPLAY AND PRINT */}
      <div className="bg-[#111116] border border-[#05C770]/40 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden print:border-black print:bg-white print:text-black">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#05C770]/5 rounded-bl-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* LEFT: STUDENT METADATA */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded bg-[#05C770]/20 border border-[#05C770] text-[#05C770] font-mono text-xs font-bold uppercase tracking-wider">
                {record.registration_type}
              </span>
              <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-300 font-mono text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#05C770]" /> VERIFIED
              </span>
            </div>

            <div>
              <span className="text-gray-500 font-mono text-xs block uppercase">REGISTRATION ID</span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#05C770] tracking-wider">
                {record.registration_id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-gray-500 font-mono text-[11px] block uppercase flex items-center gap-1">
                  <User className="w-3 h-3 text-[#05C770]" /> STUDENT NAME
                </span>
                <span className="text-white font-bold text-base">{record.name}</span>
              </div>

              <div>
                <span className="text-gray-500 font-mono text-[11px] block uppercase flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[#05C770]" /> SCHOLAR NUMBER
                </span>
                <span className="text-white font-mono font-bold text-base">{record.scholar_number}</span>
              </div>

              <div>
                <span className="text-gray-500 font-mono text-[11px] block uppercase flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-[#05C770]" /> DEGREE, BRANCH &amp; YEAR
                </span>
                <span className="text-gray-200 text-xs font-semibold">{record.degree || 'B.Tech'} - {record.branch} ({record.year})</span>
              </div>

              <div>
                <span className="text-gray-500 font-mono text-[11px] block uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#05C770]" /> TIMESTAMP
                </span>
                <span className="text-gray-200 font-mono text-xs">{formatDate(record.created_at)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span className="truncate">{record.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span>{record.phone}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: QR CODE FOR EVENT CHECK-IN */}
          <div className="flex flex-col items-center justify-center p-5 bg-[#08080A] border border-white/10 rounded-xl shrink-0 text-center">
            <div className="p-3 bg-white rounded-lg shadow-lg mb-3">
              <QRCodeSVG
                value={qrPayload}
                size={140}
                bgColor="#FFFFFF"
                fgColor="#08080A"
                level="H"
              />
            </div>
            <span className="font-mono text-[10px] text-[#05C770] font-bold tracking-widest uppercase block">
              EVENT CHECK-IN QR
            </span>
            <span className="font-mono text-[9px] text-gray-500 block mt-0.5">
              SCAN AT ENTRY DESK
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handlePrintPass}
          className="btn-hr-primary w-full sm:w-auto text-xs py-3.5 px-6"
        >
          <Download className="w-4 h-4" />
          <span>PRINT / SAVE EVENT PASS</span>
        </button>

        <button
          onClick={onReset}
          className="btn-hr-secondary w-full sm:w-auto text-xs py-3.5 px-6"
        >
          <RefreshCw className="w-4 h-4" />
          <span>REGISTER ANOTHER STUDENT</span>
        </button>
      </div>
    </div>
  );
}
