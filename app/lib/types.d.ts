// types/kinde.d.ts
import { KindeIdToken as OriginalKindeIdToken } from '@kinde-oss/kinde-auth-nextjs/types';

export interface ExtendedKindeIdToken extends OriginalKindeIdToken {
  preferred_username: string;
  picture: string;
}
