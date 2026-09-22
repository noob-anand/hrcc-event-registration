export interface RegistrationRecord {
  id: string;
  registration_id: string;
  scholar_number: string;
  name: string;
  email: string;
  phone: string;
  degree?: string;
  branch: string;
  year: string;
  registration_type: string;
  created_at: string;
}

export interface EventStats {
  total: number;
  vector: number;
  aiml: number;
  both: number;
  max_capacity: number;
  remaining: number;
}

// Generate unique Registration ID format: HRCC-RN-[SEQUENCE]
export function generateRegistrationId(type: string, sequenceNumber?: number): string {
  let prefix = 'RN';
  if (type.includes('Placement & Internship')) prefix = 'SENIOR';
  if (type.includes('Placement Roadmap')) prefix = 'JUNIOR';

  const randomNum = sequenceNumber
    ? String(sequenceNumber).padStart(4, '0')
    : String(Math.floor(100 + Math.random() * 9000)).padStart(4, '0');

  return `HRCC-${prefix}-${randomNum}`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase();
  } catch (e) {
    return dateStr;
  }
}

export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
  return /^\d{10,12}$/.test(cleaned);
}

export function validateScholarNumber(scholar: string): boolean {
  const cleaned = scholar.trim();
  return cleaned.length >= 4 && cleaned.length <= 25 && /^[a-zA-Z0-9\/_-]+$/.test(cleaned);
}

export function exportToCSV(records: RegistrationRecord[]): void {
  if (!records || records.length === 0) return;

  const headers = [
    'Registration ID',
    'Name',
    'Scholar Number',
    'Phone',
    'Email',
    'Degree',
    'Branch',
    'Year',
    'Registration Track',
    'Registration Time'
  ];

  const rows = records.map(r => [
    `"${r.registration_id}"`,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.scholar_number}"`,
    `"${r.phone}"`,
    `"${r.email}"`,
    `"${r.degree || 'B.Tech'}"`,
    `"${r.branch}"`,
    `"${r.year}"`,
    `"${r.registration_type}"`,
    `"${formatDate(r.created_at)}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `HRCC_Rohit_Negi_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
