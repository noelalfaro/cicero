import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Home, Search, Bell } from 'lucide-react';
import React, { Suspense } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCiceroUser } from '@/lib/data/users';
import Image from 'next/image';
import MobileNav from './mobile-nav'; // Import the new mobile nav
import { cn } from '@/lib/utils';

// Statically rendered part of the navigation
function StaticNavLinks() {
  // ... (this component remains the same)
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
async function DynamicUserProfile({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  // ... (this component remains the same)
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  const ciceroUser = user ? await getCiceroUser(user.id) : null;

  const avatarSizeClasses = size === 'lg' ? 'h-16 w-16' : 'h-8 w-8';
  const textSizeClasses = size === 'lg' ? 'text-lg font-medium' : '';

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
    <Link
      className={cn('flex items-center gap-4', size === 'lg' && 'flex-row')}
      href={`/${ciceroUser?.username}`}
    >
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger>
            {/* Apply the dynamic size class to the Avatar */}
            <Avatar className={avatarSizeClasses}>
              <Image
                src={
                  ciceroUser?.picture
                    ? ciceroUser.picture
                    : 'https://avatars.githubusercontent.com/u/56320635?v=4'
                }
                alt={ciceroUser?.username + '.png'}
                className="cursor-pointer"
                width={size === 'lg' ? 64 : 32}
                height={size === 'lg' ? 64 : 32}
              />
              <AvatarFallback>
                {ciceroUser?.username?.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>My Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Conditionally render the username for the large version */}
      {size === 'lg' && (
        <div className="flex flex-col">
          <p className={textSizeClasses}>{ciceroUser?.username}</p>
          <p className="text-muted-foreground text-sm">View Profile</p>
        </div>
      )}
    </Link>
  );
}

export default async function Nav() {
  return (
    <nav className="flex h-25 w-full items-center justify-between md:h-20">
      <div className="flex w-fit">
        <Link href="/dashboard">
          <p className="text-xl font-extrabold">PROSPECT PORTFOLIO</p>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden w-2/3 items-center justify-between rounded-lg py-6 md:flex md:w-2/5 lg:w-1/4">
        <StaticNavLinks />
        <Suspense fallback={<Avatar />}>
          <DynamicUserProfile />
        </Suspense>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden">
        <MobileNav>
          {/* This is the key pattern: we pass the async server component
              as a child to our client component. */}
          <Suspense fallback={<Avatar />}>
            <DynamicUserProfile size="lg" />
          </Suspense>
        </MobileNav>
      </div>
    </nav>
  );
}
