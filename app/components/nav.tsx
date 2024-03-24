import { ModeToggle } from "@/app/components/dark-mode-toggle";
import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <nav className="flex h-auto  w-full max-w-5xl items-center justify-between pb-3 pt-3">
      <p className="text-2xl font-extrabold">Prospect Portfolio</p>
      <div className="flex w-1/2 items-center justify-between rounded-lg border border-solid p-4">
        <Link href="/">Home</Link>
        <Link href="/explore">Explore</Link>
        <Link href="my-profile">Profile</Link>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Nav;
