'use client';

import React, { useState } from 'react';
import { X, Save, User, Hash, Phone, Mail, GraduationCap, Calendar, Layers } from 'lucide-react';
import { RegistrationRecord } from '@/lib/utils';

interface EditStudentModalProps {
  record: RegistrationRecord;
  onClose: () => void;
  onSave: (updatedRecord: RegistrationRecord) => void;
}

const YEARS = ['2nd Year', '3rd Year', '4th Year'];

export default function EditStudentModal({ record, onClose, onSave }: EditStudentModalProps) {
  const [formData, setFormData] = useState({ ...record });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success && data.record) {
        onSave(data.record);
      } else {
        onSave(formData);
      }
    } catch (e) {
      onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bento-card max-w-xl w-full border-[#05C770]/40 p-6 sm:p-8 animate-fade-in relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-4 border-b border-white/10">
          <span className="card-meta">ADMIN EDIT NODE</span>
          <h3 className="text-2xl font-black text-white">
            EDIT REGISTRATION <span className="text-[#05C770]">{record.registration_id}</span>
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="hr-label flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#05C770]" /> FULL NAME
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="hr-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="hr-label flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#05C770]" /> SCHOLAR NUMBER
              </label>
              <input
                type="text"
                value={formData.scholar_number}
                onChange={(e) => setFormData(prev => ({ ...prev, scholar_number: e.target.value }))}
                className="hr-input font-mono"
                required
              />
            </div>

            <div>
              <label className="hr-label flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#05C770]" /> PHONE NUMBER
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="hr-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="hr-label flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#05C770]" /> EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="hr-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="hr-label flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#05C770]" /> BRANCH
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                className="hr-input"
                required
              />
            </div>

            <div>
              <label className="hr-label flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#05C770]" /> YEAR
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="hr-input bg-[#111116] text-white"
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="hr-label flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#05C770]" /> REGISTRATION TRACK / TYPE
            </label>
            <select
              value={formData.registration_type}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_type: e.target.value }))}
              className="hr-input bg-[#111116] text-white"
            >
              <option value="Placement & Internship Session (3rd & 4th Year)">Placement & Internship Session (3rd & 4th Year)</option>
              <option value="Placement Roadmap (1st & 2nd Year)">Placement Roadmap (1st & 2nd Year)</option>
              <option value="Rohit Negi Speaker Session & Masterclass">Rohit Negi Speaker Session & Masterclass</option>
            </select>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-hr-secondary text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-hr-primary text-xs py-2.5 px-5"
            >
              <Save className="w-4 h-4" />
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
