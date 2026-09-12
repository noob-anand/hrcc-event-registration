import { NextRequest, NextResponse } from 'next/server';
import { checkScholarExistsDb } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scholar = searchParams.get('scholar');

  if (!scholar) {
    return NextResponse.json({ exists: false });
  }

  const { exists, record } = await checkScholarExistsDb(scholar);

  return NextResponse.json({
    exists,
    message: exists ? `REGISTRATION ALREADY EXISTS: Scholar Number ${scholar.toUpperCase()} is already registered.` : '',
    registration_id: record?.registration_id,
    name: record?.name
  });
}
