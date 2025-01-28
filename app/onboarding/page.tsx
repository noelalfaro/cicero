import UsernameForm from '@/components/auth/username-form';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function Onboarding() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex min-h-screen w-full items-center justify-center self-center text-left">
      <Card className="w-full md:w-1/2 lg:w-4/12">
        <CardHeader className="pb-2 text-2xl font-bold">
          Create a Username
        </CardHeader>

        <CardContent>
          <CardDescription>
            Create a unique username to attach to your profile, this will be
            your identifier on the platform.
          </CardDescription>
          <UsernameForm userId={user?.id} initialUsername={user?.username} />
        </CardContent>
      </Card>
    </div>
  );
}
