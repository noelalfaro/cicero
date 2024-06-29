import { ModeToggle } from '@/app/components/dark-mode-toggle';
import Nav from '@/app/components/nav';
import Players from '@/app/components/players';
import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/server';

import { redirect } from 'next/navigation';

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  return (
    <>
      {(await isAuthenticated()) ? redirect(`/dashboard`) : redirect(`/login`)}
    </>
  );
}
