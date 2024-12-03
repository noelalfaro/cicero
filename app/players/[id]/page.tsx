import { fetchPlayerDataByID } from '@/app/lib/data';
import { PlayerDetailsStatic } from '@/components/player-detail-static';
import { PlayerCardSkeleton } from '@/components/skeletons';
import { PlayerStatsChart } from '@/components/player-stats-chart';
import { Player } from '@/app/lib/definitions';

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
      <div className="h-screen content-center">
        <h1 className="text-4xl font-bold">Invalid Player ID 🫠</h1>
      </div>
    );
  }

  const player: Player | null = await fetchPlayerDataByID(playerId);

  if (!player) {
    return (
      <div className="h-screen content-center">
        <h1 className="text-4xl font-bold">
          Technical Foul! Player not found. 🫠
        </h1>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 pb-4 md:flex-row">
      <PlayerDetailsStatic player={player} />
      <PlayerStatsChart stats={player.stats ?? []} />
    </div>
  );
}
