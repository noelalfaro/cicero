import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Search, Bell } from 'lucide-react';
import React, { Suspense } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getKindeServerSession,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCiceroUser } from '@/lib/data/users';
import Image from 'next/image';
// Statically rendered part of the navigation
function StaticNavLinks() {
  return (
    <>
      <Link
        className="flex cursor-pointer flex-col items-center"
        href="/dashboard"
      >
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Home
                absoluteStrokeWidth
                aria-label="home-link-button"
                className="cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent>Dashboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
      <Link className="flex flex-col items-center" href="/explore">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Search
                absoluteStrokeWidth
                aria-label="search-link-button"
                className="cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent>Explore</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
      <Link className="flex flex-col items-center" href="/notifications">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Bell
                absoluteStrokeWidth
                aria-label="notifications-link-button"
                className="cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
    </>
  );
}

// Dynamically rendered user profile section
async function DynamicUserProfile() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  const ciceroUser = user ? await getCiceroUser(user.id) : null;

  if (!(await isAuthenticated())) {
    return (
      <>
        <Link href={'/login'}>
          <Button>Log In</Button>
        </Link>
      </>
    );
  }

  return (
    <Link className="flex flex-col items-center" href={`/${user?.username}`}>
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <Image
                src={
                  ciceroUser?.picture
                    ? ciceroUser?.picture
                    : 'https://avatars.githubusercontent.com/u/56320635?v=4'
                }
                alt={ciceroUser?.username + '.png'}
                className="cursor-pointer"
                width={32}
                height={32}
              />
              <AvatarFallback>
                {user?.username?.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>My Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
}

export default async function Nav() {
  return (
    <nav className="flex h-20 w-full items-center justify-between">
      <div className="flex w-fit">
        <Link href="/dashboard">
          <p className="text-2xl font-extrabold">PROSPECT PORTFOLIO</p>
        </Link>
      </div>

      <div className="flex w-2/3 items-center justify-between rounded-lg py-6 md:w-2/5 lg:w-1/4">
        <StaticNavLinks />

        <Suspense fallback={<Avatar />}>
          <DynamicUserProfile />
        </Suspense>
      </div>
    </nav>
  );
}
