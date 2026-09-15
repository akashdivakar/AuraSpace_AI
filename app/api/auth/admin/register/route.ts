import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Public administrator registration is disabled. Please log in with authorized admin credentials.' },
    { status: 403 }
  );
}
