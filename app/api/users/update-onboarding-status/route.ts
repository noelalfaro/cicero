import { updateUserOnboardingStatus } from '@/lib/data/users';
import { NextRequest, NextResponse } from 'next/server';
import {
  Users,
  UpdateUserPropertiesResponse,
  init,
} from '@kinde/management-api-js';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function POST(request: NextRequest) {
  const { userId, onboarding_status } = await request.json();
  const { refreshTokens } = getKindeServerSession();

  init({
    kindeDomain: process.env.KINDE_ISSUER_URL!,
    clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID!,
    clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET!,
  });

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
    // console.log('Onboarding status Updated on Database');
    const propertiesPayloadForSdk = {
      properties: {
        onboarding_completed: 'true',
      },
    };

    const updateData = {
      userId: userId,
      requestBody: propertiesPayloadForSdk,
    };

    try {
      const sdkResponse: UpdateUserPropertiesResponse =
        await Users.updateUserProperties(updateData);
      // console.log('Onboarding Status Updated on Kinde: ', sdkResponse);
      await refreshTokens();
    } catch (error) {
      console.log(
        ':( There was an error updating the user property on kinde',
        error,
      );
    }

    return NextResponse.json(
      { message: 'Onboarding Status Updated on both DB and Kinde' },
      { status: 200 },
    );
  } catch (error) {
    console.log(
      "There was an error updating the user's onboarding status" + error,
    );
  }
}
