import Players from '@/components/players';
import { ExploreTableSkeleton } from '@/components/skeletons';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="text-4xl font-bold">Explore</h3>
        <p>
          This page will showcase Top Trenders, News Articles, and list notable
          players.
        </p>
      </div>

      <Suspense fallback={<ExploreTableSkeleton />}>
        <Players />
      </Suspense>
    </>
  );
}
