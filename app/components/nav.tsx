import { ModeToggle } from "@/app/components/dark-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Search, Bell } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getKindeServerSession,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";

const Nav = async () => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  return (
    <>
      {(await isAuthenticated()) ? (
        <nav className="flex h-auto min-h-24 w-full max-w-5xl items-center justify-between">
          <Link href="/dashboard">
            <p className="text-2xl font-extrabold">PROSPECT PORTFOLIO</p>
          </Link>

          <div className="flex w-1/4 items-center justify-between  rounded-lg py-6">
            <Link className=" flex flex-col items-center" href="/dashboard">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Home absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Dashboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Link className=" flex flex-col items-center" href="/explore">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Search absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Explore</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Link className=" flex flex-col items-center" href="/notifications">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Bell absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            {(await isAuthenticated()) ? (
              <Link className=" flex flex-col items-center" href="/my-profile">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar>
                        <AvatarImage
                          src={user?.picture ?? "default-avatar.png"}
                          alt={user?.given_name + ".png"}
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
        ""
      )}
    </>
  );
};

export default Nav;
