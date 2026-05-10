import OnboardingForm from '@/app/onboarding/components/onboarding-form';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Onboarding() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  return (
    <div className="flex w-full flex-col gap-2 md:w-4/5 lg:w-1/2">
      <Card className="col-span-4 row-span-1 md:col-start-2">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Welcome to Prospect Portfolio
          </CardTitle>
          <CardDescription>
            Just a few more things to get you fully onboarded.
          </CardDescription>
        </CardHeader>
      </Card>
      <OnboardingForm
        userId={session.user.id}
        defaultPicture={session.user.image?.replace(/=s\d+-c/, '=s400-c')}
      />
    </div>
  );
}
