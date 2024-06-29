import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/server';

import { Button } from '@/components/ui/button';

import { getConnections } from '@/app/lib/misc';

export default async function Login() {
  const connections = await getConnections();
  // console.log(connections);

  return (
    <div className="flex w-full max-w-5xl flex-col items-start justify-center text-left">
      <div className="flex h-screen w-full items-center justify-center gap-20">
        {connections
          ?.filter((conn: any) => conn.strategy.includes('oauth2'))
          .map((connection: any) => (
            <LoginLink
              key={connection.id}
              authUrlParams={{ connection_id: connection.id }}
            >
              <Button className="p-6 text-xl">
                Log In With {connection.display_name}
              </Button>
            </LoginLink>
          ))}

        <RegisterLink>
          <Button variant={'secondary'} className="p-6 text-xl">
            Register
          </Button>
        </RegisterLink>
      </div>
    </div>
  );
}
