'use client';

import React, { useState, useEffect } from 'react';
import { Users, Clock, Flame, AlertCircle } from 'lucide-react';
import { EventStats } from '@/lib/utils';

interface CapacityBarProps {
  stats: EventStats;
}

export default function CapacityBar({ stats }: CapacityBarProps) {
  const percentage = Math.min(100, Math.round((stats.total / stats.max_capacity) * 100));
  const isFull = stats.total >= stats.max_capacity;

  // Countdown timer simulation (3 days period)
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 18, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bento-card mb-8 w-full border-[#05C770]/30 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-5">
        <div>
          <span className="card-meta flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> EVENT CAPACITY & NODE STATUS
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              {stats.total} <span className="text-gray-500 font-normal">/ {stats.max_capacity}</span>
            </h2>
            <span className="text-sm font-mono text-[#05C770] font-semibold">
              REGISTERED ({percentage}%)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isFull ? (
            <div className="px-3.5 py-1.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> REGISTRATION CLOSED
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-md bg-[#05C770]/10 border border-[#05C770]/40 text-[#05C770] font-mono text-xs font-bold flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> {stats.remaining} SEATS REMAINING
            </div>
          )}

          <div className="px-3.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#73D3FB]" />
            <span>ENDS IN {String(timeLeft.days).padStart(2, '0')}D {String(timeLeft.hours).padStart(2, '0')}H {String(timeLeft.minutes).padStart(2, '0')}M</span>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5 relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isFull
              ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
              : 'bg-gradient-to-r from-[#05C770] to-[#73D3FB] shadow-[0_0_15px_rgba(5,199,112,0.5)]'
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 text-center font-mono text-xs pt-3 border-t border-white/5 text-gray-400">
        <div className="bg-white/2 p-2 rounded border border-white/5">
          <span className="text-gray-500 block text-[10px] uppercase">BCC (Best Coder Contest)</span>
          <span className="text-white font-bold">{stats.vector}</span>
        </div>
        <div className="bg-white/2 p-2 rounded border border-white/5">
          <span className="text-gray-500 block text-[10px] uppercase">AI/ML WORKSHOP</span>
          <span className="text-white font-bold">{stats.aiml}</span>
        </div>
        <div className="bg-white/2 p-2 rounded border border-white/5">
          <span className="text-gray-500 block text-[10px] uppercase">BOTH TRACKS</span>
          <span className="text-[#05C770] font-bold">{stats.both}</span>
        </div>
      </div>
    </div>
  );
}
