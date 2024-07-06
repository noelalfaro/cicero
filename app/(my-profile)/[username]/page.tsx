// Import the extended type
import { ExtendedKindeIdToken } from '@/app/lib/types';

import { ModeToggle } from '@/app/components/dark-mode-toggle';
import { Button } from '@/components/ui/button';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { User, userSchema } from '@/app/lib/definitions';
import NotFound from '@/app/(my-profile)/[username]/not-found';
import { fetchUserDataByUsername, testDB } from '@/app/lib/data';
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
import {
  MoreHorizontal,
  MoreVertical,
  ShieldX,
  Copy,
  UserCheck,
  EditIcon,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dot } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

import { z } from 'zod';
import { UserSettings } from '@/app/components/user-settings-dialog';
import { EditProfileDialog } from '@/app/components/edit-profile-dialog';
import { param } from 'drizzle-orm';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { getUser, isAuthenticated, getIdToken } = getKindeServerSession();

  // const loggedInUser = await getUser();
  const idToken = (await getIdToken()) as ExtendedKindeIdToken; // Use the extended type

  // const dbCall = await testDB();
  // console.log();

  // const { login, register } = useKindeAuth();
  console.log('Id Token: ' + JSON.stringify(idToken, null, 2));
  // console.log('params username: ' + params.username);
  // console.log('logged in user: ' + JSON.stringify(loggedInUser, null, 2));

  const loggedInUser = await getUser();
  console.log('logged in user:' + JSON.stringify(loggedInUser, null, 2));
  const user: User | null = await fetchUserDataByUsername(params.username);
  console.log('Were visiting: ' + JSON.stringify(user, null, 2));

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

  return (
    <main className="flex w-full flex-col items-start justify-between gap-2">
      {(await isAuthenticated()) ? (
        <>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Card className="flex w-full flex-col md:w-6/12 lg:w-4/12 xl:w-3/12">
              <CardHeader className="w-full gap-1 text-start">
                <div className="relative flex h-[250px] w-full max-w-[250px] self-center">
                  <Image
                    src={user?.picture || defaultUserImageUrl}
                    alt={`${user?.username}.png`}
                    fill={true}
                    className="rounded-full object-cover"
                  />
                </div>

                <div>
                  <CardTitle>{user.display_name}</CardTitle>
                  <div className="flex justify-start">
                    <CardDescription>@{user.username}</CardDescription>
                    <Separator
                      orientation="vertical"
                      className="h-full text-current"
                    />
                  </div>
                  {/* <Separator orientation="vertical" className="text-current" /> */}
                </div>

                {/* <Separator orientation="horizontal" className="text-current" /> */}
                <CardDescription className="text-base text-current">
                  This is an example bio
                </CardDescription>

                {user.id === loggedInUser?.id ? (
                  <div className="flex justify-between gap-1">
                    <EditProfileDialog
                      user={user}
                      defaultPicture={defaultUserImageUrl}
                    />
                    <UserSettings user={user} />
                  </div>
                ) : (
                  <div className="flex justify-between gap-1">
                    <Button className="w-11/12">Follow</Button>
                    <Dialog>
                      <DialogTrigger className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-1 py-2 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-secondary/50 hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        <MoreVertical />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="">
                            {user.username}'s Account
                          </DialogTitle>
                          <DialogDescription>
                            Follow, Share, Block.
                          </DialogDescription>
                          <div className="grid w-full gap-4 py-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex flex-col items-start">
                                <Label
                                  htmlFor="follow"
                                  className="mb-1 text-right"
                                >
                                  Follow
                                </Label>
                                <p className="text-xs text-muted-text">
                                  Follow @{user.username}
                                </p>
                              </div>
                              <Button variant={'ghost'}>
                                <UserCheck />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex flex-col items-start">
                                <Label
                                  htmlFor="share"
                                  className="mb-1 text-right"
                                >
                                  Share
                                </Label>
                                <p className="text-xs text-muted-text">
                                  Copy Link To {user.given_name}'s profile.
                                </p>
                              </div>
                              <Button variant={'ghost'}>
                                <Copy />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex flex-col items-start">
                                <Label
                                  htmlFor="block"
                                  className="mb-1 text-right"
                                >
                                  Block
                                </Label>
                                <p className="text-xs text-muted-text">
                                  Block this account.
                                </p>
                              </div>
                              <Button variant={'ghostdestructive'}>
                                <ShieldX />
                              </Button>
                            </div>
                          </div>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardHeader>
            </Card>
            <Card className="w-full md:w-6/12 lg:w-8/12 xl:w-9/12">
              <CardHeader>
                <CardTitle className="">My Top Perfomers</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* <UserCodeBlock user={user} /> */}
        </>
      ) : (
        redirect('/')
      )}
    </main>
  );
}
