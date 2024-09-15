'use client';

import { TrendingUp } from 'lucide-react';
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

interface PlayerStatsChartProps {
  stats: PlayerStats[];
}

export function PlayerStatsChart({ stats }: PlayerStatsChartProps) {
  const chartData = stats.map((stat) => ({
    game: `Game ${stat.stat_id}`,
    points: stat.points,
  }));

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

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Points Per Game</CardTitle>
        <CardDescription>Last {stats.length} games</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="game" tickLine={false} axisLine={false} />
              <YAxis
                domain={getDomain(chartData)}
                tickLine={false}
                axisLine={false}
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
  );
}
