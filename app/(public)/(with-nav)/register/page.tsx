import { getConnections } from '@/server/kinde/utils';
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
    <div className="flex w-full grow items-center justify-center self-center text-left">
      <Card className="w-full md:w-1/2 lg:w-4/12">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your email to register or continue with Google or Github
            below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid">
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
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
