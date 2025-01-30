import { updateUserUsername } from '@/lib/data/users';
import { NextRequest, NextResponse } from 'next/server';
import { init } from '@kinde/management-api-js';
import {
  addUsernameIdentity,
  deleteIdentity,
  getUserIdentities,
} from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function POST(request: NextRequest) {
  const { username, userId, connectionId } = await request.json();

  const { refreshTokens } = getKindeServerSession();
  if (!username) {
    return NextResponse.json(
      { message: 'Username is required to update username' },
      { status: 400 },
    );
  }

  try {
    const dbUsernameUpdatelog = await updateUserUsername(userId, username);
    console.log(
      'Username Updated Successfully on Database',
      dbUsernameUpdatelog,
    );
    init();

    //
    // Step 1: Fetch the user's identities
    const identities = await getUserIdentities(userId);
    // Find the username identity
    const usernameIdentity = identities.find(
      (identity: { type: string }) => identity.type === 'username',
    );
    if (!usernameIdentity) {
      const newIdentity = await addUsernameIdentity(
        userId,
        username,
        connectionId,
      );
      console.log(
        'Username Created Successfully on both Database and Kinde',
        newIdentity,
      );
      await refreshTokens();
      revalidatePath('/dashboard');

      return NextResponse.json(
        { message: 'Username Created Successfully on both Database and Kinde' },
        { status: 200 },
      );
    } else {
      const identityId = usernameIdentity.id;

      // Step 2: Delete the old username identity
      await deleteIdentity(identityId);

      // Step 3: Add the new username identity
      const newIdentity = await addUsernameIdentity(
        userId,
        username,
        connectionId,
      );
      console.log(
        'Username Updated Successfully on both Database and Kinde',
        newIdentity,
      );
      await refreshTokens();

      revalidatePath('/dashboard');
      return NextResponse.json(
        { message: 'Username Succesfully updated on both Database and Kinde' },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log('There was a problem updating the user username: ', error);
  }
}
