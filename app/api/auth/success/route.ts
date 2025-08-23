import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { User } from '@/lib/definitions';
import { createUser, getUserById, updateUser } from '@/lib/data/users';
import { NextResponse } from 'next/server';

const DEFAULT_AVATAR =
  'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg';

export async function GET(request: Request) {
  console.log('--- /api/auth/success: User sync process started ---');

  const redirectURLBase =
    process.env.KINDE_SITE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app'
      : 'http://localhost:3000');

  try {
    const { getIdToken } = getKindeServerSession();
    const idToken = await getIdToken();
    const idJSON = JSON.stringify(idToken);
    const user = JSON.parse(idJSON);
    console.log(user);

    await syncUserWithDatabase(idToken);

    console.log(`/api/auth/success: User ${idToken?.sub} synced successfully`);

    return NextResponse.redirect(new URL('/dashboard', redirectURLBase));
  } catch (error) {
    console.error('/api/auth/success: Critical error during user sync:', error);
    return NextResponse.redirect(
      new URL('/error?message=sync-failed&code=AS500', redirectURLBase),
    );
  }
}

async function syncUserWithDatabase(idToken: any): Promise<User> {
  const userId = idToken.sub;
  const userRecord = await getUserById(userId);

  if (!userRecord) {
    console.log(`/api/auth/success: Creating new user record for ${userId}`);
    if (idToken.picture) {
      idToken.picture = idToken.picture.replace('s96-c', 's400-c'); // Or a higher resolution
    }
    // Create new user with default onboarding status false
    const newUser: User = {
      id: userId,
      email: idToken.email ?? '',
      username: null, // Will be set during onboarding
      display_name:
        idToken.name ??
        idToken.given_name ??
        idToken.family_name ??
        idToken.email?.split('@')[0] ??
        'New User',
      picture: idToken.picture ?? DEFAULT_AVATAR,
      onboarding_status: false, // New users always need onboarding
      social_connection_id: idToken.ext_provider?.name ?? null,
    };

    const createdUserArray = await createUser(newUser);
    if (!createdUserArray || createdUserArray.length === 0) {
      throw new Error('User creation failed - no user returned from database');
    }

    console.log(`/api/auth/success: Successfully created user ${userId}`);
    return createdUserArray[0];
  } else {
    console.log(
      `/api/auth/success: User ${userId} exists, checking for updates`,
    );

    // Update existing user if needed
    const updates: Partial<User> = {};

    // Update social connection if not set and available from token
    if (!userRecord.social_connection_id && idToken.ext_provider?.name) {
      updates.social_connection_id = idToken.ext_provider.name;
      console.log(
        `/api/auth/success: Updating social_connection_id for user ${userId}`,
      );
    }

    if (Object.keys(updates).length > 0) {
      await updateUser({ ...userRecord, ...updates });
      console.log(`/api/auth/success: Updated user ${userId} with:`, updates);
    }

    return userRecord;
  }
}
