'use client';

import React, { useState } from 'react';
import { Shield, Lock, Key, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter admin password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid admin password.');
        setIsLoading(false);
        return;
      }

      onLoginSuccess(data.token);
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bento-card max-w-md w-full border-[#05C770]/40 p-8 shadow-[0_0_40px_rgba(5,199,112,0.15)] animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#05C770]/10 border border-[#05C770] flex items-center justify-center mx-auto mb-4 text-[#05C770]">
            <Shield className="w-7 h-7" />
          </div>
          <span className="card-meta text-[#05C770]">RESTRICTED ACCESS NODE</span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            ADMIN <span className="text-[#05C770]">AUTHENTICATION</span>
          </h2>
          <p className="text-gray-400 text-xs font-mono mt-1">
            IIIT Bhopal HRCC Internal Operations Panel
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="hr-label flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#05C770]" /> ADMIN AUTHORIZATION KEY
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (admin2026)"
                className="hr-input pr-10 font-mono text-sm"
                autoFocus
              />
              <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[10px] font-mono text-gray-500 mt-1 block">
              Default password: <code className="text-[#05C770]">admin2026</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-hr-primary w-full text-xs py-3.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <span>AUTHENTICATE & ACCESS DASHBOARD</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
