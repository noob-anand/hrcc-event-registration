'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SideRail from '@/components/SideRail';
import AdminLogin from '@/components/AdminLogin';
import AdminStats from '@/components/AdminStats';
import AdminTable from '@/components/AdminTable';
import { EventStats, RegistrationRecord } from '@/lib/utils';
import { ShieldCheck, RefreshCw, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    vector: 0,
    aiml: 0,
    both: 0,
    max_capacity: 1000,
    remaining: 1000
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if session token exists
    const session = localStorage.getItem('hrcc_admin_token');
    if (session) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, recordsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/admin/manage')
      ]);

      const statsData = await statsRes.json();
      const recordsData = await recordsRes.json();

      if (statsData.success && statsData.stats) {
        setStats(statsData.stats);
      }

      if (recordsData.success && recordsData.records) {
        setRecords(recordsData.records);
      }
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('hrcc_admin_token', token);
    setIsAuthenticated(true);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('hrcc_admin_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen pb-20 relative">
      <Header isAdmin={true} />
      <SideRail statusText="NODE: ADMIN" subText="ACCESS CONTROL" />

      <div className="lg:pl-28 px-6 max-w-7xl mx-auto pt-8">
        {!isAuthenticated ? (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {/* ADMIN DASHBOARD HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
              <div>
                <span className="card-meta flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#05C770]" /> IIIT BHOPAL HRCC ADMINISTRATIVE PORTAL
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  SYSTEM <span className="text-[#05C770]">OPERATIONS DASHBOARD</span>
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchData}
                  disabled={isLoading}
                  className="btn-hr-secondary text-xs !py-2.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>REFRESH DATA</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="btn-hr-secondary text-xs !py-2.5 border-red-500/30 text-red-400 hover:border-red-500 hover:text-red-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>

            {/* STATS OVERVIEW */}
            <AdminStats stats={stats} />

            {/* REGISTRATION TABLE */}
            <AdminTable records={records} onRefresh={fetchData} />
          </>
        )}
      </div>
    </div>
  );
}
