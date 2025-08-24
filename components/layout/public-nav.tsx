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
import MobileNav from '@/components/layout/public-mobile-nav';
import AnimatedMobileNav from '@/components/layout/public-mobile-nav';
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
    <nav className="flex h-30 w-full items-center justify-evenly md:h-20">
      <div className="flex grow">
        <Link href="/">
          <p className="text-2xl font-extrabold">
            PROSPECT <br /> PORTFOLIO
          </p>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center justify-evenly gap-8 md:flex">
        <StaticNavLinks />
      </div>

      {/* Mobile Navigation (Hamburger Menu) */}
      <div className="flex md:hidden">
        <AnimatedMobileNav />
      </div>
    </nav>
  );
}
