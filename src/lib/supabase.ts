import { createClient } from '@supabase/supabase-js';
import { RegistrationRecord, EventStats, generateRegistrationId } from './utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  (supabaseAnonKey || supabaseServiceKey)
);

export const supabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseAdmin = isSupabaseConfigured && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabaseClient;

// INITIAL DATABASE STORE
let memoryStore: RegistrationRecord[] = [];

// DATABASE OPERATIONAL APIS

export async function checkScholarExistsDb(scholarNumber: string): Promise<{ exists: boolean; record?: RegistrationRecord }> {
  const normalized = scholarNumber.trim().toUpperCase();

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .ilike('scholar_number', normalized)
      .maybeSingle();

    if (!error && data) {
      return { exists: true, record: data as RegistrationRecord };
    }
  }

  const found = memoryStore.find(r => r.scholar_number.toUpperCase() === normalized);
  return { exists: Boolean(found), record: found };
}

export async function getStatsDb(): Promise<EventStats> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin.rpc('get_event_stats');
    if (!error && data) {
      return data as EventStats;
    }

    // Direct count fallback query
    const { count: total } = await supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true });
    const { count: vector } = await supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }).ilike('registration_type', '%Placement & Internship%');
    const { count: aiml } = await supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }).ilike('registration_type', '%Placement Roadmap%');
    const { count: both } = await supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }).ilike('registration_type', '%Speaker%');

    const tot = total || 0;
    return {
      total: tot,
      vector: vector || 0,
      aiml: aiml || 0,
      both: both || 0,
      max_capacity: 1000,
      remaining: Math.max(0, 1000 - tot)
    };
  }

  const total = memoryStore.length;
  const vector = memoryStore.filter(r => r.registration_type.includes('Placement & Internship')).length;
  const aiml = memoryStore.filter(r => r.registration_type.includes('Placement Roadmap')).length;
  const both = memoryStore.filter(r => r.registration_type.includes('Speaker')).length;

  return {
    total,
    vector,
    aiml,
    both,
    max_capacity: 1000,
    remaining: Math.max(0, 1000 - total)
  };
}

export async function registerStudentDb(data: {
  name: string;
  scholar_number: string;
  phone: string;
  email: string;
  branch: string;
  year: string;
  registration_type: string;
}): Promise<{ success: boolean; code: string; message: string; record?: RegistrationRecord }> {
  const scholarUpper = data.scholar_number.trim().toUpperCase();

  // Supabase PostgreSQL Execution
  if (isSupabaseConfigured && supabaseAdmin) {
    const regId = generateRegistrationId(data.registration_type);

    const { data: rpcResult, error } = await supabaseAdmin.rpc('register_student', {
      p_registration_id: regId,
      p_scholar_number: scholarUpper,
      p_name: data.name.trim(),
      p_email: data.email.trim(),
      p_phone: data.phone.trim(),
      p_branch: data.branch,
      p_year: data.year,
      p_registration_type: data.registration_type
    });

    if (!error && rpcResult) {
      if (!rpcResult.success) {
        return {
          success: false,
          code: rpcResult.code,
          message: rpcResult.message
        };
      }
      return {
        success: true,
        code: 'SUCCESS',
        message: 'REGISTRATION CONFIRMED',
        record: rpcResult.data as RegistrationRecord
      };
    }
  }

  // Fallback Execution
  const scholarCheck = memoryStore.find(r => r.scholar_number.toUpperCase() === scholarUpper);
  if (scholarCheck) {
    return {
      success: false,
      code: 'DUPLICATE_SCHOLAR',
      message: `REGISTRATION ALREADY EXISTS: Scholar number ${scholarUpper} is already registered.`
    };
  }

  if (memoryStore.length >= 1000) {
    return {
      success: false,
      code: 'CAPACITY_REACHED',
      message: 'REGISTRATION CLOSED: Maximum capacity of 1000 participants has been reached.'
    };
  }

  const newRecord: RegistrationRecord = {
    id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    registration_id: generateRegistrationId(data.registration_type, memoryStore.length + 1),
    scholar_number: scholarUpper,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    branch: data.branch,
    year: data.year,
    registration_type: data.registration_type,
    created_at: new Date().toISOString()
  };

  memoryStore.unshift(newRecord);

  return {
    success: true,
    code: 'SUCCESS',
    message: 'REGISTRATION CONFIRMED',
    record: newRecord
  };
}

export async function getAllRegistrationsDb(): Promise<RegistrationRecord[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as RegistrationRecord[];
    }
  }

  return [...memoryStore];
}

export async function deleteRegistrationDb(id: string): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from('registrations')
      .delete()
      .eq('id', id);

    if (!error) {
      return { success: true, message: 'Registration permanently deleted from database.' };
    }
  }

  const initialCount = memoryStore.length;
  memoryStore = memoryStore.filter(r => r.id !== id);

  if (memoryStore.length < initialCount) {
    return { success: true, message: 'Registration permanently deleted.' };
  }

  return { success: false, message: 'Record not found.' };
}

export async function updateRegistrationDb(id: string, updates: Partial<RegistrationRecord>): Promise<{ success: boolean; record?: RegistrationRecord }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      return { success: true, record: data as RegistrationRecord };
    }
  }

  const index = memoryStore.findIndex(r => r.id === id);
  if (index !== -1) {
    memoryStore[index] = { ...memoryStore[index], ...updates };
    return { success: true, record: memoryStore[index] };
  }

  return { success: false };
}
