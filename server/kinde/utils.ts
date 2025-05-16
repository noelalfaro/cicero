import {
  init,
  Applications,
  Users,
  identity,
  GetUserIdentitiesResponse,
  CreateUserIdentityResponse,
  DeleteIdentityResponse,
  Identities,
} from '@kinde/management-api-js';
import { unstable_noStore as no_store } from 'next/cache';

init({
  kindeDomain: process.env.KINDE_ISSUER_URL!,
  clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID!,
  clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET!,
});

export const getConnections = async () => {
  no_store();

  const { connections } = await Applications.getApplicationConnections({
    applicationId: '492c20f7b1b04427ab72b6b08eb6c763',
  });

  return connections;
};

// // Represents a single identity
// export interface Identity {
//   id: string;
//   name: string;
//   type: string;
//   created_on: string;
//   is_confirmed: boolean | null;
//   total_logins: number;
//   last_login_on: string | null;
// }

// Represents the response from GET /users/{user_id}/identities
// export interface GetUserIdentitiesResponse {
//   code: string;
//   message: string;
//   has_more: boolean;
//   identities: Identity[];
// }

// Represents the response from DELETE /identities/{identity_id}
// export interface DeleteIdentityResponse {
//   code: string;
//   message: string;
// }

// Represents the response from POST /users/{user_id}/identities
// export interface AddIdentityResponse {
//   id: string;
//   type: string;
//   value: string;
//   created_on: string;
//   is_confirmed: boolean | null;
//   total_logins: number;
//   last_login_on: string | null;
// }

let cachedToken: string | null = null; // Allow cachedToken to hold a string or null
let tokenExpiry: number | null = null; // Allow tokenExpiry to hold a number or null

// export async function getToken(): Promise<string | null> {
//   const now = Date.now();

//   // Check if a valid token is cached
//   if (cachedToken && tokenExpiry && now < tokenExpiry) {
//     // Token is still valid, reuse it
//     return cachedToken;
//   }

//   // Generate a new token
//   const response = await fetch(`${process.env.KINDE_ISSUER_URL}/oauth2/token`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: new URLSearchParams({
//       audience: `${process.env.KINDE_ISSUER_URL}/api`,
//       grant_type: 'client_credentials',
//       client_id: process.env.KINDE_MANAGEMENT_CLIENT_ID || '', // Fallback to empty string if undefined
//       client_secret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET || '', // Fallback to empty string if undefined
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch access token: ${response.statusText}`);
//   }

//   const data = await response.json();

//   // Cache the token and its expiry time
//   cachedToken = data.access_token;
//   tokenExpiry = now + data.expires_in * 1000; // expires_in is in seconds

//   return cachedToken;
// }

export async function getUserIdentities(userId: string): Promise<identity[]> {
  try {
    ('Getting User Identities');
    const sdkResponse: GetUserIdentitiesResponse =
      await Users.getUserIdentities({ userId });

    // The SDK's GetUserIdentitiesResponse should have an 'identities' property
    // which is an array of 'identity'
    if (sdkResponse && sdkResponse.identities) {
      console.log('Identities:', sdkResponse.identities);
      return sdkResponse.identities;
    }
    // Handle cases where the response might not be as expected, though SDK should type this
    console.warn(
      'SDK getUserIdentities did not return expected identities array:',
      sdkResponse,
    );
    return []; // Or throw an error
  } catch (error) {
    console.error('SDK Error fetching user identities:', error);
    throw error; // Re-throw or handle as needed
  }
}

export async function deleteIdentity(
  identityId: string,
): Promise<DeleteIdentityResponse> {
  try {
    console.log('We gotta delete the old username first');
    if (!identityId) {
      throw new Error('identityId is required to delete an identity.');
    }
    const sdkResponse: DeleteIdentityResponse = await Identities.deleteIdentity(
      { identityId },
    );
    console.log('Identity Deleted! ');
    return sdkResponse;
  } catch (error) {
    console.error('SDK Error deleting identity:', error);
    throw error;
  }
}

export async function addUsernameIdentity(
  userId: string,
  newUsername: string,
  connectionId?: string,
): Promise<CreateUserIdentityResponse> {
  try {
    console.log('Adding Username...', newUsername);
    const requestBodyPayload: {
      type?: 'email' | 'username' | 'phone' | 'enterprise' | 'social';
      value: string;
      connection_id?: string;
    } = {
      type: 'username',
      value: newUsername,
    };
    if (connectionId) {
      requestBodyPayload.connection_id = connectionId;
    }

    // The SDK's createUserIdentity method is on the Users class.
    // It expects a 'data' object with 'userId' and 'requestBody'.
    const sdkResponse: CreateUserIdentityResponse =
      await Users.createUserIdentity({
        userId: userId,
        requestBody: requestBodyPayload,
      });
    console.log('Username identity Added!', sdkResponse.identity);
    return sdkResponse;
  } catch (error) {
    console.error('SDK Error adding username identity:', error);
    throw error;
  }
}
