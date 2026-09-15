import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Admin email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Strict Administrator Authentication Check
    if (normalizedEmail !== 'sarath1234@gmail.com' || trimmedPassword !== 'sarath@98') {
      return NextResponse.json(
        { error: 'Invalid administrator credentials. Access restricted.' },
        { status: 401 }
      );
    }

    const user = {
      id: 'usr_admin_sarath',
      name: 'Sarath (System Admin)',
      email: 'sarath1234@gmail.com',
      role: 'admin' as const,
      createdAt: '2026-01-01',
      permissions: ['full_control', 'user_management', 'api_monitoring', 'system_logs'],
    };

    return NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      user,
      token: 'jwt_admin_secure_session_' + Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to authenticate admin' }, { status: 500 });
  }
}

