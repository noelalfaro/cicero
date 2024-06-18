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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
          <div className="flex w-full gap-2">
            <Card className="flex w-3/12 flex-col">
              <CardHeader>
                <Image
                  src={user?.picture || defaultUserImageUrl}
                  alt={`${user?.username}.png`}
                  width={200}
                  height={200}
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  className="rounded-full object-cover"
                />
                <CardTitle>
                  {user.given_name + ' ' + user.family_name}
                </CardTitle>
                <CardDescription>@{user.username}</CardDescription>
                <CardDescription className="text-base text-current">
                  This is an example Bio
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-9/12">
              <CardHeader>
                <CardTitle className="">My Top Perfomers</CardTitle>
              </CardHeader>
            </Card>
          </div>
          {/* <Card className="w-[350px] bg-card">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card> */}

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
                          <p className="text-xs text-muted-text">
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
