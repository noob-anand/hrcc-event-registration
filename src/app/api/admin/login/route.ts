import { NextRequest, NextResponse } from 'next/server';

const ADMIN_ID = process.env.ADMIN_ID || 'priyanshusoniking';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hrccforlifebyas';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'hrcc_iiitb_secret_key_2026';

export async function POST(req: NextRequest) {
  try {
    const { admin_id, password } = await req.json();

    if (!admin_id || !password) {
      return NextResponse.json({
        success: false,
        message: 'Both Admin ID and Password are required.'
      }, { status: 400 });
    }

    const validId = admin_id.trim() === ADMIN_ID;
    const validPassword = password === ADMIN_PASSWORD ;

    if (validId && validPassword) {
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
      message: 'INVALID CREDENTIALS: Admin ID or Password is incorrect.'
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error during authentication.'
    }, { status: 500 });
  }
}
