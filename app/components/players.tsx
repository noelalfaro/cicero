import { fetchPlayerData } from "@/app/lib/data";

async function Players() {
  const data = await fetchPlayerData();

  return (
    <>
      <h1>Player's in database</h1>
      {data.map((player: any) => (
        <h1 key={player.id}>{player.name}</h1>
      ))}
    </>
  );
}
export default Players;
