import { fetchPlayerDataByID } from '@/app/(main)/lib/data';
import { PlayerDetailsStatic } from '@/components/player-detail-static';
import { PlayerCardSkeleton } from '@/components/skeletons';
import { PlayerStatsChart } from '@/components/player-stats-chart';
import { Player } from '@/app/(main)/lib/definitions';
import PlayerNews from '@/components/player-news';
import PlayerAiSummary from '@/components/player-ai-summary';
import PlayerActionBar from '@/components/player-action-bar';
type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function PlayerDetailsPage({ params }: Props) {
  const { id } = await params;
  // Validate ID is a number
  const playerId = Number(id);

  if (isNaN(playerId)) {
    return (
      <div className="flex flex-col content-center justify-center">
        <h1 className="text-4xl font-bold">Invalid Player ID 🫠</h1>
      </div>
    );
  }

  const player: Player | null = await fetchPlayerDataByID(playerId);

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
    <>
      <div className="flex w-full flex-col gap-2 md:flex-row md:flex-wrap">
        <PlayerDetailsStatic player={player} />
        <PlayerStatsChart stats={player.stats ?? []} />
        <PlayerActionBar />
        <div className="mb-3 flex w-full flex-wrap gap-2 md:flex-nowrap">
          <PlayerNews />
          <PlayerAiSummary />
        </div>
      </div>
    </>
  );
}
