// import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { Link } from 'next-view-transitions';
// import Chart from '@/components/chart';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart } from 'recharts';
import { Button } from '@/components/ui/button';

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center justify-start">
      <div>Dashboard for {user?.given_name}</div>

      <Button variant={'link'}>
        <Link href={'/players/2544'}>Link to Lebron's Page</Link>
      </Button>

      <Button variant={'link'}>
        <Link href={'/players/201142'}>Link to Durant's Page</Link>
      </Button>
      <Button variant={'destructive'}>
        <LogoutLink>Logout</LogoutLink>
      </Button>

      {/* <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer> */}
    </div>
  );
}
