import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { TextMorph } from '@/components/ui/text-morph';
// import { TextMorphButton } from '@/components/general/login-button';
import { LoginButton } from '@/components/auth/login-button';
import { RegisterButton } from '@/components/auth/register-button';

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  (await isAuthenticated()) ? redirect('/dashboard') : null;
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
        {/* Learn Section */}
        <section className="flex h-fit min-h-screen w-full flex-col items-start justify-start gap-2 text-left">
          <h1 className="mb-2 mt-2 pb-2 font-bold lg:text-5xl">Learn</h1>
          <Accordion
            type="single"
            collapsible
            className="w-full text-left text-xl"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Prospect Portfolio?</AccordionTrigger>
              <AccordionContent className="text-lg">
                Prospect Portfolio is a web app for users to invest in their
                favorite NBA players potential. This works through a web
                interface that users can log into, browse/search different
                players and “Invest” into their current PR score.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                What Dictates a Player's Pulse Rating (PR) score?
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                We analyze real-time player data, such as game stats, combined
                with social media sentiment. The PR score is calculated based on
                the positivity or negativity of the sentiment and the player's
                recent performance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Why Did We Create This?
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                We wanted to visually represent public sentiment about a
                player's potential and performance. Our goal is to evolve the
                platform to include real-time data, allowing you to see PR
                scores fluctuate in response to live game events. Imagine
                watching a player's score skyrocket during a breakout
                performance or plummet after a disappointing game.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link href={'https://github.com/noelalfaro/cicero'}>
            <Button>Learn More</Button>
          </Link>
        </section>
      </div>
    </>
  );
}
