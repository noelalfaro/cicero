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
import { Link } from 'next-view-transitions';
// Statically rendered part of the navigation
function StaticNavLinks() {
  return (
    <>
      <Link className="flex flex-col items-center" href="/dashboard">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Home absoluteStrokeWidth />
            </TooltipTrigger>
            <TooltipContent>Dashboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
      <Link className="flex flex-col items-center" href="/explore">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Search absoluteStrokeWidth />
            </TooltipTrigger>
            <TooltipContent>Explore</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
      <Link className="flex flex-col items-center" href="/notifications">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Bell absoluteStrokeWidth />
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
              <AvatarImage
                src={user.picture ?? 'default-avatar.png'}
                alt={user.username + '.png'}
              />
              <AvatarFallback>
                {user.given_name?.substring(0, 1).toUpperCase()}
                {user.family_name?.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>My Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
}

const Nav = async () => {
  return (
    <nav className="flex h-auto min-h-24 w-full items-center justify-between">
      <div className="flex w-fit">
        <Link href="/dashboard">
          <p className="text-2xl font-extrabold">PROSPECT PORTFOLIO</p>
        </Link>
      </div>

      <div className="flex w-2/3 items-center justify-between rounded-lg py-6 md:w-2/5 lg:w-1/4">
        <StaticNavLinks />

        <Suspense fallback={<Button>Loading...</Button>}>
          <DynamicUserProfile />
        </Suspense>
      </div>
    </nav>
  );
};

export default Nav;
