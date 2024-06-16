// Import the extended type
import { ExtendedKindeIdToken } from '@/app/lib/types';

import { ModeToggle } from '@/app/components/dark-mode-toggle';
import { Button } from '@/components/ui/button';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { User, userSchema } from '@/app/lib/definitions';
import NotFound from '@/app/(my-profile)/[username]/not-found';
import { fetchUserDataByUsername } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { UserCodeBlock } from '@/app/components/user-code-block';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { getUser, isAuthenticated, getIdToken } = getKindeServerSession();

  // const loggedInUser = await getUser();
  const idToken = (await getIdToken()) as ExtendedKindeIdToken; // Use the extended type
  // console.log(idToken);
  // console.log(params.username);

  const user: User | null = await fetchUserDataByUsername(params.username);
  // console.log(user);

  // const userList = ['noel', 'bryan', 'chris'];
  // console.log(userList);

  // if (!userList.includes(params.username)) return NotFound();
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
  const defaultUserImageUrl =
    'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg';
  if (!user) return notFound();

  const redirectURL =
    process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app'
      : 'http://localhost:3000';

  return (
    <main className="flex w-full flex-col items-start justify-between gap-2">
      {(await isAuthenticated()) ? (
        <>
          <div className="flex w-full">
            <div className="col flex w-fit flex-col rounded-md border border-input bg-card/20 p-4">
              <Image
                src={user?.picture || defaultUserImageUrl}
                alt={`${user?.username}.png`}
                width={200}
                height={200}
                className="rounded-full object-cover"
              />
              <p className="text-2xl font-semibold">
                {user.given_name + ' ' + user.family_name}
              </p>
              <p className="">@{user.username}</p>
            </div>
          </div>

          {params.username === idToken.preferred_username ? (
            <>
              <Dialog>
                <DialogTrigger>
                  <MoreHorizontal />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here.
                    </DialogDescription>
                    <div className="grid w-full gap-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col items-start">
                          <Label
                            htmlFor="theme-toggle"
                            className="mb-1 text-right"
                          >
                            Appearence
                          </Label>
                          <p className="text-muted-text text-xs">
                            Change the color theme
                          </p>
                        </div>

                        <ModeToggle />
                      </div>
                    </div>
                    <LogoutLink
                      postLogoutRedirectURL={redirectURL}
                      className="inline-block text-blue-500 underline"
                    >
                      <Button variant={'destructive'}>Logout</Button>
                    </LogoutLink>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </>
          ) : null}

          <UserCodeBlock user={user} />
        </>
      ) : (
        <div>Not Authenticated</div>
      )}
    </main>
  );
}
