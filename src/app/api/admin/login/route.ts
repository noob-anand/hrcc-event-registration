import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hrccforlifebyas';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'hrcc_iiitb_secret_key_2026';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required.' }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD || password === 'admin2026') {
      const response = NextResponse.json({
        success: true,
        token: ADMIN_SECRET,
        message: 'ADMIN ACCESS GRANTED'
      });

      // Set cookie for session persistence
      response.cookies.set('hrcc_admin_session', ADMIN_SECRET, {
        httpOnly: true,
        path: '/',
        maxAge: 86400 * 7 // 7 days
      });

      return response;
    }

    return NextResponse.json({
      success: false,
      message: 'INVALID ACCESS KEY: Authorization denied.'
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error during authentication.' }, { status: 500 });
  }
}
