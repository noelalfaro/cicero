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
    <>
      <div className="flex w-full flex-col gap-2 lg:flex-row">
        <Card className="flex w-full flex-col gap-1 rounded-xl border bg-card text-card-foreground shadow-sm md:w-[300px]">
          <CardHeader className="flex w-full flex-col pb-0 md:justify-center md:gap-1">
            <div className="relative flex h-[250px] w-full max-w-[250px] self-center">
              <Image
                src={player.picture!}
                alt={`${player.id}.png`}
                fill={true}
                className="rounded-full object-cover"
                priority={true}
              />
            </div>
            <CardTitle>
              {player.first_name} {player.last_name}
            </CardTitle>
            <CardDescription className="flex-grow text-current">
              {player.team_city} {player.team_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <Button variant={'secondary'}>Add to Watchlist</Button>
            {/* <Button variant={'secondary'}>More Info</Button> */}
          </CardContent>
        </Card>

        <PlayerStatsChart stats={player.stats ?? []} />

        {/* <PlayerCardSkeleton /> */}
      </div>
    </>
  );
}
