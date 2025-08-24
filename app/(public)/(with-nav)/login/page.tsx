import { getConnections } from '@/server/kinde/utils';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmailLogin } from '@/components/auth/email-login';
import { OAuthLogin } from '@/components/auth/oauth-login';

export default async function Login() {
  const connections = await getConnections();
  console.log(connections);
  const emailConnectionId = connections?.find(
    (conn) => conn.strategy === 'email:password',
  )?.id;
  const usernameConnectionId = connections?.find(
    (conn) => conn.strategy === 'username:password',
  )?.id;
  console.log(usernameConnectionId);

  return (
    <div className="flex w-full grow items-center justify-center self-center text-left">
      <Card className="w-full md:w-1/2 lg:w-4/12">
        <CardHeader>
          <CardTitle className="text-2xl">Log In</CardTitle>
          <CardDescription>
            Log in directly using Github or Google below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              {connections
                ?.filter((conn: any) => conn.strategy.includes('oauth2'))
                .map((connection: any) => (
                  <OAuthLogin
                    key={connection.id}
                    provider={connection.display_name.toLowerCase()}
                    connectionId={connection.id}
                  />
                ))}
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href={'/register'} className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
