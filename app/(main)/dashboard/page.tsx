import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { Link } from 'next-view-transitions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';
import React from 'react';
import DashboardTools from '@/components/dashboard-tools';

// Add force-dynamic since we're using authentication
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  if (!isAuthenticated()) {
    redirect('/');
  }

  return (
    <div className="grid w-full items-center justify-start gap-2 pb-2 lg:grid-cols-8 lg:grid-rows-8">
      <Card className="h-full lg:col-span-5 lg:row-span-4 xl:row-span-5">
        <CardHeader className="text-3xl font-bold">
          Dashboard For{' '}
          <Link href={`/${user?.username}`}>
            <p className="font-mono hover:text-primary hover:underline">
              @{user?.username}
            </p>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col">
          Welcome to Prospect Portfolio! <br /> We're still under active
          development. <br /> I welcome you to navigate to the different pages
          in the nav above or click on a link below to explore what a player's
          individual page currently looks like.
          <div className="flex w-full flex-col justify-center md:flex-row">
            <Link href={'/players/2544'}>
              <Button variant={'link'}>Link to Lebron's Page</Button>
            </Link>
            <Link href={'/players/201142'}>
              <Button variant={'link'}>Link to Durant's Page</Button>
            </Link>
            <LogoutLink>
              <Button variant={'link'} className="text-red-600">
                Logout
              </Button>
            </LogoutLink>
          </div>
        </CardContent>
      </Card>
      <DashboardTools />
      {/* <Card className="h-full lg:col-span-8 lg:row-span-1">
        <CardHeader>
          <CardTitle>Quick News</CardTitle>
        </CardHeader>
      </Card> */}
      <Card className="h-full w-full lg:col-span-8 lg:row-span-3">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            AI Summary of your portfolio performance will go here.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
