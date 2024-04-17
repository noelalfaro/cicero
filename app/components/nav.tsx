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
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Nav = async () => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  return (
    <>
      {(await isAuthenticated()) ? (
        <nav className="flex h-auto min-h-24 w-full max-w-5xl items-center justify-between ">
          <Link href="/dashboard">
            <p className="text-2xl font-extrabold">Prospect Portfolio</p>
          </Link>

          <div className="flex w-1/4 items-center justify-between  rounded-lg py-6">
            <Link className=" flex flex-col items-center" href="/dashboard">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Home absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Dashboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Link className=" flex flex-col items-center" href="/explore">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Search absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Explore</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Link className=" flex flex-col items-center" href="/notifications">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Bell absoluteStrokeWidth />
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Link className=" flex flex-col items-center" href="/my-profile">
              <TooltipProvider>
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

            {/* <ModeToggle /> */}
          </div>
        </nav>
      ) : (
        ""
      )}
    </>
  );
};

export default Nav;
