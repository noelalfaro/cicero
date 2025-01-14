import Players from '@/components/explore/players';
import { ExploreTableSkeleton } from '@/components/layout/skeletons';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import NbaNews from '@/components/explore/nba-news';

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
        <NbaNews />
      </div>
    </>
  );
}
