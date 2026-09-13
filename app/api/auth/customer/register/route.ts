import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = {
      id: 'usr_cust_' + Date.now(),
      name: name || email.split('@')[0] || 'New Customer',
      email: email,
      role: 'customer' as const,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      message: 'Customer registered successfully',
      user,
      token: 'jwt_customer_session_' + Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to register customer' }, { status: 500 });
  }
}
