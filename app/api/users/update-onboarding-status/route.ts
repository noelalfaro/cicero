import { updateUserOnboardingStatus } from '@/lib/data/users';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId, onboarding_status } = await request.json();

  if (!userId) {
    return NextResponse.json(
      {
        message: 'User id is required to update update user onboarding status',
      },
      { status: 400 },
    );
  }

  try {
    await updateUserOnboardingStatus(userId, onboarding_status);
    return NextResponse.json(
      { message: 'Onboarding Status Updated' },
      { status: 200 },
    );
  } catch (error) {
    console.log(
      "There was an error updating the user's onboarding status" + error,
    );
  }
}
