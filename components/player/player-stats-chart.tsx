'use client';
import { useQuery } from '@tanstack/react-query';

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
import NumberFlow from '@number-flow/react';
import PlayerTicker from '@/components/player/player-ticker';
import { fetchPlayerStats } from '@/app/(main)/lib/client/client-fetch'; // Adjust the import path as necessary
import { PlayerStats } from '@/app/(main)/lib/definitions';
import { PlayerStatsChartSkeleton } from '@/components/layout/skeletons';
import { useParams } from 'next/navigation';

interface PlayerStatsChartProps {
  stats: PlayerStats[];
}

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function PlayerStatsChart() {
  const params = useParams<{ id: string }>();
  const playerId = Number(params.id);
  const {
    data: stats,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['playerStats', playerId],
    queryFn: () => fetchPlayerStats(playerId),
    refetchOnMount: false,
  });
  // console.log(stats);

  if (isLoading) {
    return <PlayerStatsChartSkeleton />;
  }

  if (isError) {
    return (
      <Card className="col-span-1 flex h-full flex-grow flex-col items-center justify-center md:col-span-5 lg:col-span-6">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            There was a problem loading the player's stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (stats.length === 0) {
    return (
      <Card className="col-span-1 flex h-full flex-grow flex-col items-center justify-center md:col-span-5 lg:col-span-6">
        <CardHeader>
          <CardTitle>No Performance Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This player doesn't have any game stats yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = stats.map((stat: PlayerStats) => ({
    game: `Game ${stat.stat_id}`,
    points: stat.points,
  }));

  const latestGame = stats!.length - 1;

  const averagePoints =
    stats.reduce((sum: any, stat: { points: any }) => sum + stat.points, 0) /
    stats.length;
  const lastGamePoints = stats[stats.length - 1].points;
  const pointsDifference = lastGamePoints - averagePoints;
  const percentageDifference = (pointsDifference / averagePoints) * 100;

  const getDomain = (data: any) => {
    const maxValue = Math.max(...data.map((item: any) => item.desktop));
    const fixedMax = 300; // Set your desired fixed maximum here
    return [0, Math.max(fixedMax, maxValue)];
  };

  // console.log('length of stats: ' + stats.length);
  // console.log('Latest Game: ' + latestGame);
  // console.log('Average Points: ' + averagePoints);
  // console.log('Last Game Points: ' + lastGamePoints);
  // console.log('Points Difference: ' + pointsDifference);
  // console.log('Percentage Difference: ' + percentageDifference);

  return (
    <>
      <Card className="box-border flex h-full flex-grow flex-col justify-between md:col-span-5 lg:col-span-6">
        <CardHeader className="flex w-full pb-0">
          <CardTitle className="w-full text-2xl">Pulse Rating (PR)</CardTitle>
          <CardDescription className="w-full">
            Last {stats.length} games
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center pb-0 md:flex-row">
          <ResponsiveContainer width="100%" height="100%" minHeight={180}>
            <ChartContainer
              config={chartConfig}
              className="flex items-center justify-center"
            >
              <LineChart data={chartData} accessibilityLayer>
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(var(--border))"
                  syncWithTicks
                />
                <XAxis dataKey={'game'} tickLine={false} axisLine={false} />
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
          <PlayerTicker latestScore={stats[latestGame].points} />
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
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
      </Card>
    </>
  );
}
