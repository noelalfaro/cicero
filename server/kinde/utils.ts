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

export async function getUserIdentities(userId: string): Promise<identity[]> {
  try {
    const sdkResponse: GetUserIdentitiesResponse =
      await Users.getUserIdentities({ userId });

    if (sdkResponse && sdkResponse.identities) {
      // console.log('Identities:', sdkResponse.identities);
      return sdkResponse.identities;
    }
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
    // console.log('We gotta delete the old username first');
    if (!identityId) {
      throw new Error('identityId is required to delete an identity.');
    }
    const sdkResponse: DeleteIdentityResponse = await Identities.deleteIdentity(
      { identityId },
    );
    // console.log('Identity Deleted! ');
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
    // console.log('Adding Username...', newUsername);
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
    // console.log('Username identity Added!', sdkResponse.identity);
    return sdkResponse;
  } catch (error) {
    console.error('SDK Error adding username identity:', error);
    throw error;
  }
}
