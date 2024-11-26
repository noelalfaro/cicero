import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { Link } from 'next-view-transitions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import React from 'react';

// Add force-dynamic since we're using authentication
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  if (!isAuthenticated()) {
    redirect('/');
  }

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <Card className="w-full">
        <CardHeader className="text-4xl font-bold">
          Dashboard For{' '}
          <Link href={`/${user?.username}`}>
            <p className="font-mono hover:text-primary hover:underline">
              @{user?.username}
            </p>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="text-balance">
            Welcome to Prospect Portfolio! <br /> We're still under active
            development. <br /> I welcome you to navigate to the different pages
            in the nav above or click on a link below to explore what a player's
            individual page currently looks like.
          </div>
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
    </div>
  );
}
