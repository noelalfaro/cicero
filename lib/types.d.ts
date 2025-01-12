// types/kinde.d.ts
import { KindeIdToken as OriginalKindeIdToken } from '@kinde-oss/kinde-auth-nextjs/types';

export interface ExtendedKindeIdToken extends OriginalKindeIdToken {
  preferred_username: string;
  picture: string;

  ext_provider: {
    claims: {
      connection_id: string;
      email: string;
      family_name: string;
      given_name: string;
      is_confirmed: boolean;
      picture: string;
      profile: {
        avatar_url: string;
        bio: string;
        blog: string;
        collaborators: number;
        created_at: string;
        disk_usage: number;
        events_url: string;
        followers: number;
        followers_url: string;
        following: number;
        following_url: string;
        gists_url: string;
        gravatar_id: string;
        html_url: string;
        id: number;
        location: string;
        login: string;
        name: string;
        node_id: string;
        organizations_url: string;
        owned_private_repos: number;
        plan: {
          collaborators: number;
          name: string;
          private_repos: number;
          space: number;
        };
        private_gists: number;
        public_gists: number;
        public_repos: number;
        received_events_url: string;
        repos_url: string;
        site_admin: boolean;
        starred_url: string;
        subscriptions_url: string;
        total_private_repos: number;
        twitter_username: string;
        two_factor_authentication: boolean;
        type: string;
        updated_at: string;
        url: string;
      };
    };
    connection_id: string;
    name: string;
  };
}
