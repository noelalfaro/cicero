import { Suspense } from 'react';
import {
  PlayerDetailsStaticSkeleton,
  PlayerStatsChartSkeleton,
  PlayerNewsSkeleton,
  PlayerActionBarSkeleton,
  PlayerAiSummarySkeleton,
} from '@/components/layout/skeletons';
import { fetchPlayerDataByID } from '@/app/(main)/lib/data';
import { PlayerDetailsStatic } from '@/components/player/player-detail-static';
import { PlayerStatsChart } from '@/components/player/player-stats-chart';
import PlayerNews from '@/components/player/player-news';
import PlayerAiSummary from '@/components/player/player-ai-summary';
import PlayerActionBar from '@/components/player/player-action-bar';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchPlayerStats } from '@/app/(main)/lib/client/client-fetch';

export default async function PlayerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playerId = Number(id);

  if (isNaN(playerId)) {
    return <InvalidPlayerIdError />;
  }

  const player = await fetchPlayerDataByID(playerId);

  if (!player) {
    return <PlayerNotFoundError />;
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // 1 minute
      },
    },
  });
  await queryClient.prefetchQuery({
    queryKey: ['playerStats', playerId],
    queryFn: () => fetchPlayerStats(playerId),
  });

  return (
    <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]">
      <Suspense fallback={<PlayerDetailsStaticSkeleton />}>
        <PlayerDetailsStatic player={player} />
      </Suspense>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PlayerStatsChart />
      </HydrationBoundary>

      <Suspense fallback={<PlayerActionBarSkeleton />}>
        <PlayerActionBar />
      </Suspense>

      <Suspense fallback={<PlayerNewsSkeleton />}>
        <PlayerNews playerId={player.id} />
      </Suspense>

      <Suspense fallback={<PlayerAiSummarySkeleton />}>
        <PlayerAiSummary playerId={player.id} />
      </Suspense>
    </div>
  );
}

function InvalidPlayerIdError() {
  return (
    <div className="flex flex-col content-center justify-center">
      <h1 className="text-4xl font-bold">Invalid Player ID 🫠</h1>
    </div>
  );
}

function PlayerNotFoundError() {
  return (
    <div className="flex flex-col content-center justify-center">
      <h1 className="text-4xl font-bold">
        Technical Foul! Player not found. 🫠
      </h1>
    </div>
  );
}
