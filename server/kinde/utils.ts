import { init, Applications } from '@kinde/management-api-js';
import { unstable_noStore as no_store } from 'next/cache';

export const getConnections = async () => {
  no_store();

  init();
  const { connections } = await Applications.getApplicationConnections({
    applicationId: '492c20f7b1b04427ab72b6b08eb6c763',
  });

  return connections;
};

// Represents a single identity
export interface Identity {
  id: string;
  name: string;
  type: string;
  created_on: string;
  is_confirmed: boolean | null;
  total_logins: number;
  last_login_on: string | null;
}

// Represents the response from GET /users/{user_id}/identities
export interface GetUserIdentitiesResponse {
  code: string;
  message: string;
  has_more: boolean;
  identities: Identity[];
}

// Represents the response from DELETE /identities/{identity_id}
export interface DeleteIdentityResponse {
  code: string;
  message: string;
}

// Represents the response from POST /users/{user_id}/identities
export interface AddIdentityResponse {
  id: string;
  type: string;
  value: string;
  created_on: string;
  is_confirmed: boolean | null;
  total_logins: number;
  last_login_on: string | null;
}

let cachedToken: string | null = null; // Allow cachedToken to hold a string or null
let tokenExpiry: number | null = null; // Allow tokenExpiry to hold a number or null

export async function getToken(): Promise<string | null> {
  const now = Date.now();

  // Check if a valid token is cached
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    // Token is still valid, reuse it
    return cachedToken;
  }

  // Generate a new token
  const response = await fetch(`${process.env.KINDE_ISSUER_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      audience: `${process.env.KINDE_ISSUER_URL}/api`,
      grant_type: 'client_credentials',
      client_id: process.env.KINDE_CLIENT_ID || '', // Fallback to empty string if undefined
      client_secret: process.env.KINDE_CLIENT_SECRET || '', // Fallback to empty string if undefined
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch access token: ${response.statusText}`);
  }

  const data = await response.json();

  // Cache the token and its expiry time
  cachedToken = data.access_token;
  tokenExpiry = now + data.expires_in * 1000; // expires_in is in seconds

  return cachedToken;
}

export async function getUserIdentities(userId: string): Promise<Identity[]> {
  const accessToken = await getToken();

  const response = await fetch(
    `${process.env.KINDE_ISSUER_URL}/api/v1/users/${userId}/identities`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user identities: ${response.statusText}`);
  }

  const data: GetUserIdentitiesResponse = await response.json();
  return data.identities;
}

export async function deleteIdentity(
  identityId: string,
): Promise<DeleteIdentityResponse> {
  const accessToken = await getToken();

  const response = await fetch(
    `${process.env.KINDE_ISSUER_URL}/api/v1/identities/${identityId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete identity: ${response.statusText}`);
  }

  const data: DeleteIdentityResponse = await response.json();
  return data;
}

export async function addUsernameIdentity(
  userId: string,
  newUsername: string,
  connectionId?: string,
): Promise<AddIdentityResponse> {
  const accessToken = await getToken();

  const body: Record<string, string> = {
    type: 'username',
    value: newUsername,
  };

  if (connectionId) {
    body.connection_id = connectionId;
  }

  const response = await fetch(
    `${process.env.KINDE_ISSUER_URL}/api/v1/users/${userId}/identities`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to add new username identity: ${response.statusText}`,
    );
  }

  const data: AddIdentityResponse = await response.json();
  return data;
}
