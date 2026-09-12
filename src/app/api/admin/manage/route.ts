import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrationsDb, deleteRegistrationDb, updateRegistrationDb } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const records = await getAllRegistrationsDb();
    return NextResponse.json({
      success: true,
      records
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch registrations.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Registration ID required for deletion.' }, { status: 400 });
    }

    const result = await deleteRegistrationDb(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete registration.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Registration ID required for updates.' }, { status: 400 });
    }

    const result = await updateRegistrationDb(id, updates);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update registration.' }, { status: 500 });
  }
}
