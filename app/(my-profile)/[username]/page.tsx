// Import the extended type
import { ExtendedKindeIdToken } from '@/app/lib/types';

import { ModeToggle } from '@/app/components/dark-mode-toggle';
import { Button } from '@/components/ui/button';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { User, userSchema } from '@/app/lib/definitions';
import NotFound from '@/app/(my-profile)/[username]/not-found';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { getUser, isAuthenticated, getIdToken } = getKindeServerSession();

  // const kindeUser = await getUser();
  // const idToken = (await getIdToken()) as ExtendedKindeIdToken; // Use the extended type
  // console.log(idToken);
  // console.log(params.username);

  const userList = ['noel', 'bryan', 'chris'];
  // console.log(userList);

  if (!userList.includes(params.username)) return NotFound();
  // const user: User = {
  //   family_name: idToken.family_name,
  //   given_name: idToken.given_name,
  //   username: idToken.preferred_username,
  //   picture: idToken.picture,
  //   email: idToken.email,
  //   id: idToken.sub,
  // };
  // console.log(user);
  // const user = params;

  const redirectURL =
    process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app'
      : 'http://localhost:3000';

  return (
    <main className="flex w-full max-w-5xl flex-col items-start justify-between gap-4">
      {(await isAuthenticated()) ? (
        <>
          <div className="flex w-full flex-col">
            <div>
              <p className="mb-8">Well, well, well, if it isn&apos;t...</p>
              <pre className="mt-4 rounded-sm bg-slate-950 p-4 font-mono text-sm text-cyan-200">
                {JSON.stringify(params, null, 2)}
              </pre>
            </div>
          </div>
          <ModeToggle />
          <LogoutLink
            postLogoutRedirectURL={redirectURL}
            className="inline-block text-blue-500 underline"
          >
            <Button variant={'destructive'}>Logout</Button>
          </LogoutLink>
        </>
      ) : (
        <div>Not Authenticated</div>
      )}
    </main>
  );
}
