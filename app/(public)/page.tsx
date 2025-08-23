// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { LoginButton } from '@/components/auth/login-button';
import { RegisterButton } from '@/components/auth/register-button';

export default async function Home() {
  return (
    <>
      {/* Container for the page */}
      <div className="flex min-h-screen flex-col">
        {/* Hero section */}
        <section className="flex min-h-screen w-full flex-col items-start justify-end gap-4 pb-10 text-left md:justify-center md:gap-2 md:pb-0">
          <div className="flex w-fit flex-col">
            <h1 className={`w-full text-5xl font-bold md:text-8xl lg:text-9xl`}>
              PROSPECT <br /> PORTFOLIO
            </h1>

            <h2 className="text-lg font-semibold lg:text-2xl">
              You think they're the next big thing? <br /> Prove it.
            </h2>
          </div>

          <div className="flex w-full justify-start gap-2 self-end text-center md:w-fit md:justify-end md:gap-2 lg:grid-cols-4 lg:text-left">
            <div className="w-1/2">
              <LoginButton isHomePage />
            </div>

            <div className="w-1/2">
              <RegisterButton isHomePage />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
