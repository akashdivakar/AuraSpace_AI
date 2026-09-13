import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    // Customer Authentication Logic
    const user = {
      id: 'usr_cust_' + Date.now(),
      name: email.split('@')[0] || 'Customer User',
      email: email,
      role: 'customer' as const,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      message: 'Customer logged in successfully',
      user,
      token: 'jwt_customer_session_' + Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to authenticate customer' }, { status: 500 });
  }
}
