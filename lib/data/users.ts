import 'server-only';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';
import { User } from '@/lib/definitions';
import { db } from '@/server/db';

export async function createUser(user: User) {
  try {
    console.log('Attempting to create user in DB:', user);
    const result = await db.insert(users).values(user).returning();
    console.log('User successfully created in DB:', result);
    return result;
  } catch (error) {
    console.error('ERROR in createUser:', error);
    throw error;
  }
}

export async function updateUser(user: User): Promise<string> {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id));
  if (existingUser[0]) {
    await db.update(users).set(user).where(eq(users.id, user.id));
    return 'Successfully updated user';
  } else {
    return 'User not found';
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const existingUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  return existingUser[0];
}

export async function fetchUserDataByUsername(username: string): Promise<User> {
  const existingUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return existingUser[0];
}

export async function fetchUserDataById(id: string): Promise<User | null> {
  const existingUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  // console.log(existingUser);

  if (!existingUser) return null;

  return existingUser[0];
}

export async function updateUserDisplayName(userId: string, username: string) {
  await db
    .update(users)
    .set({ username: username, display_name: username })
    .where(eq(users.id, userId));
  const updatedUser = await db
    .select({ display_name: users.display_name, id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return (
    'Successfully updated display name on Database: ' +
    updatedUser[0]?.display_name +
    ' - For user: ' +
    updatedUser[0]?.id
  );
}
export interface OnboardingData {
  username: string;
  hometown?: string | null;
  favorite_team?: string | null;
  goat?: string | null;
  picture?: string | null;
  social_platform?: 'X (Twitter)' | 'Threads' | 'BlueSky' | null;
  social_handle?: string | null;
  age?: number | null;
}

export async function completeOnboardingUpdate(
  userId: string,
  data: OnboardingData,
) {
  try {
    const user = await db
      .update(users)
      .set({
        username: data.username,
        display_name: data.username, // Set display name to username by default
        hometown: data.hometown,
        favorite_team: data.favorite_team,
        goat: data.goat,
        picture: data.picture, // Make sure 'picture' is the column name in your schema
        social_platform: data.social_platform,
        social_handle: data.social_handle,
        age: data.age,
        onboarding_status: true, // Mark onboarding as complete!
      })
      .where(eq(users.id, userId)) // 3. Specify the condition for the update
      .returning({ updatedId: users.id });
    // Check if the update actually happened
    if (user.length === 0) {
      throw new Error(`User with ID ${userId} not found for update.`);
    }

    return user[0];
  } catch (error) {
    console.error('Failed to complete onboarding update in database:', error);
    // Re-throw the error to be handled by the API route
    throw new Error('Database update failed during onboarding.');
  }
}

export async function updateUserUsername(
  userId: string,
  newUsername: string,
): Promise<string> {
  if (!userId || !newUsername) {
    const errorMessage = `Invalid input: userId or newUsername is missing. Cannot update username. UserID: ${userId}, Username: ${newUsername}`;
    console.error(errorMessage);
    // Consider throwing an error here or returning a more structured error response
    // For now, returning the message to be logged by the API route
    return errorMessage;
  }

  console.log(
    `Attempting to update username in DB for userId: ${userId} to newUsername: ${newUsername}`,
  );

  try {
    // Step 1: Perform the update
    const updateResult = await db
      .update(users)
      .set({ username: newUsername }) // Use newUsername to avoid confusion with the table column
      .where(eq(users.id, userId));

    // updateResult from Drizzle for an update usually gives metadata,
    // like rowsAffected. Let's assume it's an object or number.
    // For PostgreSQL with node-postgres, it's an object like { command: 'UPDATE', rowCount: 1 }
    console.log('Drizzle update result:', updateResult);

    // It's good to check if any rows were actually affected by the update.
    // The exact way to check rowsAffected depends on your Drizzle driver/adapter.
    // For pg, updateResult.rowCount is common.
    // If updateResult.rowCount === 0 (or equivalent check), no user was found with that ID.
    // This check is crucial.

    // Step 2: Fetch the user to confirm the update and get the new username
    const fetchedUserArray = await db
      .select({ username: users.username, id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (fetchedUserArray.length > 0) {
      const updatedUser = fetchedUserArray[0];
      if (updatedUser.username === newUsername) {
        const successMessage = `Successfully updated username on Database to: '${updatedUser.username}' - For user ID: '${updatedUser.id}'`;
        console.log(successMessage);
        return successMessage;
      } else {
        // This case is strange: user found, but username didn't update as expected.
        const warningMessage = `DB: User ${userId} found, but username is still '${updatedUser.username}', expected '${newUsername}'. Update might have partially failed or there's a race condition.`;
        console.warn(warningMessage);
        return warningMessage;
      }
    } else {
      // This is the critical case: User was NOT found by ID after the update attempt.
      // This means the initial record for this Kinde userId likely never existed in your 'users' table.
      const errorMessage = `DB: FAILED to update username. User with ID '${userId}' not found in the database. The user record might not have been created yet.`;
      console.error(errorMessage);
      // It's important that your API route handles this message appropriately,
      // as this indicates a failure.
      return errorMessage;
    }
  } catch (error) {
    console.error(`DB Error updating username for userId ${userId}:`, error);
    // Re-throw the error or return a structured error message
    throw new Error(
      `Database error during username update for user ${userId}.`,
    );
  }
}

export async function updateUserOnboardingStatus(
  userId: string,
  onboarding_status: boolean,
) {
  await db
    .update(users)
    .set({ onboarding_status: onboarding_status })
    .where(eq(users.id, userId));
}

export async function fetchUserConnectionId(
  userId: string,
): Promise<string | null> {
  try {
    const result = await db
      .select({ social_connection_id: users.social_connection_id }) // Select only the needed column
      .from(users)
      .where(eq(users.id, userId))
      .limit(1); // Ensure we only expect one record

    if (result.length > 0 && result[0].social_connection_id) {
      // User found and social_connection_id is not null/undefined
      return result[0].social_connection_id;
    } else {
      // User not found, or user found but no social_connection_id
      return null;
    }
  } catch (error) {
    console.error('Error fetching user connection ID from DB:', error);
    // Depending on your error handling strategy, you might re-throw or return null
    return null;
  }
}

export async function getCiceroUser(userId: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.id, userId));
  return result[0];
}
