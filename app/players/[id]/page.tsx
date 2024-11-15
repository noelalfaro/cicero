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
import { Divider } from '@mui/material';
import { ArrowDownIcon, ArrowUpIcon, Car } from 'lucide-react';

export default async function PlayerDetails({
  params,
}: {
  params: Promise<Player>;
}) {
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
    <Card className="flex w-full flex-col items-center gap-1 p-2 md:flex-row">
      <CardHeader className="w-full gap-1 p-1 md:w-2/6 md:gap-0 md:p-2 lg:p-6">
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
      </CardHeader>

      <PlayerStatsChart stats={player.stats ?? []} />
    </Card>
    // {/* <div className="w-full md:w-6/12 lg:w-8/12 xl:w-9/12">
    //   <PlayerStatsChart stats={player.stats ?? []} />
    // </div> */}
  );
}
