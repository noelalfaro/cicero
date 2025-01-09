import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { OAuthIcon } from '@/components/auth/oAuthButton';

import { getConnections } from '@/app/(main)/lib/misc';
// import { Link } from 'next-view-transitions';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { EmailLogin } from '@/components/auth/email-login';

// export const dynamic = 'force-dynamic';

export default async function Login() {
  const connections = await getConnections();
  // console.log(connections);
  const emailConnectionId = connections?.find(
    (conn) => conn.strategy === 'email:otp',
  )?.id;

  // const player = async () => {
  //   const response = await fetch(
  //     'https://stats.nba.com/stats/leagueleaders?ActiveFlag=&LeagueID=00&PerMode=Totals&Scope=S&Season=2019-20&SeasonType=Regular+Season&StatCategory=PTS',
  //   );
  //   const data = await response.json();
  //   console.log(data.resultSet.rowSet[2]);
  //   // console.log(JSON.stringify(data.resultSets, null, 2));
  // };

  // player();

  return (
    <div className="flex min-h-screen w-full items-center justify-center self-center text-left">
      <Card className="w-full md:w-1/2 lg:w-4/12">
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
            <Link href={'/register'} className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
