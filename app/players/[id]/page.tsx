import { Player } from '@/app/lib/definitions';
import { fetchPlayerDataByID } from '@/app/lib/data';
// import { Link } from 'next-view-transitions';
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
import { Car } from 'lucide-react';
// import { Avatar, AvatarImage } from '@/components/ui/avatar';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';
// import useEmblaCarousel from 'embla-carousel-react';
// import { Car } from 'lucide-react';

export default async function PlayerDetails({ params }: { params: Player }) {
  const player: Player | null = await fetchPlayerDataByID(params.id);
  // console.log('returned player info: ' + JSON.stringify(player, null, 2));

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

  const defaultPictureUrl =
    'https://cdn.freebiesupply.com/images/large/2x/nba-logo-transparent.png';

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col">
        <h1 className="text-4xl font-bold">
          {player.first_name} {player.last_name}
        </h1>
        <h3 className="color text-xl font-semibold text-muted-foreground">
          {player.team_name}
        </h3>
        {/* <Button>Buy</Button>
        <Button variant={'destructive'}>Sell</Button> */}
      </div>

      {player.stats && player.stats.length > 0 && (
        <>
          <div className="flex w-full gap-2">
            <div className="w-3/5">
              <PlayerStatsChart stats={player.stats} />
            </div>
            <div className="flex w-2/5">
              <Card className="w-full">
                {/* <CardHeader></CardHeader> */}
                <CardContent className="h-full">
                  <div className="flex h-full flex-col content-center items-center justify-center gap-6">
                    <h1 className="text-8xl font-bold">
                      {player.stats[latestGame].points}
                    </h1>
                    {/* <Image
                      src={player.picture || defaultPictureUrl}
                      alt={`${player.id}.png`}
                      width={260} // Add appropriate width and height
                      height={190} // Add appropriate width and height
                      priority={true}
                    /> */}
                    <Button className="w-full">Buy</Button>
                    {/* <Divider></Divider> */}
                    <Button className="w-full" variant={'destructive'}>
                      Sell
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      <Card>
        {/* <CardContent> */}
        <CardHeader className="text-2xl font-semibold">
          More Information
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold">{player.team_name}</h3>
          <h3 className="font-semibold">Year Drafted: {player.draft_year}</h3>
          <h3 className="font-semibold">Round: {player.draft_round}</h3>
          <h3 className="font-semibold">Pick #{player.draft_number}</h3>
          <h3 className="font-semibold">
            DOB: {formattedDate.toLocaleDateString()}
          </h3>
        </CardContent>
        {/* </CardContent> */}
      </Card>

      {/* <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>{player.display_first_last}</CardTitle>
            <CardDescription>
              PPG: {player.averages.ppg?.toFixed(1)}
            </CardDescription>
            <CardDescription>
              APG: {player.averages.assists?.toFixed(1)}
            </CardDescription>
            <CardDescription>
              RPG: {player.averages.totReb?.toFixed(1)}
            </CardDescription>
            <CardDescription>

            </CardDescription>
          </CardHeader>
        </CardContent>
      </Card>

      <h2 className="my-5 text-2xl font-semibold">
        Notable News About {player.first_name}
      </h2> */}
    </div>
  );
}
