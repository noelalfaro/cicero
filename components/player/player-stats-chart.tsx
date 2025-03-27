'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TrendingUp, XCircleIcon, CircleCheck } from 'lucide-react';
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

interface ChartDataPoint {
  game: string;
  points: number;
  comment?: string | null; // Add comment property
}

export function PlayerStatsChart({
  initialStats,
}: {
  initialStats: PlayerStats[];
}) {
  const params = useParams<{ id: string }>();
  const playerId = Number(params.id);
  const { data: stats, isError } = useSuspenseQuery({
    queryKey: ['playerStats', playerId],
    queryFn: () => fetchPlayerStatsApi(playerId),
    refetchOnMount: false,
    initialData: initialStats,
    staleTime: 7200000,
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

  const numberOfGamesToShow = 5;
  const limitedStats = stats.slice(
    Math.max(stats.length - numberOfGamesToShow, 0),
  );

  const chartData: ChartDataPoint[] = limitedStats.map((stat: PlayerStats) => {
    let gameDate: Date;
    try {
      gameDate = new Date(stat.gamedate);
      if (isNaN(gameDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      gameDate = new Date('Invalid Date');
      console.error('Error parsing date:', stat.gamedate, error);
    }

    return {
      game:
        gameDate instanceof Date
          ? gameDate.toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              timeZone: 'UTC',
            })
          : 'Invalid Date',
      game_id: stat.stats_id,
      points: stat.points,
      prScore: stat.prScore,
      assists: stat.assists,
      rebounds: stat.totReb,
      opp: stat.opp,
      game_result: stat.game_result,
      min: stat.min,
      comment: stat.comment, // Include comment property
      isDNP: stat.comment
        ? stat.comment.includes('DNP') || stat.comment.includes('DND')
        : false,
    };
  });

  const latestGame = stats!.length - 1;

  const averagePrScore =
    stats.reduce((sum: any, stat: { prScore: any }) => sum + stat.prScore, 0) /
    stats.length;
  const averagePoints =
    stats.reduce((sum: any, stat: { points: any }) => sum + stat.points, 0) /
    stats.length;
  const lastGamePoints = stats[stats.length - 1].points;
  const lastGamePrScore = stats[stats.length - 1].prScore;
  const pointsDifference = lastGamePrScore - averagePrScore;
  const percentageDifference = (pointsDifference / averagePrScore) * 100;

  return (
    <>
      <Card className="flex grow flex-col gap-0 md:col-span-5 md:flex-row lg:col-span-6">
        <div className="box-border flex h-full grow flex-col justify-between md:w-3/4">
          <CardHeader className="flex w-full md:pb-0">
            <CardTitle className="w-full text-2xl">Pulse Rating (PR)</CardTitle>
            <CardDescription className="w-full">
              Last {limitedStats.length} games
            </CardDescription>
          </CardHeader>

          <CardContent className="flex w-full flex-col items-center justify-center px-4 md:flex-row md:pb-0">
            <ResponsiveContainer width="100%">
              <ChartContainer
                config={chartConfig}
                className="flex h-[200px] w-full items-center justify-center"
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    left: 4,
                    right: 8,
                  }}
                  accessibilityLayer
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    syncWithTicks
                  />
                  <XAxis
                    dataKey={'game'}
                    tickMargin={8}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    width={25}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={1}
                    tickCount={5}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideIndicator />}
                  ></ChartTooltip>

                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="prScore"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="var(--primary)"
                    dot={({ cx, cy, payload }) => {
                      const r = 18;
                      const isDNP = payload.isDNP;
                      return isDNP ? (
                        <XCircleIcon
                          key={payload.game_id}
                          x={cx - r / 2}
                          y={cy - r / 2}
                          width={r}
                          height={r}
                          fill="var(--background)"
                          stroke="var(--destructive)"
                        />
                      ) : (
                        <CircleCheck
                          key={payload.game_id}
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

          <CardFooter className="w-full flex-col items-start gap-2 py-6 text-sm md:py-0">
            <div className="flex gap-2 leading-none font-medium">
              {pointsDifference >= 0 ? 'PR up' : 'PR down'} by{' '}
              {Math.abs(percentageDifference).toFixed(1)}% from average
              <TrendingUp
                className={`h-4 w-4 ${pointsDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}
              />
            </div>
            <div className="text-muted-foreground leading-none">
              Last game: {lastGamePoints} points (Points Avg{' '}
              {averagePrScore.toFixed(1)})
            </div>
          </CardFooter>
        </div>
        <CardContent className="flex grow justify-center p-6 md:p-0 md:pr-6">
          <PlayerTicker lastGamePrScore={lastGamePrScore} />
        </CardContent>
      </Card>
    </>
  );
}
