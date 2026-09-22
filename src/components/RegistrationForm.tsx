'use client';

import React, { useState, useEffect } from 'react';
import { User, Hash, Phone, Mail, GraduationCap, Calendar, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { EventType } from './EventCard';
import { validateEmail, validatePhone, validateScholarNumber, RegistrationRecord } from '@/lib/utils';

interface RegistrationFormProps {
  selectedEvent: EventType;
  onSuccess: (record: RegistrationRecord) => void;
  isCapacityFull?: boolean;
}

const DEGREES = ['B.Tech', 'M.Tech', 'MCA'];

const getAvailableYears = (degree: string) => {
  if (['M.Tech', 'MCA'].includes(degree)) {
    return ['1st Year', '2nd Year', '3rd Year'];
  }
  return ['2nd Year', '3rd Year', '4th Year'];
};

export default function RegistrationForm({
  selectedEvent,
  onSuccess,
  isCapacityFull = false,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    scholar_number: '',
    phone: '',
    email: '',
    degree: 'B.Tech',
    branch: '',
    year: '2nd Year',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);
  const [checkingScholar, setCheckingScholar] = useState(false);

  const availableYears = getAvailableYears(formData.degree);

  // Debounced real-time duplicate check for Scholar Number
  useEffect(() => {
    const scholar = formData.scholar_number.trim();
    if (scholar.length < 4) {
      setDuplicateAlert(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingScholar(true);
      try {
        const res = await fetch(`/api/check-scholar?scholar=${encodeURIComponent(scholar)}`);
        const data = await res.json();
        if (data.exists) {
          setDuplicateAlert(data.message || `REGISTRATION ALREADY EXISTS: Scholar Number ${scholar.toUpperCase()} is already registered.`);
        } else {
          setDuplicateAlert(null);
        }
      } catch (err) {
        // Silent catch for network hiccup
      } finally {
        setCheckingScholar(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.scholar_number]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'degree') {
      const validYears = getAvailableYears(value);
      setFormData(prev => ({
        ...prev,
        degree: value,
        year: validYears.includes(prev.year) ? prev.year : validYears[0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    
    if (!formData.scholar_number.trim()) {
      newErrors.scholar_number = 'Scholar Number is required';
    } else if (!validateScholarNumber(formData.scholar_number)) {
      newErrors.scholar_number = 'Enter a valid Scholar Number (e.g. 221111042)';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year selection required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCapacityFull) return;

    if (!validate()) return;

    if (duplicateAlert) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          registration_type: selectedEvent
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === 'DUPLICATE_SCHOLAR') {
          setDuplicateAlert(data.message);
        } else {
          setErrors({ submit: data.message || 'Registration failed. Please try again.' });
        }
        setIsSubmitting(false);
        return;
      }

      onSuccess(data.record);
    } catch (err: any) {
      setErrors({ submit: 'Network error. Please check connection and retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bento-card w-full border-[#05C770]/40 relative animate-fade-in" id="registration-form-node">
      <div className="mb-6 pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="card-meta">STUDENT DATA COLLECTION NODE</span>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            REGISTER FOR <span className="text-[#05C770]">{selectedEvent}</span>
          </h3>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#05C770]/10 border border-[#05C770]/30 text-[#05C770] font-mono text-xs font-bold inline-flex items-center gap-1.5 self-start">
          <Check className="w-3.5 h-3.5" /> SELECTED: {selectedEvent}
        </div>
      </div>

      {duplicateAlert && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-mono text-xs flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-red-400 uppercase mb-1">REGISTRATION ALREADY EXISTS</span>
            <p>{duplicateAlert}</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* FULL NAME */}
          <div>
            <label className="hr-label flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#05C770]" /> FULL NAME <span className="text-[#05C770]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Sharma"
              disabled={isCapacityFull || isSubmitting}
              className={`hr-input ${errors.name ? '!border-red-500' : ''}`}
            />
            {errors.name && <span className="text-red-400 text-xs font-mono mt-1 block">{errors.name}</span>}
          </div>

          {/* SCHOLAR NUMBER */}
          <div>
            <label className="hr-label flex items-center gap-1.5 justify-between">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#05C770]" /> SCHOLAR NUMBER <span className="text-[#05C770]">*</span>
              </span>
              {checkingScholar && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-[#05C770]" /> Checking uniqueness...
                </span>
              )}
            </label>
            <input
              type="text"
              name="scholar_number"
              value={formData.scholar_number}
              onChange={handleChange}
              placeholder="e.g. 221111042"
              disabled={isCapacityFull || isSubmitting}
              className={`hr-input font-mono ${errors.scholar_number || duplicateAlert ? '!border-red-500' : ''}`}
            />
            {errors.scholar_number && <span className="text-red-400 text-xs font-mono mt-1 block">{errors.scholar_number}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* PHONE NUMBER */}
          <div>
            <label className="hr-label flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#05C770]" /> PHONE NUMBER <span className="text-[#05C770]">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit Mobile Number"
              disabled={isCapacityFull || isSubmitting}
              className={`hr-input ${errors.phone ? '!border-red-500' : ''}`}
            />
            {errors.phone && <span className="text-red-400 text-xs font-mono mt-1 block">{errors.phone}</span>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="hr-label flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#05C770]" /> EMAIL ADDRESS <span className="text-[#05C770]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@student.iiitbhopal.ac.in"
              disabled={isCapacityFull || isSubmitting}
              className={`hr-input ${errors.email ? '!border-red-500' : ''}`}
            />
            {errors.email && <span className="text-red-400 text-xs font-mono mt-1 block">{errors.email}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* DEGREE */}
          <div>
            <label className="hr-label flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#05C770]" /> DEGREE <span className="text-[#05C770]">*</span>
            </label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              disabled={isCapacityFull || isSubmitting}
              className="hr-input bg-[#111116] border-white/10 text-white cursor-pointer"
            >
              {DEGREES.map(d => (
                <option key={d} value={d} className="bg-[#111116] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* BRANCH (TEXT INPUT) */}
          <div>
            <label className="hr-label flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#05C770]" /> ACADEMIC BRANCH <span className="text-[#05C770]">*</span>
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science & Engineering"
              disabled={isCapacityFull || isSubmitting}
              className={`hr-input ${errors.branch ? '!border-red-500' : ''}`}
            />
            {errors.branch && <span className="text-red-400 text-xs font-mono mt-1 block">{errors.branch}</span>}
          </div>

          {/* YEAR */}
          <div>
            <label className="hr-label flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#05C770]" /> ACADEMIC YEAR <span className="text-[#05C770]">*</span>
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              disabled={isCapacityFull || isSubmitting}
              className="hr-input bg-[#111116] border-white/10 text-white cursor-pointer"
            >
              {availableYears.map(y => (
                <option key={y} value={y} className="bg-[#111116] text-white">
                  {y}
                </option>
              ))}
            </select>
            {errors.year && <span className="text-red-400 text-xs font-mono mt-1 block">{errors.year}</span>}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isCapacityFull || isSubmitting || Boolean(duplicateAlert)}
            className="btn-hr-primary w-full text-sm font-extrabold py-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>PROCESSING REGISTRATION NODE...</span>
              </>
            ) : isCapacityFull ? (
              <span>REGISTRATION CLOSED (1000/1000 FULL)</span>
            ) : (
              <span>CONFIRM & SUBMIT REGISTRATION NODE</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
