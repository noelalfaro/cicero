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
        {player.given_name} {player.family_name}
      </h1>
      <p>Position: {player.position}</p>
      <p>Hometown: {player.hometown}</p>
      <h2>Stats</h2>
      <ul>
        <li>PPG: {player.stats.ppg}</li>
        <li>APG: {player.stats.apg}</li>
        <li>RPG: {player.stats.rpg}</li>
        <li>Plus/Minus: {player.stats.plus_minus}</li>
        <li>Cicero Score: {player.stats.cicero_score}</li>
      </ul>
    </div>
  );
}
