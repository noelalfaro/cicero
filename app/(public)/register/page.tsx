import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { OAuthIcon } from '@/components/auth/oAuthButton';
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

export default async function Register() {
  const connections = await getConnections();
  // console.log(connections);
  const emailConnectionId = connections?.find(
    (conn) => conn.strategy === 'email:otp',
  )?.id;

  return (
    <div className="flex min-h-screen w-full items-center justify-center self-center text-left">
      <Card className="w-full md:w-1/2 lg:w-4/12">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your email & username to register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <EmailRegister emailConnectionId={emailConnectionId} />

            <div className="flex flex-col gap-2">
              {connections
                ?.filter((conn: any) => conn.strategy.includes('oauth2'))
                .map((connection: any) => (
                  <RegisterLink
                    key={connection.id}
                    authUrlParams={{ connection_id: connection.id }}
                  >
                    <OAuthIcon
                      provider={connection.display_name}
                      login={false}
                    />
                  </RegisterLink>
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
