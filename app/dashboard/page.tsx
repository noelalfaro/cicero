import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { Link } from 'next-view-transitions';
import Chart from '@/app/components/chart';
export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex flex-col items-center justify-start">
      <>
        <div>Dashboard for {user?.given_name}</div>
        <p>Demo For Next-View-Transitions</p>
        <Link href="/my-profile">
          Demo For Next-View-Transitions Go to /my-profile
        </Link>
        <LogoutLink>Logout</LogoutLink>
      </>
    </div>
  );
}
