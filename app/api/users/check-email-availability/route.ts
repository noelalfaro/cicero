import { NextRequest, NextResponse } from 'next/server';
import { checkEmailAvailability } from '@/lib/data/registration';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { message: 'Username is required' },
      { status: 400 },
    );
  }

  try {
    const isAvailable = await checkEmailAvailability(email);
    console.log('Availability: ' + isAvailable);
    return NextResponse.json({ isAvailable });
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { message: 'Failed to check email' },
      { status: 500 },
    );
  }
}
