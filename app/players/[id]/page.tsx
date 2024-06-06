import { Player } from "@/app/lib/definitions";
import { fetchPlayerDataByID } from "@/app/lib/data";

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
  return (
    <div>
      <h1 className="text-4xl font-bold">
        {player.first_name} {player.last_name}
      </h1>
      <h2 className="text-2xl font-semibold">{player.id}</h2>
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
