import OnboardingForm from '@/components/auth/onboarding-form';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { fetchUserConnectionId } from '@/lib/data/users';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function Onboarding() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user);

  if (!user) {
    // Handle the case where user is null
    return (
      <div className="flex min-h-screen w-full items-center justify-center self-center text-left">
        <Card className="w-full md:w-1/2 lg:w-4/12">
          <CardContent>
            <p>Loading user data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  let connectionId;
  try {
    connectionId = await fetchUserConnectionId(user.id);
  } catch (error) {
    console.error('Failed to fetch connection ID:', error);
    connectionId = null; // or a default value
  }

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
          <OnboardingForm userId={user?.id} connectionId={connectionId} />
        </CardContent>
      </Card>
    </div>
  );
}
