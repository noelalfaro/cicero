import { Player } from "@/app/lib/definitions";
import { fetchPlayerDataByID } from "@/app/lib/data";

export default async function PlayerDetails({ params }: { params: Player }) {
  const player: Player | null = await fetchPlayerDataByID(params.player_id);

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
      <h1>
        {player.firstname} {player.lastname}
      </h1>
      <p>Position: {player.position}</p>
      <p>Hometown: {player.birth_country}</p>
      <h2>Stats</h2>
      <ul>
        <li>PPG: {player.stats?.points}</li>
        <li>APG: {player.stats?.assists}</li>
        <li>RPG: {player.stats?.defReb}</li>
        <li>Plus/Minus: {player.stats?.plusMinus}</li>
        {/* <li>Cicero Score: {player.stats.}</li> */}
      </ul>
    </div>
  );
}
