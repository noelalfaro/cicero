'use client';

import { ArrowDownIcon, ArrowUpIcon, TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PlayerStats } from '@/app/lib/definitions'; // Adjust the import path as necessary

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
  ChartConfig,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

interface PlayerStatsChartProps {
  stats: PlayerStats[];
}

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function PlayerStatsChart({ stats }: PlayerStatsChartProps) {
  if (!stats || stats.length === 0) {
    return <div>No stats available</div>;
  }

  const chartData = stats.map((stat) => ({
    game: `Game ${stat.stat_id}`,
    points: stat.points,
  }));
  // console.log('chart data: ' + JSON.stringify(stats));

  const latestGame = stats!.length - 1;

  const averagePoints =
    stats.reduce((sum, stat) => sum + stat.points, 0) / stats.length;
  const lastGamePoints = stats[stats.length - 1].points;
  const pointsDifference = lastGamePoints - averagePoints;
  const percentageDifference = (pointsDifference / averagePoints) * 100;

  const getDomain = (data: any) => {
    const maxValue = Math.max(...data.map((item: any) => item.desktop));
    const fixedMax = 300; // Set your desired fixed maximum here
    return [0, Math.max(fixedMax, maxValue)];
  };

  console.log('length of stats: ' + stats.length);
  console.log('Latest Game: ' + latestGame);
  console.log('Average Points: ' + averagePoints);
  console.log('Last Game Points: ' + lastGamePoints);
  console.log('Points Difference: ' + pointsDifference);
  console.log('Percentage Difference: ' + percentageDifference);

  return (
    <>
      {/* <Card> */}
      <div className="w-full md:w-4/6">
        <CardHeader className="p-1 md:p-4 lg:px-6">
          <CardTitle className="text-3xl">Pulse Rating (PR)</CardTitle>
          <CardDescription>Last {stats.length} games</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-start justify-start p-1 md:flex-row md:p-4 lg:px-6">
          <ResponsiveContainer
            width="100%"
            height={'min-h-[fit-content]'}
            style={{ padding: '0' }}
          >
            <ChartContainer
              config={chartConfig}
              className="flex items-center justify-start"
            >
              <LineChart data={chartData} accessibilityLayer>
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(var(--border))"
                  syncWithTicks
                />
                <XAxis dataKey={'none'} tickLine={false} axisLine={false} />
                <YAxis
                  width={25}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={1}
                  tickCount={5}
                  className="p-0"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                ></ChartTooltip>
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </ResponsiveContainer>
          <CardContent className="flex w-full flex-col justify-start gap-2 p-0 md:w-1/4 md:p-0">
            <CardHeader className="text-center text-8xl font-bold">
              {stats[latestGame].points}
              <div className="text-sm text-muted-foreground">
                Pulse Rating (PR)
              </div>
            </CardHeader>
            <Button className="w-full">
              Buy <ArrowUpIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button className="w-full" variant={'destructive'}>
              Sell <ArrowDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 p-1 text-sm md:p-4 lg:pt-0">
          <div className="flex gap-2 font-medium leading-none">
            {pointsDifference >= 0 ? 'Up' : 'Down'} by{' '}
            {Math.abs(percentageDifference).toFixed(1)}% from average
            <TrendingUp
              className={`h-4 w-4 ${pointsDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}
            />
          </div>
          <div className="leading-none text-muted-foreground">
            Last game: {lastGamePoints} points (Average:{' '}
            {averagePoints.toFixed(1)})
          </div>
        </CardFooter>
      </div>
      {/* </Card> */}
    </>
  );
}
