import { ModeToggle } from '@/app/components/dark-mode-toggle';
import Nav from '@/app/components/nav';
import Players from '@/app/components/players';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { Link } from 'next-view-transitions';

import { redirect } from 'next/navigation';

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  return (
    <>
      {(await isAuthenticated()) ? (
        redirect(`/dashboard`)
      ) : (
        <main className="flex w-full max-w-5xl flex-col items-start justify-center text-left">
          <div className="flex h-screen w-full flex-col items-start justify-center gap-20">
            <div className="flex flex-col gap-2">
              <h1 className="text-8xl font-bold">PROSPECT PORTFOLIO</h1>
              <h2 className="text-4xl font-bold">
                You think they're the next big thing? <br /> Prove it.
              </h2>
            </div>

            <div className="mb-32 flex w-full justify-end gap-4 text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
              <Link href={'/login'}>
                <Button className="p-6 text-xl">Log In</Button>
              </Link>

              <Link href={'/register'}>
                <Button variant={'secondary'} className="p-6 text-xl">
                  Register
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex h-screen w-full flex-col">
            <h1 className="mb-2 mt-2 pb-2 text-4xl font-bold">Learn</h1>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Prospect Portfolio?</AccordionTrigger>
                <AccordionContent>
                  Prospect Portfolio is a web app for users to invest in their
                  favorite NBA players potential. This works through a web
                  interface that users can log into, browse/search different
                  players and “Invest” into their current score.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I Invest?</AccordionTrigger>
                <AccordionContent>
                  You invest by making an account and clicking the "Invest"
                  button on a player's page. Cicero will then attempt to make
                  the transction based on how many Cicero Bucks you have in your
                  balance. If the transaction is successful then it will reflect
                  into your account and add it to your list of investments
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  What Dictates a Player's Cicero Stock Price?
                </AccordionTrigger>
                <AccordionContent>
                  We run a seperate web app that takes in player data such as
                  stats from the latest game and also take in sentiment
                  surrounding a player by analyzing social media posts made
                  about said player. This gets run through our ML model to
                  determine a new stock price for each day. For a complete list
                  of stats tracked and type of sentiment tracked, refer below.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <footer> </footer>
        </main>
      )}
    </>
  );
}
