import { NextRequest, NextResponse } from 'next/server';
import { checkUsernameAvailability } from '@/lib/data/registration';

export async function POST(request: NextRequest) {
  const { username } = await request.json();

  if (!username) {
    return NextResponse.json(
      { message: 'Username is required' },
      { status: 400 },
    );
  }

  try {
    const isAvailable = await checkUsernameAvailability(username);
    console.log('Availability: ' + isAvailable);
    return NextResponse.json({ isAvailable });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { message: 'Failed to check username' },
      { status: 500 },
    );
  }
}
