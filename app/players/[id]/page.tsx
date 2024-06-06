import { NewsArticle, Player } from "@/app/lib/definitions";
import {
  FetchNewsArticlesByPlayerID,
  fetchPlayerDataByID,
} from "@/app/lib/data";
import { Link } from "next-view-transitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function PlayerDetails({ params }: { params: Player }) {
  const player: Player | null = await fetchPlayerDataByID(params.id);
  // console.log(player);

  const data: NewsArticle[] = await FetchNewsArticlesByPlayerID(
    player!.first_name,
    player!.last_name,
  );

  // console.log(player.first_name + player.last_name);
  const defaultPictureUrl =
    "https://cdn.freebiesupply.com/images/large/2x/nba-logo-transparent.png";

  if (!player)
    return (
      <div className="h-screen content-center">
        <h1 className="text-4xl font-bold">
          Technical Foul! Player not found. 🫠
        </h1>
      </div>
    );
  return (
    <div className="flex w-full flex-col">
      <h1 className="text-4xl font-bold">
        {player.first_name} {player.last_name}
      </h1>
      <h2 className="font-semibold">{player.id}</h2>
      <Image
        src={player.picture || defaultPictureUrl}
        alt={`${player.id}.png`}
        width={260} // Add appropriate width and height
        height={190} // Add appropriate width and height
      ></Image>
      <div className="flex w-full">
        <h2 className="my-5 text-2xl font-semibold">
          Notable News About {player.first_name}
        </h2>
      </div>
      {data.map((result: NewsArticle) => (
        <Link href={result.url} key={result.url}>
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
      ))}
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
