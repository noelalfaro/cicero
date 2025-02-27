import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
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
import Watchlist from '@/components/profile/watchlist';
import UserDialog from '@/components/profile/user-dialog';
import { FollowButton } from '@/components/profile/follow-button';

// Rest of your page code
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { getUser } = getKindeServerSession();

  const [loggedInUser, user] = await Promise.all([
    getUser(),
    fetchUserDataByUsername((await params).username),
  ]);

  if (!user) return notFound();
  const defaultImage =
    'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg';

  return (
    <>
      {/* <div className="flex w-full flex-col gap-2 md:flex-row"> */}
      <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]">
        <Card className="col-span-1 flex w-full flex-col items-center justify-between rounded-xl border bg-card text-card-foreground shadow-xs md:col-span-3 lg:col-span-2">
          <CardHeader className="flex w-full flex-col items-center justify-center pb-0 md:gap-1">
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
              <CardTitle>{user.display_name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex w-full flex-col justify-start">
            {user.id === loggedInUser?.id ? (
              <div className="flex justify-between gap-1">
                <EditProfileDialog user={user} />
                <UserSettings user={user} />
              </div>
            ) : (
              <div className="flex justify-between gap-1">
                <FollowButton />
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
