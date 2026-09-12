import { NextRequest, NextResponse } from 'next/server';
import { registerStudentDb } from '@/lib/supabase';
import { validateEmail, validatePhone, validateScholarNumber } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, scholar_number, phone, email, branch, year, registration_type } = body;

    // Validate required fields
    if (!name || !scholar_number || !phone || !email || !branch || !year || !registration_type) {
      return NextResponse.json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'All registration fields are required.'
      }, { status: 400 });
    }

    // Input validations
    if (!validateEmail(email)) {
      return NextResponse.json({
        success: false,
        code: 'INVALID_EMAIL',
        message: 'Please provide a valid email address (e.g. name@student.iiitbhopal.ac.in).'
      }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({
        success: false,
        code: 'INVALID_PHONE',
        message: 'Please enter a valid 10-digit mobile number.'
      }, { status: 400 });
    }

    if (!validateScholarNumber(scholar_number)) {
      return NextResponse.json({
        success: false,
        code: 'INVALID_SCHOLAR',
        message: 'Please provide a valid Scholar Number.'
      }, { status: 400 });
    }

    if (!['VECTOR 2.0', 'AI/ML WORKSHOP', 'BOTH'].includes(registration_type)) {
      return NextResponse.json({
        success: false,
        code: 'INVALID_TYPE',
        message: 'Invalid event registration option selected.'
      }, { status: 400 });
    }

    // Process Database Registration
    const result = await registerStudentDb({
      name,
      scholar_number,
      phone,
      email,
      branch,
      year,
      registration_type
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 409 }); // Conflict / Duplicate
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Server error processing registration. Please try again.'
    }, { status: 500 });
  }
}
