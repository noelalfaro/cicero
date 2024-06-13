import { ModeToggle } from '@/app/components/dark-mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Search, Bell } from 'lucide-react';
// import Link from "next/link";
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getKindeServerSession,
  LoginLink,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';
import { ExtendedKindeIdToken } from '@/app/lib/types';
import { User } from '@/app/lib/definitions';

const Nav = async () => {
  // const { getUser, isAuthenticated } = getKindeServerSession();
  // const user = await getUser();
  const { getUser, isAuthenticated, getIdToken } = getKindeServerSession();

  // const kindeUser = await getUser();
  const idToken = (await getIdToken()) as ExtendedKindeIdToken; // Use the extended type
  // console.log(idToken);

  const user: User = {
    family_name: idToken.family_name,
    given_name: idToken.given_name,
    username: idToken.preferred_username,
    picture: idToken.picture,
    email: idToken.email,
    id: idToken.sub,
  };
  console.log(user);

  // console.log(user);
  return (
    <>
      {(await isAuthenticated()) ? (
        <nav className="flex h-auto min-h-24 w-full items-center justify-between">
          <div className="w-3/5">
            <Link href="/dashboard">
              <p className="text-2xl font-extrabold">PROSPECT PORTFOLIO</p>
            </Link>
          </div>

          <div className="flex w-1/4 items-center justify-between rounded-lg py-6">
            <Link className="flex flex-col items-center" href="/dashboard">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Home absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Dashboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Link className="flex flex-col items-center" href="/explore">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Search absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Explore</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Link className="flex flex-col items-center" href="/notifications">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Bell absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            {user ? (
              <Link
                className="flex flex-col items-center"
                href={`./${user.username}`}
              >
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar>
                        <AvatarImage
                          src={user.picture ?? 'default-avatar.png'}
                          alt={user.given_name + '.png'}
                        />
                        <AvatarFallback>NA</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>My Profile</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            ) : (
              <LoginLink>
                <Button>Log In</Button>
              </LoginLink>
            )}
          </div>
        </nav>
      ) : (
        ''
      )}
    </>
  );
};

export default Nav;
