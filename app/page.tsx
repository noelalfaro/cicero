import { ModeToggle } from "@/app/components/dark-mode-toggle";
import Nav from "@/app/components/nav";
import Players from "@/app/components/players";
import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function Home() {
  // const { getUser, isAuthenticated } = getKindeServerSession();
  // const user = await getUser();
  return (
    <main className="flex w-full max-w-5xl  flex-col items-start justify-center  text-left ">
      <div className="flex h-screen flex-col  items-start justify-center gap-8">
        <h1 className="text-8xl font-bold">PROSPECT PORTFOLIO</h1>
        <h2 className="text-2xl font-bold">
          You think they're the next big thing? Prove it.
        </h2>
        <div className="mb-32 flex w-full justify-end text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          <LoginLink className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Login{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Log into an existing Prospect Portfolio account.
            </p>
          </LoginLink>

          <RegisterLink className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Register{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Create a new Prospect Portfolio account.
            </p>
          </RegisterLink>
        </div>
      </div>
      <h1 className="mb-2 mt-2 text-3xl font-bold">Learn</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Prospect Portfolio?</AccordionTrigger>
          <AccordionContent>
            Prospect Portfolio is a web app for users to invest in their
            favorite NBA players potential. This works through a web interface
            that users can log into, browse/search different players and
            “Invest” into their current score.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I Invest?</AccordionTrigger>
          <AccordionContent>
            You invest by making an account and clicking the "Invest" button on
            a player's page. Cicero will then attempt to make the transction
            based on how many Cicero Bucks you have in your balance. If the
            transaction is successful then it will reflect into your account and
            add it to your list of investments
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What Dictates a Player's Cicero Stock Price?
          </AccordionTrigger>
          <AccordionContent>
            We run a seperate web app that takes in player data such as stats
            from the latest game and also take in sentiment surrounding a player
            by analyzing social media posts made about said player. This gets
            run through our ML model to determine a new stock price for each
            day. For a complete list of stats tracked and type of sentiment
            tracked, refer below.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <footer> </footer>
    </main>
  );
}
