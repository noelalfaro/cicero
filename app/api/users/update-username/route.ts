import { updateUserUsername, updateUserDisplayName } from '@/lib/data/users';
import { NextRequest, NextResponse } from 'next/server';
import { init } from '@kinde/management-api-js';
import {
  addUsernameIdentity,
  deleteIdentity,
  getUserIdentities,
} from '@/server/kinde/utils';
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
    // We first update the username and set a display name in the database
    console.log(await updateUserUsername(userId, username));
    console.log(await updateUserDisplayName(userId, username));
    // console.log(dbUsernameUpdateLog, '/n', dbDisplayNameUpdateLog);
    init();

    // Then we want to check if a username property already exists on kinde
    // Fetch the user's identities
    const identities = await getUserIdentities(userId);
    const usernameIdentity = identities.find(
      (identity: { type: string }) => identity.type === 'username',
    );

    // If they don't have a username identity on kinde, we create one.d
    if (!usernameIdentity) {
      const newIdentity = await addUsernameIdentity(
        userId,
        username,
        connectionId,
      );
      // console.log(
      //   'Username Created Successfully on both Database and Kinde',
      //   newIdentity,
      // );
      await refreshTokens();
      revalidatePath('/dashboard');

      return NextResponse.json(
        { message: 'Username Created Successfully on both Database and Kinde' },
        { status: 200 },
      );
    } else {
      // IF they do have a username identity, we must first delete the old one and create a new one
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
