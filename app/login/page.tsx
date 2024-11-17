import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { OAuthIcon } from '@/components/oAuthButton';

import { getConnections } from '@/app/lib/misc';
import { Link } from 'next-view-transitions';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { EmailLogin } from '@/components/email-login';

export const dynamic = 'force-dynamic';

export default async function Login() {
  const connections = await getConnections();
  // console.log(connections);
  const emailConnectionId = connections?.find(
    (conn) => conn.strategy === 'email:otp',
  )?.id;

  return (
    <div className="flex h-full w-full flex-col items-start justify-center text-left">
      <div className="flex w-full items-center justify-center gap-20">
        <Card className="mx-auto w-4/12 max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email or login via Github below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <EmailLogin emailConnectionId={emailConnectionId} />

              <div className="flex flex-col gap-2">
                {connections
                  ?.filter((conn: any) => conn.strategy.includes('oauth2'))
                  .map((connection: any) => (
                    <LoginLink
                      key={connection.id}
                      authUrlParams={{ connection_id: connection.id }}
                    >
                      <OAuthIcon
                        provider={connection.display_name}
                        login={true}
                      />
                    </LoginLink>
                  ))}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
