'use client';

import React from 'react';
import { Users, Code, Cpu, Layers, Flame } from 'lucide-react';
import { EventStats } from '@/lib/utils';

interface AdminStatsProps {
  stats: EventStats;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const maxCap = stats.max_capacity || 1000;
  const percentage = Math.min(100, Math.round((stats.total / maxCap) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* TOTAL REGISTRATIONS */}
      <div className="bento-card p-5 border-[#05C770]/30 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="card-meta !mb-0 text-xs">TOTAL</span>
          <div className="p-2 rounded bg-[#05C770]/10 border border-[#05C770]/30 text-[#05C770]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-black font-mono text-white tracking-tight">{stats.total}</span>
          <span className="text-[10px] font-mono text-gray-400 block mt-1">REGISTERED STUDENTS</span>
        </div>
      </div>

      {/* VECTOR 2.0 */}
      <div className="bento-card p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="card-meta !mb-0 text-xs text-[#05C770]">VECTOR 2.0</span>
          <div className="p-2 rounded bg-white/5 border border-white/10 text-[#05C770]">
            <Code className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-black font-mono text-white tracking-tight">{stats.vector}</span>
          <span className="text-[10px] font-mono text-gray-400 block mt-1">OA SPEED CODERS</span>
        </div>
      </div>

      {/* AI/ML WORKSHOP */}
      <div className="bento-card p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="card-meta !mb-0 text-xs text-[#73D3FB]">AI/ML WORKSHOP</span>
          <div className="p-2 rounded bg-white/5 border border-white/10 text-[#73D3FB]">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-black font-mono text-white tracking-tight">{stats.aiml}</span>
          <span className="text-[10px] font-mono text-gray-400 block mt-1">MODEL ENGINEERS</span>
        </div>
      </div>

      {/* BOTH TRACKS */}
      <div className="bento-card p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="card-meta !mb-0 text-xs text-purple-400">BOTH TRACKS</span>
          <div className="p-2 rounded bg-white/5 border border-white/10 text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-black font-mono text-white tracking-tight">{stats.both}</span>
          <span className="text-[10px] font-mono text-gray-400 block mt-1">FULL PASS NODES</span>
        </div>
      </div>

      {/* CAPACITY STATUS */}
      <div className="bento-card p-5 border-[#73D3FB]/30 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="card-meta !mb-0 text-xs text-[#73D3FB]">CAPACITY</span>
          <div className="p-2 rounded bg-[#73D3FB]/10 border border-[#73D3FB]/30 text-[#73D3FB]">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white">{stats.total}</span>
            <span className="text-sm font-mono text-gray-400">/ {maxCap}</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#05C770] h-full" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
