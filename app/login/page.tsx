import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { FaGoogle } from 'react-icons/fa';
import { OAuthIcon } from '@/app/components/oAuthButton';

import { Button } from '@/components/ui/button';

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
import { Separator } from '@/components/ui/separator';
import { Divider } from '@mui/material';
import { EmailLogin } from '@/app/components/email-login';

export default async function Login() {
  const connections = await getConnections();
  // console.log(connections);
  const emailConnectionId = connections?.find(
    (conn) => conn.strategy === 'email:otp',
  )?.id;

  return (
    <div className="flex h-full w-full flex-col items-start justify-center text-left">
      <div className="flex w-full items-center justify-center gap-20">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email or login via Google or Github below.
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

    // <div className="flex w-full max-w-5xl flex-col items-start justify-center text-left">
    //   <div className="flex h-screen w-full items-center justify-center gap-20">
    //     {connections
    //       ?.filter((conn: any) => conn.strategy.includes('oauth2'))
    //       .map((connection: any) => (
    //         <LoginLink
    //           key={connection.id}
    //           authUrlParams={{ connection_id: connection.id }}
    //         >
    //           <OAuthIcon provider={connection.display_name} />
    //         </LoginLink>
    //       ))}

    //     <RegisterLink>
    //       <Button variant={'secondary'} className="p-6 text-xl">
    //         Register
    //       </Button>
    //     </RegisterLink>
    //   </div>
    // </div>
  );
}
