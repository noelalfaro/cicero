import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { getConnections } from '@/lib/utils';
// import { Link } from 'next-view-transitions';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmailRegister } from '@/components/auth/email-register';
import { Separator } from '@/components/ui/separator';
import { OAuthRegister } from '@/components/auth/oauth-register';

export default async function Register() {
  const connections = await getConnections();
  // console.log(connections);
  const emailConnectionId = connections?.find(
    (conn) => conn.strategy === 'email:otp',
  )?.id;

  return (
    <div className="flex min-h-screen w-full items-center justify-center self-center text-left">
      <Card className="w-full md:w-1/2 lg:w-4/12">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your email to register or sign up via Github below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <EmailRegister emailConnectionId={emailConnectionId} />
            <div className="flex w-full flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <Separator orientation="horizontal" className="w-1/4"></Separator>
              OR
              <Separator orientation="horizontal" className="w-1/4"></Separator>
            </div>

            <div className="flex flex-col gap-2">
              {connections
                ?.filter((conn: any) => conn.strategy.includes('oauth2'))
                .map((connection: any) => (
                  <OAuthRegister
                    key={connection.id}
                    provider={connection.display_name.toLowerCase()}
                    connectionId={connection.id}
                  />
                ))}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
