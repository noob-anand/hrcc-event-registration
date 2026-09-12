'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Trash2, Edit3, Eye, ArrowUpDown, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { RegistrationRecord, formatDate, exportToCSV } from '@/lib/utils';
import EditStudentModal from './EditStudentModal';
import { QRCodeSVG } from 'qrcode.react';

interface AdminTableProps {
  records: RegistrationRecord[];
  onRefresh: () => void;
}

export default function AdminTable({ records, onRefresh }: AdminTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Modals state
  const [viewRecord, setViewRecord] = useState<RegistrationRecord | null>(null);
  const [editRecord, setEditRecord] = useState<RegistrationRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Search
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = !searchLower || (
        r.name.toLowerCase().includes(searchLower) ||
        r.scholar_number.toLowerCase().includes(searchLower) ||
        r.registration_id.toLowerCase().includes(searchLower) ||
        r.email.toLowerCase().includes(searchLower) ||
        r.phone.includes(searchLower)
      );

      // Filters
      const matchesType = selectedType === 'ALL' || r.registration_type === selectedType;
      const matchesBranch = selectedBranch === 'ALL' || r.branch === selectedBranch;
      const matchesYear = selectedYear === 'ALL' || r.year === selectedYear;

      return matchesSearch && matchesType && matchesBranch && matchesYear;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [records, searchTerm, selectedType, selectedBranch, selectedYear, sortBy]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/manage?id=${deleteId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (e) {
      // Fallback
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    exportToCSV(filteredRecords);
  };

  const uniqueBranches = Array.from(new Set(records.map(r => r.branch)));
  const uniqueYears = Array.from(new Set(records.map(r => r.year)));

  return (
    <div className="bento-card w-full p-6 relative">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <span className="card-meta">LIVE REGISTRATIONS DATABASE</span>
          <h3 className="text-2xl font-black text-white">
            REGISTERED <span className="text-[#05C770]">PARTICIPANTS</span> ({filteredRecords.length})
          </h3>
        </div>

        <button
          onClick={handleExport}
          className="btn-hr-primary text-xs py-3 px-5 flex items-center gap-2 self-start lg:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* SEARCH, FILTERS & SORTING BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {/* SEARCH */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Name, Scholar No, Reg ID, Email..."
            className="hr-input pl-10 text-xs font-mono"
          />
        </div>

        {/* FILTER TRACK */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="hr-input bg-[#111116] text-xs text-white"
        >
          <option value="ALL">All Registration Types</option>
          <option value="VECTOR 2.0">VECTOR 2.0</option>
          <option value="AI/ML WORKSHOP">AI/ML WORKSHOP</option>
          <option value="BOTH">BOTH</option>
        </select>

        {/* FILTER BRANCH */}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="hr-input bg-[#111116] text-xs text-white"
        >
          <option value="ALL">All Branches</option>
          {uniqueBranches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        {/* SORT BY */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="hr-input bg-[#111116] text-xs text-white"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="name">Sort: Name (A-Z)</option>
        </select>
      </div>

      {/* REGISTRATIONS TABLE */}
      <div className="w-full overflow-x-auto border border-white/10 rounded-xl bg-[#08080A]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 font-mono text-[11px] text-[#05C770] uppercase">
              <th className="py-3.5 px-4 font-bold">REG ID</th>
              <th className="py-3.5 px-4 font-bold">NAME</th>
              <th className="py-3.5 px-4 font-bold">SCHOLAR NO</th>
              <th className="py-3.5 px-4 font-bold">PHONE</th>
              <th className="py-3.5 px-4 font-bold">EMAIL</th>
              <th className="py-3.5 px-4 font-bold">BRANCH & YEAR</th>
              <th className="py-3.5 px-4 font-bold">TYPE</th>
              <th className="py-3.5 px-4 font-bold">TIME</th>
              <th className="py-3.5 px-4 font-bold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs text-gray-300">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-500 font-mono">
                  NO REGISTRATION RECORDS FOUND MATCHING QUERY
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#05C770] whitespace-nowrap">
                    {r.registration_id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                    {r.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-300 whitespace-nowrap">
                    {r.scholar_number}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400 whitespace-nowrap">
                    {r.phone}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 max-w-[180px] truncate" title={r.email}>
                    {r.email}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                    {r.branch} ({r.year})
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      r.registration_type === 'VECTOR 2.0'
                        ? 'bg-[#05C770]/15 text-[#05C770] border border-[#05C770]/30'
                        : r.registration_type === 'AI/ML WORKSHOP'
                        ? 'bg-[#73D3FB]/15 text-[#73D3FB] border border-[#73D3FB]/30'
                        : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                    }`}>
                      {r.registration_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewRecord(r)}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setEditRecord(r)}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-[#05C770] hover:bg-[#05C770]/10"
                        title="Edit Record"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteId(r.id)}
                        className="p-1.5 rounded bg-white/5 hover:bg-red-500/10 text-red-400"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bento-card max-w-lg w-full p-6 border-[#05C770] relative">
            <button
              onClick={() => setViewRecord(null)}
              className="absolute top-5 right-5 p-1.5 rounded bg-white/5 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-bold text-white mb-1">REGISTRATION DETAILS</h3>
            <span className="card-meta text-[#05C770]">{viewRecord.registration_id}</span>

            <div className="my-4 p-4 rounded-xl bg-white/3 border border-white/10 space-y-2 text-xs">
              <p><strong className="text-gray-400 font-mono">NAME:</strong> <span className="text-white">{viewRecord.name}</span></p>
              <p><strong className="text-gray-400 font-mono">SCHOLAR NUMBER:</strong> <span className="text-white">{viewRecord.scholar_number}</span></p>
              <p><strong className="text-gray-400 font-mono">PHONE:</strong> <span className="text-white">{viewRecord.phone}</span></p>
              <p><strong className="text-gray-400 font-mono">EMAIL:</strong> <span className="text-white">{viewRecord.email}</span></p>
              <p><strong className="text-gray-400 font-mono">BRANCH:</strong> <span className="text-white">{viewRecord.branch} ({viewRecord.year})</span></p>
              <p><strong className="text-gray-400 font-mono">TYPE:</strong> <span className="text-[#05C770]">{viewRecord.registration_type}</span></p>
              <p><strong className="text-gray-400 font-mono">DATE:</strong> <span className="text-gray-300">{formatDate(viewRecord.created_at)}</span></p>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-lg my-4">
              <QRCodeSVG
                value={JSON.stringify({ reg_id: viewRecord.registration_id, scholar: viewRecord.scholar_number, name: viewRecord.name })}
                size={120}
              />
            </div>

            <button
              onClick={() => setViewRecord(null)}
              className="btn-hr-secondary w-full text-xs"
            >
              CLOSE WINDOW
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editRecord && (
        <EditStudentModal
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSave={() => {
            setEditRecord(null);
            onRefresh();
          }}
        />
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bento-card max-w-md w-full border-red-500/50 p-6 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">CONFIRM PERMANENT DELETION</h3>
            <p className="text-gray-300 text-xs font-mono mb-6">
              Are you sure you want to permanently delete this registration?
              <br /><span className="text-red-400">This action will remove the record from database and free up capacity slot.</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-hr-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-500 text-white font-mono text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors"
              >
                {isDeleting ? 'DELETING...' : 'PERMANENTLY DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
