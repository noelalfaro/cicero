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
        className="flex cursor-pointer flex-col items-center hover:underline"
        href="/about-us"
      >
        About Us
      </Link>
      <Link
        className="flex flex-col items-center hover:underline"
        href="/learn"
      >
        Learn
      </Link>
      <Link className="flex flex-col items-center hover:underline" href="/blog">
        Blog
      </Link>
    </>
  );
}

export default async function PublicNav() {
  return (
    <nav className="flex h-20 w-full items-center justify-between">
      <div className="flex w-fit">
        <Link href="/">
          <p className="text-2xl font-extrabold">PROSPECT PORTFOLIO</p>
        </Link>
      </div>

      <div className="flex w-2/3 items-center justify-between rounded-lg py-6 md:w-2/5 lg:w-1/4">
        <StaticNavLinks />
      </div>
    </nav>
  );
}
