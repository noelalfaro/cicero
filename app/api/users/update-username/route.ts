import { updateUserUsername } from '@/lib/data/users';
import { NextRequest, NextResponse } from 'next/server';
import { init } from '@kinde/management-api-js';
import {
  addUsernameIdentity,
  deleteIdentity,
  getUserIdentities,
} from '@/lib/utils';

export async function POST(request: NextRequest) {
  const { username, userId, connectionId } = await request.json();

  if (!username) {
    return NextResponse.json(
      { message: 'Username is required to update username' },
      { status: 400 },
    );
  }

  try {
    await updateUserUsername(username, userId);
    init();

    // Step 1: Fetch the user's identities
    const identities = await getUserIdentities(userId);

    // Find the username identity
    const usernameIdentity = identities.find(
      (identity: { type: string }) => identity.type === 'username',
    );
    if (!usernameIdentity) {
      throw new Error('No username identity found for this user.');
    }

    const identityId = usernameIdentity.id;

    // Step 2: Delete the old username identity
    await deleteIdentity(identityId);

    // Step 3: Add the new username identity
    const newIdentity = await addUsernameIdentity(
      userId,
      username,
      connectionId,
    );

    console.log('Username updated successfully:', newIdentity);
    return NextResponse.json({ message: 'Username updated' }, { status: 200 });
  } catch (error) {
    console.log('There was a problem updating the user username: ', error);
  }
}
