'use client';

import React, { useState } from 'react';
import { Shield, UserCheck, Lock, Key, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminId.trim() || !password.trim()) {
      setError('Please enter both Admin ID and Password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: adminId.trim(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid Admin ID or Password.');
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
      <div className="card max-w-md w-full p-8 relative animate-fade-in" style={{ borderColor: 'rgba(5,199,112,0.4)', boxShadow: '0 0 40px rgba(5,199,112,0.15)' }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#05C770]/10 border border-[#05C770] flex items-center justify-center mx-auto mb-4 text-[#05C770]">
            <Shield className="w-7 h-7" />
          </div>
          <div className="meta" style={{ color: 'var(--g)', marginBottom: '6px' }}>RESTRICTED ACCESS NODE</div>
          <h2 className="text-2xl font-black text-white tracking-tight" style={{ margin: 0 }}>
            ADMIN <span style={{ color: 'var(--g)' }}>AUTHENTICATION</span>
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
          {/* ADMIN ID / USERNAME */}
          <div>
            <label className="field label font-mono text-xs text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#05C770]" /> ADMIN ID / USERNAME
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Admin ID (default: admin)"
              className="w-full border border-white/10 bg-black/40 text-white p-3 rounded-lg font-mono text-sm outline-none focus:border-[#05C770]"
              autoFocus
            />
          </div>

          {/* ADMIN PASSWORD */}
          <div>
            <label className="field label font-mono text-xs text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#05C770]" /> ADMIN PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: admin2026)"
                className="w-full border border-white/10 bg-black/40 text-white p-3 rounded-lg font-mono text-sm outline-none focus:border-[#05C770]"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2 text-[11px] font-mono text-gray-500 space-y-1">
            <div>Default Admin ID: <code className="text-[#05C770]">admin</code></div>
            <div>Default Password: <code className="text-[#05C770]">admin2026</code></div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full text-xs py-3.5 mt-4"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                VERIFYING CREDENTIALS...
              </span>
            ) : (
              <span>AUTHENTICATE &amp; ACCESS DASHBOARD</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
