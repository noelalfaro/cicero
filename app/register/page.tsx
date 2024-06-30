import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';

import { OAuthIcon } from '@/app/components/oAuthButton';

import { getConnections } from '@/app/lib/misc';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Separator } from '@radix-ui/react-dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Divider from '@mui/material/Divider';
import { EmailRegister } from '@/app/components/email-register';

export default async function Register() {
  const connections = await getConnections();
  // console.log(connections);
  const emailConnectionId = connections?.find(
    (conn) => conn.strategy === 'email:otp',
  )?.id;

  return (
    <div className="flex h-full w-full flex-col items-start justify-center text-left">
      <div className="flex w-full items-center justify-center gap-20">
        <Card className="mx-auto w-6/12 max-w-md">
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
    </div>
    // <>testing</>
  );
}
