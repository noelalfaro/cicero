import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TextScramble } from '@/components/ui/text-scramble';
import { TextEffect } from '@/components/ui/text-effect';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import React from 'react';
import DashboardTools from '@/components/dashboard/dashboard-tools';

// Add force-dynamic since we're using authentication
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  if (!isAuthenticated()) {
    redirect('/');
  }

  return (
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-8 md:grid-rows-[350px_1fr_250px]">
      <Card className="col-span-1 row-span-1 overflow-auto md:col-span-5">
        <CardHeader className="text-3xl font-bold">
          Dashboard For{' '}
          <Link href={`/${user?.username}`}>
            <p className="font-mono hover:text-primary hover:underline">
              @{user?.username}
            </p>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 pb-0">
          {/* <TextEffect per="word" as="h3" preset="blur"> */}
          Welcome to Prospect Portfolio! We're still under active development. I
          welcome you to navigate to the different pages in the nav above or
          click on a link below to explore what a player's individual page
          currently looks like.
          {/* </TextEffect> */}
          <div className="flex w-full flex-col justify-start gap-1 md:flex-row md:gap-6">
            <Link href={'/players/2544'}>
              <Button variant={'link'} className="p-0">
                Link to Lebron's Page
              </Button>
            </Link>
            <Link href={'/players/201142'}>
              <Button variant={'link'} className="p-0">
                Link to Durant's Page
              </Button>
            </Link>
            <LogoutLink>
              <Button variant={'link'} className="p-0 text-red-600">
                Logout
              </Button>
            </LogoutLink>
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription className="text-sm text-muted-foreground">
            Github:{' '}
            <Button variant={'link'} className="p-0">
              <a href="https://github.com/noelalfaro/cicero">
                {' '}
                noelalfaro/cicero
              </a>
            </Button>
          </CardDescription>
        </CardFooter>
      </Card>
      <DashboardTools />
      <Card className="flex h-full flex-col items-center justify-start gap-2 md:col-span-8 md:flex-row">
        <CardHeader>
          <CardTitle>Control Center</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full w-full flex-grow flex-col content-center items-center justify-end gap-2 md:w-fit md:flex-row md:p-0 md:px-6">
          <Button variant={'secondary'} className="w-full md:w-fit">
            Investment History
          </Button>
          <Button variant={'secondary'} className="w-full md:w-fit">
            Manage Stocks
          </Button>
          <Button variant={'secondary'} className="w-full md:w-fit">
            Watchlist
          </Button>
          {/* <Button variant={'secondary'}>UE</Button> */}
        </CardContent>
      </Card>
      <Card className="row-span-1 w-full md:col-span-8">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            AI Summary of your portfolio performance will go here.
          </CardDescription>
        </CardHeader>
        {/* <CardContent>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          impedit pariatur porro expedita officiis, repellat veniam, totam
          veritatis numquam accusamus magni doloribus distinctio aspernatur
          eaque ducimus corporis deserunt quo exercitationem sequi omnis animi!
          Impedit veritatis deleniti facilis id quod doloribus rem, recusandae
          velit eius architecto facere eaque quisquam fugit? Dolor nulla
          expedita nostrum facilis quam ad omnis. Fugit nostrum, quidem pariatur
          dolorem veniam in culpa eum nihil ab est voluptatum blanditiis,
          reprehenderit iusto expedita nesciunt ratione sint corrupti explicabo
          et qui cupiditate accusantium dolores nulla. Adipisci modi a explicabo
          ut?
        </CardContent> */}
      </Card>
    </div>
  );
}
