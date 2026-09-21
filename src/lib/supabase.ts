import { createClient } from '@supabase/supabase-js';
import { RegistrationRecord, EventStats, generateRegistrationId } from './utils';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  (supabaseAnonKey || supabaseServiceKey)
);

export const supabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey)
  : null;

export const supabaseAdmin = isSupabaseConfigured && (supabaseServiceKey || supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
  : supabaseClient;

// INITIAL DATABASE STORE (FOR LOCAL DEMO IF SUPABASE UNCONFIGURED)
let memoryStore: RegistrationRecord[] = [];

// DATABASE OPERATIONAL APIS

export async function checkScholarExistsDb(scholarNumber: string): Promise<{ exists: boolean; record?: RegistrationRecord }> {
  const normalized = scholarNumber.trim().toUpperCase();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('registrations')
        .select('*')
        .ilike('scholar_number', normalized)
        .maybeSingle();

      if (!error && data) {
        return { exists: true, record: data as RegistrationRecord };
      }
    } catch (e) {
      console.error('Check scholar Supabase error:', e);
    }
  }

  const found = memoryStore.find(r => r.scholar_number.toUpperCase() === normalized);
  return { exists: Boolean(found), record: found };
}

export async function getStatsDb(): Promise<EventStats> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.rpc('get_event_stats');
      if (!error && data) {
        return data as EventStats;
      }
    } catch (e) {
      // Fallback to direct table count query
    }

    try {
      const { count: total } = await supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true });
      const { count: vector } = await supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }).ilike('registration_type', '%Placement & Internship%');
      const { count: aiml } = await supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }).ilike('registration_type', '%Roadmap%');
      const { count: both } = await supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }).ilike('registration_type', '%Speaker%');

      const tot = total || 0;
      return {
        total: tot,
        vector: vector || 0,
        aiml: aiml || 0,
        both: both || 0,
        max_capacity: 500,
        remaining: Math.max(0, 500 - tot)
      };
    } catch (e) {
      console.error('Stats fetch Supabase error:', e);
    }
  }

  const total = memoryStore.length;
  const vector = memoryStore.filter(r => r.registration_type.includes('Placement & Internship')).length;
  const aiml = memoryStore.filter(r => r.registration_type.includes('Roadmap')).length;
  const both = memoryStore.filter(r => r.registration_type.includes('Speaker')).length;

  return {
    total,
    vector,
    aiml,
    both,
    max_capacity: 500,
    remaining: Math.max(0, 500 - total)
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

    // 1. Try RPC procedure first
    try {
      const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('register_student', {
        p_registration_id: regId,
        p_scholar_number: scholarUpper,
        p_name: data.name.trim(),
        p_email: data.email.trim().toLowerCase(),
        p_phone: data.phone.trim(),
        p_branch: data.branch,
        p_year: data.year,
        p_registration_type: data.registration_type
      });

      if (!rpcError && rpcResult) {
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

      if (rpcError) {
        console.warn('Supabase RPC register_student warning:', rpcError.message);
      }
    } catch (rpcEx) {
      console.warn('Supabase RPC exception:', rpcEx);
    }

    // 2. Direct Supabase Table Insert Fallback (guarantees table population)
    try {
      // Check duplicate scholar number in table
      const { data: existingScholar } = await supabaseAdmin
        .from('registrations')
        .select('scholar_number')
        .ilike('scholar_number', scholarUpper)
        .maybeSingle();

      if (existingScholar) {
        return {
          success: false,
          code: 'DUPLICATE_SCHOLAR',
          message: `REGISTRATION ALREADY EXISTS: Scholar Number ${scholarUpper} is already registered.`
        };
      }

      // Check capacity limit (500 max)
      const { count: currentCount } = await supabaseAdmin
        .from('registrations')
        .select('*', { count: 'exact', head: true });

      if (currentCount && currentCount >= 500) {
        return {
          success: false,
          code: 'CAPACITY_REACHED',
          message: 'REGISTRATION CLOSED: Maximum capacity of 500 participants has been reached.'
        };
      }

      // Direct insert into public.registrations
      const { data: insertedRecord, error: insertError } = await supabaseAdmin
        .from('registrations')
        .insert({
          registration_id: regId,
          scholar_number: scholarUpper,
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          branch: data.branch,
          year: data.year,
          registration_type: data.registration_type
        })
        .select()
        .single();

      if (!insertError && insertedRecord) {
        return {
          success: true,
          code: 'SUCCESS',
          message: 'REGISTRATION CONFIRMED',
          record: insertedRecord as RegistrationRecord
        };
      }

      if (insertError) {
        console.error('Supabase direct insert error:', insertError);
        return {
          success: false,
          code: 'DATABASE_ERROR',
          message: `Database error: ${insertError.message}`
        };
      }
    } catch (dbEx: any) {
      console.error('Supabase direct insert exception:', dbEx);
      return {
        success: false,
        code: 'DATABASE_EXCEPTION',
        message: dbEx?.message || 'Database execution exception.'
      };
    }
  }

  // Fallback Execution for local testing if Supabase is unconfigured
  const scholarCheck = memoryStore.find(r => r.scholar_number.toUpperCase() === scholarUpper);
  if (scholarCheck) {
    return {
      success: false,
      code: 'DUPLICATE_SCHOLAR',
      message: `REGISTRATION ALREADY EXISTS: Scholar number ${scholarUpper} is already registered.`
    };
  }

  if (memoryStore.length >= 500) {
    return {
      success: false,
      code: 'CAPACITY_REACHED',
      message: 'REGISTRATION CLOSED: Maximum capacity of 500 participants has been reached.'
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
    try {
      const { data, error } = await supabaseAdmin
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as RegistrationRecord[];
      }
    } catch (e) {
      console.error('Get all registrations Supabase error:', e);
    }
  }

  return [...memoryStore];
}

export async function deleteRegistrationDb(id: string): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from('registrations')
        .delete()
        .eq('id', id);

      if (!error) {
        return { success: true, message: 'Registration permanently deleted from database.' };
      }
    } catch (e) {
      console.error('Delete registration Supabase error:', e);
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
    try {
      const { data, error } = await supabaseAdmin
        .from('registrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return { success: true, record: data as RegistrationRecord };
      }
    } catch (e) {
      console.error('Update registration Supabase error:', e);
    }
  }

  const index = memoryStore.findIndex(r => r.id === id);
  if (index !== -1) {
    memoryStore[index] = { ...memoryStore[index], ...updates };
    return { success: true, record: memoryStore[index] };
  }

  return { success: false };
}
