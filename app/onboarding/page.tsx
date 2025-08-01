import OnboardingForm from '@/components/auth/onboarding-form';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { fetchUserConnectionId, getUserById } from '@/lib/data/users';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function Onboarding() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log('helllo', user);

  if (!user) {
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
  let dbUser;
  try {
    connectionId = await fetchUserConnectionId(user.id);
    dbUser = await getUserById(user.id);
  } catch (error) {
    console.error('Failed to fetch connection ID:', error);
    connectionId = null; // or a default value
    dbUser = null;
  }

  return (
    <OnboardingForm
      userId={user?.id}
      connectionId={connectionId}
      defaultPicture={dbUser?.picture}
    />
  );
}
