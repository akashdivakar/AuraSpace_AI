import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, adminKey } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Admin email and password are required' }, { status: 400 });
    }

    const user = {
      id: 'usr_admin_' + Date.now(),
      name: name || 'System Administrator',
      email: email,
      role: 'admin' as const,
      createdAt: new Date().toISOString().split('T')[0],
      permissions: ['full_control', 'user_management', 'api_monitoring', 'system_logs'],
    };

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      user,
      token: 'jwt_admin_secure_session_' + Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create admin account' }, { status: 500 });
  }
}
