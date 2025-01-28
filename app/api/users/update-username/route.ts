import { updateUserUsername } from '@/lib/data/users';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { username, userId } = await request.json();

  if (!username) {
    return NextResponse.json(
      { message: 'Username is required to update username' },
      { status: 400 },
    );
  }

  try {
    await updateUserUsername(username, userId);
    // TODO: Update the username in the kinde auth records

    return NextResponse.json({ message: 'Username updated' }, { status: 200 });
  } catch (error) {
    console.log('There was a problem updating the user username: ', error);
  }
}
