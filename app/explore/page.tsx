import Players from '@/components/players';
import { ExploreTableSkeleton } from '@/components/skeletons';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';

export default async function Page() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Card>
          <CardHeader className="pb-1 text-4xl font-bold">Explore</CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              This page will showcase Top Trenders, News Articles, and list
              notable players.
            </CardDescription>
          </CardContent>
        </Card>
        <Suspense fallback={<ExploreTableSkeleton />}>
          <Players />
        </Suspense>
      </div>
    </>
  );
}
