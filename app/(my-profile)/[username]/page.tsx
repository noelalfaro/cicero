import { Button } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { User } from '@/app/lib/definitions';
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
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { UserSettings } from '@/components/user-settings-dialog';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { fetchUserDataByUsername } from '@/app/lib/data';

// Rest of your page code
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { getUser } = getKindeServerSession();
  const loggedInUser = await getUser();
  // console.log('Logged in user:' + JSON.stringify(loggedInUser, null, 2));

  const user: User = await fetchUserDataByUsername((await params).username);
  // console.log('We are visiting: ' + JSON.stringify(user, null, 2));

  if (!user) return notFound();

  return (
    <>
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <Card className="flex w-full flex-col gap-1 md:w-[300px]">
          <CardHeader className="w-full gap-1 pb-0 text-start">
            <div className="relative flex h-[250px] w-full max-w-[250px] self-center">
              <Image
                src={user?.picture}
                alt={`${user?.username}.png`}
                fill={true}
                className="rounded-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <CardTitle>{user.display_name}</CardTitle>
              {/* <div className="flex justify-start"> */}
              <CardDescription>@{user.username}</CardDescription>
              {/* </div> */}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col">
            {/* <CardDescription className="my-2 flex-grow text-base text-current">
              This is an example bio
            </CardDescription> */}

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
                            <Label htmlFor="follow" className="mb-1 text-right">
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
                            <Label htmlFor="share" className="mb-1 text-right">
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
                            <Label htmlFor="block" className="mb-1 text-right">
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
          </CardContent>
        </Card>

        <Card className="flex flex-grow">
          <CardHeader>
            <CardTitle className="">My Watchlist</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
