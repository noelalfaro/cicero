import { Button } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { User } from '@/app/lib/definitions';
import { fetchUserDataByUsername, testDB } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MoreVertical, ShieldX, Copy, UserCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserSettings } from '@/components/user-settings-dialog';
import { EditProfileDialog } from '@/components/edit-profile-dialog';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const loggedInUser = await getUser();
  console.log('Logged in user:' + JSON.stringify(loggedInUser, null, 2));

  const user: User = await fetchUserDataByUsername(params.username);
  console.log('We are visiting: ' + JSON.stringify(user, null, 2));

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
                    src={user?.picture}
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
                </div>

                <CardDescription className="text-base text-current">
                  This is an example bio
                </CardDescription>

                {user.id === loggedInUser?.id ? (
                  <div className="flex justify-between gap-1">
                    <EditProfileDialog user={user} />
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
                                  Copy Link To {user.username}'s profile.
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
                <CardTitle className="">My Watchlist</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </>
      ) : (
        redirect('/')
      )}
    </main>
  );
}
