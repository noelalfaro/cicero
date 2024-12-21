import { Suspense } from 'react';
import {
  PlayerDetailsStaticSkeleton,
  PlayerStatsChartSkeleton,
  PlayerNewsSkeleton,
  PlayerActionBarSkeleton,
  PlayerAiSummarySkeleton,
} from '@/components/skeletons';
import { fetchPlayerDataByID } from '@/app/(main)/lib/data';
import { PlayerDetailsStatic } from '@/components/player-detail-static';
import { PlayerStatsChart } from '@/components/player-stats-chart';
import { Player } from '@/app/(main)/lib/definitions';
import PlayerNews from '@/components/player-news';
import PlayerAiSummary from '@/components/player-ai-summary';
import PlayerActionBar from '@/components/player-action-bar';

export default async function PlayerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const playerId = Number(id);

  if (isNaN(playerId)) {
    return (
      <div className="flex flex-col content-center justify-center">
        <h1 className="text-4xl font-bold">Invalid Player ID 🫠</h1>
      </div>
    );
  }

  const player = await fetchPlayerDataByID(playerId);

  if (!player) {
    return (
      <div className="flex flex-col content-center justify-center">
        <h1 className="text-4xl font-bold">
          Technical Foul! Player not found. 🫠
        </h1>
      </div>
    );
  }

  return (
    <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]">
      {/* <Suspense fallback={<PlayerDetailsStaticSkeleton />}> */}
      <PlayerDetailsStatic player={player} />
      {/* </Suspense> */}

      <Suspense fallback={<PlayerStatsChartSkeleton />}>
        <PlayerStatsChart stats={player.stats ?? []} />
      </Suspense>

      <Suspense fallback={<PlayerActionBarSkeleton />}>
        <PlayerActionBar />
      </Suspense>

      <Suspense fallback={<PlayerNewsSkeleton />}>
        <PlayerNews playerId={player.id} />
      </Suspense>

      <Suspense fallback={<PlayerAiSummarySkeleton />}>
        <PlayerAiSummary playerId={player.id} />
        {/* <PlayerAiSummarySkeleton /> */}
      </Suspense>
    </div>
  );
}
