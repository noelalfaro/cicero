import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';
import { UserSettings } from '@/components/profile/user-settings-dialog';
import React from 'react';
import { FollowButton } from '@/components/profile/follow-button';
import UserDialog from '@/components/profile/user-dialog';
import { User } from '@/lib/definitions';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

const UserDetailStatic = ({
  user,
  loggedInUser,
  defaultImage,
}: {
  user: User;
  loggedInUser?: KindeUser;
  defaultImage: string;
}) => {
  return (
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
  );
};

export default UserDetailStatic;
