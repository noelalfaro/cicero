import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OAuthLogin } from '@/components/auth/oauth-login';

export default function Login() {
  return (
    <div className="flex w-full grow items-center justify-center self-center text-left">
      <Card className="w-full md:w-1/2 lg:w-4/12">
        <CardHeader>
          <CardTitle className="text-2xl">Log In</CardTitle>
          <CardDescription>
            Sign in with Google to get started. New users will be prompted to
            choose a username next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <OAuthLogin />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
