import { Player } from '@/app/lib/definitions';
import { fetchPlayerDataByID } from '@/app/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlayerStatsChart } from '@/components/player-stats-chart';
import { PlayerCardSkeleton } from '@/components/skeletons';

export default async function PlayerDetails({
  params,
}: {
  params: Promise<Player>;
}) {
  // unstable_noStore();
  const { id } = await params;
  const player: Player | null = await fetchPlayerDataByID(id);

  if (!player)
    return (
      <div className="h-screen content-center">
        <h1 className="text-4xl font-bold">
          Technical Foul! Player not found. 🫠
        </h1>
      </div>
    );

  const formattedDate = new Date(player.birthdate);

  const latestGame = player.stats!.length - 1;

  return (
    <Card className="flex h-fit w-full flex-col items-center gap-1 p-2 md:flex-row lg:min-h-[550px]">
      <CardHeader className="w-full gap-1 p-1 md:h-full md:w-2/6 md:justify-center md:gap-1 md:p-2 lg:p-6">
        <CardContent className="flex max-w-full justify-center pb-0">
          <div className="relative flex h-[250px] w-full max-w-[250px] self-center">
            <Image
              src={player.picture!}
              alt={`${player.id}.png`}
              fill={true}
              className="rounded-full object-cover"
              priority={true}
            />
          </div>
        </CardContent>
        <CardTitle>
          {player.first_name} {player.last_name}
        </CardTitle>
        <CardDescription className="">
          {player.team_city} {player.team_name}
        </CardDescription>
        <Button variant={'secondary'}>Add to Watchlist</Button>
        <Button variant={'secondary'}>More Info</Button>
      </CardHeader>

      <PlayerStatsChart stats={player.stats ?? []} />
    </Card>

    // <PlayerCardSkeleton />
  );
}
