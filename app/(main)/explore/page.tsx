import Players from '@/components/explore/players';
import { ExploreTableSkeleton } from '@/components/layout/skeletons';
import { Suspense } from 'react';
import Search from '@/components/explore/search';

export default async function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full space-y-3 text-center">
        <h1 className="text-6xl font-bold">Explore</h1>
        <h3 className="text-xl font-semibold">
          Browse Players, view trends, read headlines.
        </h3>
        <div className="w-full justify-end">
          <Search />
        </div>
      </div>

      <Suspense fallback={<ExploreTableSkeleton />}>
        <Players />
      </Suspense>
    </div>
  );
}
