'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, Cpu } from 'lucide-react';

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  return (
    <header className="w-full py-5 px-6 lg:pl-28 lg:pr-12 flex items-center justify-between z-40 bg-[#08080A]/85 backdrop-blur-md border-b border-white/10 sticky top-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#05C770]/10 border border-[#05C770]/40 flex items-center justify-center group-hover:border-[#05C770] transition-colors">
            <Terminal className="w-5 h-5 text-[#05C770]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#05C770] font-bold tracking-widest uppercase">
                TNP X HACKERRANK
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                IIIT BHOPAL
              </span>
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
              CAMPUS CREW <span className="text-[#05C770]">NODE</span>
            </h1>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
          <div className="w-2 h-2 rounded-full bg-[#05C770] animate-pulse"></div>
          <span>2026 CHAPTER LAUNCH</span>
        </div>

        {isAdmin ? (
          <Link
            href="/"
            className="btn-hr-secondary text-xs !py-2 !px-3.5 flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4" />
            <span>PUBLIC REGISTRATION</span>
          </Link>
        ) : (
          <Link
            href="/admin"
            className="btn-hr-secondary text-xs !py-2 !px-3.5 flex items-center gap-1.5 border-[#05C770]/30 text-[#05C770]"
          >
            <Shield className="w-4 h-4" />
            <span>ADMIN PORTAL</span>
          </Link>
        )}
      </div>
    </header>
  );
}
