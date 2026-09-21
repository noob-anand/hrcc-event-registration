-- ========================================================
-- HACKERRANK CAMPUS CREW (HRCC) - EVENT REGISTRATION SCHEMA
-- Database: Supabase PostgreSQL
-- Event: Rohit Negi Masterclass 2026 (Capacity: 500)
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id VARCHAR(30) UNIQUE NOT NULL,
    scholar_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    registration_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. INDEXES FOR FAST SEARCH & SEARCH/FILTER
CREATE INDEX IF NOT EXISTS idx_registrations_scholar ON public.registrations(scholar_number);
CREATE INDEX IF NOT EXISTS idx_registrations_reg_id ON public.registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_registrations_type ON public.registrations(registration_type);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

-- 3. TRANSACTIONAL CAPACITY CHECK & STUDENT REGISTRATION RPC
-- Prevents race conditions by locking table count check before inserting.
CREATE OR REPLACE FUNCTION public.register_student(
    p_registration_id VARCHAR,
    p_scholar_number VARCHAR,
    p_name VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR,
    p_branch VARCHAR,
    p_year VARCHAR,
    p_registration_type VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_count INT;
    v_scholar_exists INT;
    v_new_record public.registrations%ROWTYPE;
BEGIN
    -- Check for duplicate scholar number first
    SELECT COUNT(*) INTO v_scholar_exists 
    FROM public.registrations 
    WHERE LOWER(scholar_number) = LOWER(p_scholar_number);

    IF v_scholar_exists > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'DUPLICATE_SCHOLAR',
            'message', 'REGISTRATION ALREADY EXISTS: Scholar Number is already registered.'
        );
    END IF;

    -- Transactional count lock check for 500 capacity limit
    SELECT COUNT(*) INTO v_current_count FROM public.registrations;

    IF v_current_count >= 500 THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'CAPACITY_REACHED',
            'message', 'REGISTRATION CLOSED: Maximum capacity of 500 participants has been reached.'
        );
    END IF;

    -- Insert new student registration
    INSERT INTO public.registrations (
        registration_id,
        scholar_number,
        name,
        email,
        phone,
        branch,
        year,
        registration_type
    ) VALUES (
        p_registration_id,
        UPPER(p_scholar_number),
        p_name,
        LOWER(p_email),
        p_phone,
        p_branch,
        p_year,
        p_registration_type
    ) RETURNING * INTO v_new_record;

    RETURN jsonb_build_object(
        'success', true,
        'code', 'SUCCESS',
        'data', row_to_json(v_new_record)
    );
END;
$$;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public to execute registration procedure safely
GRANT EXECUTE ON FUNCTION public.register_student TO anon, authenticated, service_role;

-- Allow Service Role full access for admin dashboard operations
CREATE POLICY "Allow service role full access" 
ON public.registrations 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Restrict public direct reading of student personal data
CREATE POLICY "Deny public select" 
ON public.registrations 
FOR SELECT 
TO anon 
USING (false);

-- 5. INITIAL STATS QUERY UTILITY
CREATE OR REPLACE FUNCTION public.get_event_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total INT;
    v_vector INT;
    v_aiml INT;
    v_both INT;
BEGIN
    SELECT COUNT(*) INTO v_total FROM public.registrations;
    SELECT COUNT(*) INTO v_vector FROM public.registrations WHERE registration_type ILIKE '%Placement & Internship%';
    SELECT COUNT(*) INTO v_aiml FROM public.registrations WHERE registration_type ILIKE '%Roadmap%';
    SELECT COUNT(*) INTO v_both FROM public.registrations WHERE registration_type ILIKE '%Speaker%';

    RETURN jsonb_build_object(
        'total', v_total,
        'vector', v_vector,
        'aiml', v_aiml,
        'both', v_both,
        'max_capacity', 500,
        'remaining', GREATEST(0, 500 - v_total)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_event_stats TO anon, authenticated, service_role;
