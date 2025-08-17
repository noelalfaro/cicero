// app/api/onboarding-complete/route.ts

// --- Imports ---
// For database operations related to user profile and onboarding status
import {
  completeOnboardingUpdate, // Function to update user's profile data in your DB
  updateUserOnboardingStatus, // Function to update onboarding_completed flag in your DB
} from '@/lib/data/users';

// Next.js specific imports for API routes
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // For clearing Next.js cache for specific paths

// Kinde Authentication and Management API related imports
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'; // To get session for refreshTokens
import {
  init, // To initialize Kinde Management API SDK
  Users, // To interact with Kinde's Users API
  UpdateUserPropertiesResponse, // Type for the response from Kinde's API
} from '@kinde/management-api-js';
import {
  addUsernameIdentity, // To add a username identity on Kinde
  deleteIdentity, // To delete an identity on Kinde
  getUserIdentities, // To retrieve user identities from Kinde
} from '@/server/kinde/utils'; // Your custom Kinde utility functions

// Zod for schema validation
import { z } from 'zod';

// --- Zod Schema Definition ---
// Defines the expected shape and validation rules for the INCOMING request body.
// This acts as our API contract and ensures data integrity.
const onboardingSchema = z.object({
  userId: z.string().min(1, 'User ID is required.'), // Kinde userId is essential for all updates
  connectionId: z.string().optional().nullable(), // Optional: Kinde connection ID for identity creation
  username: z.string().min(1, 'Username cannot be empty.'), // Required for profile and identity
  hometown: z.string().optional().nullable(),
  favorite_team: z.string().optional().nullable(),
  goat: z.string().optional().nullable(),
  picture: z.string().url('Invalid URL format for picture.'), // Validate URL if present
  social_platform: z
    .enum(['X (Twitter)', 'Threads', 'BlueSky'])
    .optional()
    .nullable(),
  social_handle: z.string().optional().nullable(),
  age: z
    .number()
    .int('Age must be an integer.')
    .min(1, 'Age must be at least 1.')
    .optional()
    .nullable(),
});

// --- API Route Handler ---
// This is the main POST handler for the /api/onboarding-complete endpoint.
export async function POST(request: NextRequest) {
  // Get the Kinde session for refreshing tokens later.
  const { refreshTokens } = getKindeServerSession();

  try {
    // 1. Parse and Validate Request Body using Zod
    const body = await request.json();
    console.log('[API /onboarding-complete] Received request body:', body);

    const data = onboardingSchema.parse(body); // Zod will throw if validation fails

    // 2. Initialize Kinde Management API SDK
    // This is required before making any calls to Kinde's management API.
    init({
      kindeDomain: process.env.KINDE_ISSUER_URL!,
      clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID!,
      clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET!,
    });

    // --- Core Onboarding Steps ---

    // 3. Update User Profile Data in Your Database
    // This function should handle saving all user-provided profile details (username, hometown, etc.)
    // to your application's database.
    await completeOnboardingUpdate(data.userId, {
      username: data.username,
      hometown: data.hometown,
      favorite_team: data.favorite_team,
      goat: data.goat,
      picture: data.picture,
      social_platform: data.social_platform,
      social_handle: data.social_handle,
      age: data.age,
    });
    console.log(
      `[API /onboarding-complete] User ${data.userId} profile updated in DB.`,
    );

    // 4. Handle Kinde Username Identity Creation/Update
    // This ensures the user's chosen username is synced as an identity in Kinde.
    const identities = await getUserIdentities(data.userId); // Fetch existing identities
    const usernameIdentity = identities?.find(
      (identity) => identity?.type === 'username',
    );

    if (
      usernameIdentity &&
      usernameIdentity.id &&
      typeof usernameIdentity.id === 'string'
    ) {
      // If a username identity already exists, delete the old one to replace it
      await deleteIdentity(usernameIdentity.id);
      console.log(
        `[API /onboarding-complete] Old Kinde username identity deleted for ${data.userId}.`,
      );
    }
    // Always add (or re-add) the new/updated username identity
    await addUsernameIdentity(
      data.userId,
      data.username,
      data.connectionId, // connectionId is optional, pass if available
    );
    console.log(
      `[API /onboarding-complete] Kinde username identity added/updated for ${data.userId}.`,
    );

    // 6. Update onboarding_completed Property on Kinde User Profile
    // This updates the user's public/private properties directly in Kinde's user management system.
    const propertiesPayloadForSdk = {
      properties: {
        onboarding_completed: 'true', // Kinde Management API expects this as a string 'true'/'false'
      },
    };
    const updateDataForKindeSdk = {
      userId: data.userId,
      requestBody: propertiesPayloadForSdk,
    };

    try {
      // Call Kinde Management API to update user properties
      const sdkResponse: UpdateUserPropertiesResponse =
        await Users.updateUserProperties(updateDataForKindeSdk);
      console.log(
        `[API /onboarding-complete] Kinde user properties updated for ${data.userId}.`,
        sdkResponse,
      );
    } catch (error) {
      // Log Kinde API specific errors without necessarily failing the entire onboarding
      // (unless this step is critical and you want to retry/rollback if it fails)
      console.error(
        `[API /onboarding-complete] Warning: Error updating onboarding_completed on Kinde for ${data.userId}:`,
        error,
      );
    }

    // --- Finalization Steps ---

    // 7. Refresh Kinde Tokens for Current Session
    // Ensures the active user's Kinde session immediately reflects the updated properties,
    // preventing further redirects by middleware that checks the onboarding status.
    await refreshTokens();

    // 8. Revalidate Next.js Paths
    // Clears the cache for the dashboard, ensuring the user sees updated content if they navigate there.
    revalidatePath('/dashboard');

    // --- Success Response ---
    return NextResponse.json(
      {
        message:
          'Onboarding Completed, Profile Updated, and Kinde Status Synced',
      },
      { status: 200 },
    );
  } catch (error) {
    // --- Centralized Error Handling ---
    console.error(
      '[API /onboarding-complete] Error during onboarding process:',
      error,
    );

    // If it's a Zod validation error, return a 400 Bad Request with details
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation Error', errors: error.issues },
        { status: 400 },
      );
    }

    // Handle Postgres unique constraint violation (username already taken)
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const pgError = error as { code?: string };
      if (pgError.code === '23505') {
        return NextResponse.json(
          { message: 'Username already taken' },
          { status: 400 },
        );
      }
    }
    // For any other unexpected errors, return a 500 Internal Server Error
    return NextResponse.json(
      { message: 'Internal server error during onboarding.' },
      { status: 500 },
    );
  }
}
