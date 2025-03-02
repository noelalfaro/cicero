'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { GitCommitVertical, TrendingUp } from 'lucide-react';
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

import PlayerTicker from '@/components/player/player-ticker';
import { fetchPlayerStatsApi } from '@/lib/client/player-stats-api'; // Adjust the import path as necessary
import { PlayerStats } from '@/lib/definitions';
import { useParams } from 'next/navigation';
import PlayerChartError from '@/components/player/player-chart-error';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function PlayerStatsChart() {
  const params = useParams<{ id: string }>();
  const playerId = Number(params.id);
  const { data: stats, isError } = useSuspenseQuery({
    queryKey: ['playerStats', playerId],
    queryFn: () => fetchPlayerStatsApi(playerId),
    refetchOnMount: false,
    staleTime: 60000,
  });
  // console.log('PlayerStatsChart: ' + JSON.stringify(stats.stats));
  if (isError) {
    return <PlayerChartError />;
  }

  if (stats.length === 0) {
    return (
      <Card className="col-span-1 flex h-full grow flex-col items-center justify-center md:col-span-5 lg:col-span-6">
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
    game: `Game ${stat.stats_id}`,
    points: stat.points,
  }));

  const latestGame = stats!.length - 1;

  const averagePoints =
    stats.reduce((sum: any, stat: { points: any }) => sum + stat.points, 0) /
    stats.length;
  const lastGamePoints = stats[stats.length - 1].points;
  const pointsDifference = lastGamePoints - averagePoints;
  const percentageDifference = (pointsDifference / averagePoints) * 100;

  return (
    <>
      <Card className="flex grow flex-col gap-0 md:col-span-5 md:flex-row lg:col-span-6">
        <div className="box-border flex h-full grow flex-col justify-between md:w-3/4">
          <CardHeader className="flex w-full md:pb-0">
            <CardTitle className="w-full text-2xl">Pulse Rating (PR)</CardTitle>
            <CardDescription className="w-full">
              Last {stats.length} games
            </CardDescription>
          </CardHeader>

          <CardContent className="flex w-full flex-col items-center justify-center px-4 md:flex-row md:pb-0">
            <ResponsiveContainer width="100%">
              <ChartContainer
                config={chartConfig}
                className="flex h-[200px] w-full items-center justify-center"
              >
                <LineChart data={chartData} accessibilityLayer>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    syncWithTicks
                  />
                  <XAxis dataKey={'game'} tickLine={false} axisLine={false} />
                  <YAxis
                    width={25}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={1}
                    tickCount={5}
                    // className="p-1"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  ></ChartTooltip>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="var(--primary)"
                    // dot={{ r: 2 }}
                    dot={({ cx, cy, payload }) => {
                      const r = 24;
                      return (
                        <GitCommitVertical
                          key={payload.game}
                          x={cx - r / 2}
                          y={cy - r / 2}
                          width={r}
                          height={r}
                          fill="var(--background)"
                          stroke="var(--primary)"
                        />
                      );
                    }}
                    activeDot={false}
                  />
                </LineChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>

          <CardFooter className="w-full flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              {pointsDifference >= 0 ? 'Up' : 'Down'} by{' '}
              {Math.abs(percentageDifference).toFixed(1)}% from average
              <TrendingUp
                className={`h-4 w-4 ${pointsDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}
              />
            </div>
            <div className="text-muted-foreground leading-none">
              Last game: {lastGamePoints} points (Average:{' '}
              {averagePoints.toFixed(1)})
            </div>
          </CardFooter>
        </div>
        <CardContent className="flex grow justify-center p-0 pr-6">
          <PlayerTicker latestScore={stats[latestGame].points} />
        </CardContent>
      </Card>
    </>
  );
}
