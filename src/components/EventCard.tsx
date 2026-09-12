'use client';

import React from 'react';
import { Code, Cpu, Layers, CheckCircle2, Sparkles } from 'lucide-react';

export type EventType = 'VECTOR 2.0' | 'AI/ML WORKSHOP' | 'BOTH';

interface EventCardProps {
  type: EventType;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  selected: boolean;
  onSelect: (type: EventType) => void;
  badgeText?: string;
}

export default function EventCard({
  type,
  title,
  subtitle,
  description,
  highlights,
  selected,
  onSelect,
  badgeText,
}: EventCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'VECTOR 2.0':
        return <Code className="w-6 h-6 text-[#05C770]" />;
      case 'AI/ML WORKSHOP':
        return <Cpu className="w-6 h-6 text-[#73D3FB]" />;
      case 'BOTH':
        return <Layers className="w-6 h-6 text-[#05C770]" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(type)}
      className={`bento-card cursor-pointer transition-all duration-300 flex flex-col justify-between ${
        selected ? 'bento-card-selected' : 'hover:border-[#05C770]/50'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="card-meta !mb-0">{subtitle}</span>
          <div className="flex items-center gap-2">
            {badgeText && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#05C770]/20 text-[#05C770] border border-[#05C770]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {badgeText}
              </span>
            )}
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                selected
                  ? 'bg-[#05C770] border-[#05C770] text-black'
                  : 'border-white/20 text-transparent'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            {getIcon()}
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            {title}
          </h3>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {description}
        </p>

        <div className="space-y-2.5 pt-4 border-t border-white/10 mb-6">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-300">
              <span className="text-[#05C770] font-mono font-bold">&gt;&gt;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(type);
        }}
        className={`w-full py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
          selected
            ? 'bg-[#05C770] text-[#08080A] border-[#05C770] shadow-[0_0_15px_rgba(5,199,112,0.4)]'
            : 'bg-white/5 text-gray-300 border-white/10 hover:border-[#05C770] hover:text-[#05C770]'
        }`}
      >
        {selected ? '[ NODE SELECTED ]' : 'SELECT REGISTRATION NODE'}
      </button>
    </div>
  );
}
