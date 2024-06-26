import { NewsArticle, Player } from '@/app/lib/definitions';
import {
  FetchNewsArticlesByPlayerID,
  fetchPlayerDataByID,
} from '@/app/lib/data';
import { Link } from 'next-view-transitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Car } from 'lucide-react';

export default async function PlayerDetails({ params }: { params: Player }) {
  const player: Player | null = await fetchPlayerDataByID(params.id);
  // console.log(player);

  if (!player)
    return (
      <div className="h-screen content-center">
        <h1 className="text-4xl font-bold">
          Technical Foul! Player not found. 🫠
        </h1>
      </div>
    );

  // const data: NewsArticle[] | null = await FetchNewsArticlesByPlayerID(
  //   player.first_name,
  //   player.last_name,
  // );
  const formattedDate = new Date(player.birthdate);

  // console.log(player.first_name + player.last_name);
  const defaultPictureUrl =
    'https://cdn.freebiesupply.com/images/large/2x/nba-logo-transparent.png';

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <h1 className="text-4xl font-bold">
          {player.first_name} {player.last_name}
        </h1>
        <Button>Buy</Button>
        <Button variant={'destructive'}>Sell</Button>
        {/* <h2 className="font-semibold">{player.id}</h2> */}
      </div>

      <div className="flex flex-col">
        <h3 className="text-2xl font-semibold">{player.team_name}</h3>
        <h3 className="font-semibold">Year Drafted: {player.draft_year}</h3>
        <h3 className="font-semibold">Round: {player.draft_round}</h3>
        <h3 className="font-semibold">Pick #{player.draft_number}</h3>
        <h3 className="font-semibold">
          DOB: {formattedDate.toLocaleDateString()}
        </h3>
      </div>

      {/* <h3 className="font-semibold">PPG:{player.averages.ppg?.toFixed(1)}</h3> */}
      <Card>
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
          </CardHeader>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col">
        <Image
          src={player.picture || defaultPictureUrl}
          alt={`${player.id}.png`}
          width={260} // Add appropriate width and height
          height={190} // Add appropriate width and height
          priority={true}
        />
        <Card className="w-96 bg-card/20 transition-colors">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              AI Summary of Score
            </CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription>
              This is a fake summary for why {player.display_first_last}'s
              cicero score is the way it is
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <h2 className="my-5 text-2xl font-semibold">
        Notable News About {player.first_name}
      </h2>
      {/* <div className="bg-red-300 px-12">
        <Carousel
          opts={{
            align: 'center',
            skipSnaps: true,
          }}
          className="min-w-sm w-full"
        >
          <CarouselContent>
            {data.map((result: NewsArticle) => (
              <CarouselItem
                className="md:basis-1/2 lg:basis-1/3"
                key={result.url}
              >
                <Link href={result.url} className="">
                  <Card className="min-h-52 justify-between bg-muted transition-colors">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        {result.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex items-start">
                      <Button className="font-semibold capitalize">
                        {result.source}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}

          
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div> */}
    </div>
  );
}
