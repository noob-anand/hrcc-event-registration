import { NextResponse } from 'next/server';
import { getStatsDb } from '@/lib/supabase';

export async function GET() {
  try {
    const stats = await getStatsDb();
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to load event statistics.'
    }, { status: 500 });
  }
}
