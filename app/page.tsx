import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';
import React from 'react';

export default async function Home() {
  return (
    <>
      {/* Container for the page */}
      <div className="flex min-h-screen flex-col">
        {/* Hero section */}
        <section className="flex min-h-screen w-full flex-col items-start justify-center gap-2">
          <div className="flex w-fit flex-col">
            <h1 className="w-full text-5xl font-bold md:text-8xl">
              PROSPECT <br /> PORTFOLIO
            </h1>
            <h2 className="lg:text-2xl">
              You think they're the next big thing? <br /> Prove it.
            </h2>
          </div>

          <div className="flex w-full justify-start gap-1 self-end text-center md:w-fit md:justify-end md:gap-2 lg:grid-cols-4 lg:text-left">
            <Link href={'/login'} className="w-1/2">
              <Button className="w-full p-6 text-lg">Log In</Button>
            </Link>

            <Link href={'/register'} className="w-1/2">
              <Button variant={'secondary'} className="w-full p-6 text-lg">
                Register
              </Button>
            </Link>
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
                Prospect Portfolio is a platform that lets you invest in the
                potential of your favorite players. Think a 2nd-round pick could
                become a superstar? Invest in them and track their progress over
                time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                How do I Use Prospect Portfolio?
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                <p>After signing up, you'll have access to three main pages:</p>

                <br />
                <h3 className="font-bold">Dashboard</h3>
                <ul className="list-disc">
                  <li>Get a quick overview of your entire portfolio.</li>
                  <li>
                    Access your investment history, watchlist, and account
                    balance.
                  </li>
                  <li>
                    Stay updated with AI-generated summaries of your players'
                    latest performances.
                  </li>
                </ul>

                <br />
                <h3 className="font-bold">Explore</h3>
                <ul>
                  <li>
                    Search for players by name and view their detailed profiles.
                  </li>
                  <li>Analyze player prospects with visual charts.</li>
                </ul>

                <br />
                <h3 className="font-bold">Notifications</h3>
                <ul>
                  <li>
                    This page lists notifications for accounts and players you
                    follow. It will let you know if the've bought or sold any
                    investments.
                  </li>
                </ul>

                <br />
                <h3 className="font-bold">My Account</h3>
                <ul>
                  <li>View, edit, and share your account details.</li>
                  <li>Track the performance of your investments.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
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
            <AccordionItem value="item-4">
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
        </section>
      </div>

      <footer> </footer>
    </>
  );
}
