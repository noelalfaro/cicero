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

export default async function PlayerDetails({ params }: { params: Player }) {
  const player: Player | null = await fetchPlayerDataByID(params.id);
  console.log(player);

  if (!player)
    return (
      <div className="h-screen content-center">
        <h1 className="text-4xl font-bold">
          Technical Foul! Player not found. 🫠
        </h1>
      </div>
    );

  const data: NewsArticle[] = await FetchNewsArticlesByPlayerID(
    player.first_name,
    player.last_name,
  );
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

      <h3 className="font-semibold">{player.averages?.points}</h3>

      <div className="flex w-full">
        <Image
          src={player.picture || defaultPictureUrl}
          alt={`${player.id}.png`}
          width={260} // Add appropriate width and height
          height={190} // Add appropriate width and height
          priority={true}
        />
        <Card className="w-96 bg-muted transition-colors hover:bg-muted/40">
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
      <div className="flex w-full flex-wrap gap-2">
        {data.map((result: NewsArticle) => (
          <div className="flex w-fit" key={result.url}>
            <Link href={result.url} className="w-fit">
              <Card className="w-96 bg-muted transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {result.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Button className="font-semibold capitalize">
                    {result.source}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* <p>Position: {player.leagues.pos}</p>
      <p>Hometown: {player.birth.country}</p>
      <p>Player Id: {player.player_id}</p>
      <p>Api ID: {player.api_id}</p> */}
      {/* <h2 className="text-2xl font-bold">Stats</h2> */}
      <ul>
        {/* <li>PPG: {player.stats?.points}</li>
        <li>APG: {player.stats?.assists}</li>
        <li>RPG: {player.stats?.defReb}</li>
        <li>Plus/Minus: {player.stats?.plusMinus}</li> */}
        {/* <li>Cicero Score: {player.stats.}</li> */}
      </ul>
    </div>
  );
}
