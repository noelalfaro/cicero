import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { UserSettings } from '@/components/profile/user-settings-dialog';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';
import { fetchUserDataByUsername } from '@/lib/data/users';
import { isFollowing } from '@/lib/data/follows';
import Watchlist from '@/components/profile/watchlist';
import UserDialog from '@/components/profile/user-dialog';
import { FollowButton } from '@/components/profile/follow-button';

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [session, user] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    fetchUserDataByUsername(username),
  ]);
  const loggedInUser = session?.user;

  if (!user) return notFound();

  const viewingOwnProfile = loggedInUser?.id === user.id;
  const isFollowingUser =
    loggedInUser && !viewingOwnProfile
      ? await isFollowing(loggedInUser.id, user.id)
      : false;

  const defaultImage =
    'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg';

  return (
    <>
      {/* <div className="flex w-full flex-col gap-2 md:flex-row"> */}
      <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]">
        <Card className="bg-card text-card-foreground col-span-1 flex w-full flex-col items-center justify-start gap-0 rounded-xl border shadow-xs md:col-span-3 lg:col-span-2">
          <CardHeader className="flex w-full flex-col items-center justify-center gap-0 pb-0">
            <div className="relative flex h-[200px] w-[200px]">
              <Image
                src={user.picture ?? defaultImage}
                alt={`${user.username}.png`}
                fill={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, 250px"
                className="rounded-full object-cover"
              />
            </div>

            <div className="flex w-full flex-col items-start">
              <CardTitle className="text-2xl">{user.display_name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex w-full grow flex-col justify-center">
            {viewingOwnProfile ? (
              <div className="flex justify-between gap-1">
                <EditProfileDialog user={user} />
                <UserSettings user={user} />
              </div>
            ) : (
              <div className="flex justify-between gap-1">
                <FollowButton followeeId={user.id} initialIsFollowing={isFollowingUser} />
                <UserDialog user={user} />
              </div>
            )}
          </CardContent>
        </Card>

        <Watchlist />
      </div>
    </>
  );
}
