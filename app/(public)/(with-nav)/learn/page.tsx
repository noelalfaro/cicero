// import LearnContent from '@/planning/markdown/learn.mdx';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  return (
    <>
      <section className="flex h-fit min-h-screen w-full flex-col items-start justify-start gap-2 text-left">
        <h1 className="mt-2 mb-2 pb-2 font-bold lg:text-5xl">Learn</h1>
        {/* <Accordion
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
            </Accordion> */}
        <Link href={'https://github.com/noelalfaro/cicero'}>
          <Button>Learn More</Button>
        </Link>
      </section>
    </>
  );
}
