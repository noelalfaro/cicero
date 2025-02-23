import React from 'react';
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
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
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
  ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export function ExploreTableSkeleton() {
  return (
    <>
      <h2 className="my-2 text-2xl font-bold">Top Trenders</h2>
      <Table className="w-full gap-4">
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Is Active?</TableHead>
            <TableHead>Player Id</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Loading</TableCell>
            <TableCell>Loading</TableCell>
            <TableCell>Loading</TableCell>
            <TableCell>Loading</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
export async function PlayerDetailsStaticSkeleton() {
  return (
    <Card className="bg-card text-card-foreground col-span-1 flex w-full flex-col items-center justify-between rounded-xl border shadow-xs md:col-span-3 lg:col-span-2">
      <CardHeader className="flex w-full flex-col items-center justify-center pb-0 md:gap-1">
        <Skeleton className="h-[200px] w-[200px] rounded-full" />

        <div className="mt-4 w-full space-y-2">
          <Skeleton className="h-8 w-3/4" />
        </div>
      </CardHeader>

      <CardContent className="flex w-full flex-col justify-start">
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;
export function PlayerStatsChartSkeleton() {
  return (
    <Card className="flex h-full grow flex-col md:col-span-5 lg:col-span-6">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl">Pulse Rating (PR)</CardTitle>
        <CardDescription>Last X games</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-start justify-start pb-0 md:flex-row">
        <Skeleton className="h-[200px] w-full"></Skeleton>
      </CardContent>
    </Card>
  );
}

export async function PlayerActionBarSkeleton() {
  return (
    <Card className="flex w-full flex-col justify-between md:col-span-8 md:flex-row">
      <CardHeader className="w-full md:w-1/2">
        <CardTitle>Do You Agree?</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full justify-end gap-4 p-6 md:w-1/4">
        <ThumbsUp />
        <ThumbsDown />
      </CardContent>
    </Card>
  );
}

export async function PlayerAiSummarySkeleton() {
  return (
    <Card className="flex w-full flex-col md:col-span-4">
      <CardHeader className="min-h-[88px] pb-3">
        <CardTitle>PR Trend</CardTitle>
        <CardDescription className="h-full grow">
          AI Summary of what affected the score.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex grow flex-col overflow-auto">
        <div className="flex h-full grow flex-col justify-between gap-2">
          <Skeleton className="h-[75px] w-full md:h-[75%]"></Skeleton>
          <Skeleton className="flex h-[25px] w-full grow"></Skeleton>
        </div>
      </CardContent>
    </Card>
  );
}

export async function PlayerNewsSkeleton() {
  return (
    <Card className="flex w-full flex-col justify-between md:col-span-4">
      <Carousel className="flex grow flex-col">
        <CardHeader className="flex w-full flex-row space-y-0 pb-3">
          <div className="flex w-1/2 flex-col">
            <CardTitle className="text-2xl">NBA News</CardTitle>
            <CardDescription>Get the latest news on the NBA</CardDescription>
          </div>

          <div className="mt-0 flex grow items-center justify-end gap-2">
            <CarouselPrevious className="relative top-0 right-0 left-0 m-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative top-0 right-0 left-0 m-0 translate-x-0 translate-y-0" />
          </div>
        </CardHeader>

        <CardContent className="flex grow flex-col">
          <div className="flex h-full grow flex-col justify-between gap-2">
            <Skeleton className="h-[75px] w-full md:h-[75%]"></Skeleton>
            <Skeleton className="h-[25px] w-full grow md:flex"></Skeleton>
          </div>
        </CardContent>
      </Carousel>
    </Card>
  );
}
