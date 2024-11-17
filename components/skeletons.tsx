import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Asul } from 'next/font/google';

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

export async function PlayerCardSkeleton() {
  return (
    <Card className="flex w-full animate-pulse flex-col items-center gap-1 p-2 md:min-h-[550px] md:flex-row">
      <CardHeader className="md:gap-1md:p-2 w-full gap-1 p-1 md:h-full md:w-2/6 md:justify-center lg:p-6">
        <CardContent className="flex max-w-full justify-center pb-0">
          <div className="relative flex h-[250px] w-full max-w-[250px] self-center">
            <div className="h-full w-full animate-pulse rounded-full bg-gray-300"></div>
          </div>
        </CardContent>
        <CardTitle>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-4">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
        <Button variant={'secondary'}>Add to Watchlist</Button>
        <Button variant={'secondary'}>More Info</Button>
      </CardHeader>
      <PlayerChartSkeleton />
    </Card>
  );
}

export async function PlayerChartSkeleton() {
  return (
    <div className="flex h-full w-full flex-col justify-center md:w-4/6">
      <CardHeader className="items-start p-1 md:p-4 lg:py-0">
        <CardTitle className="text-3xl">Pulse Rating (PR)</CardTitle>
        <CardDescription>Last x games</CardDescription>
      </CardHeader>
      <div className="h-full w-full"></div>
      {/* <Skeleton className="h-full w-full rounded-xl p-1 md:p-4 lg:px-4" /> */}
      <CardFooter className="flex-col items-start gap-2 p-1 text-sm md:p-4 lg:px-4 lg:pt-0">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardFooter>
    </div>
  );
}
