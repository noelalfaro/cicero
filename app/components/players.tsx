import { fetchPlayerData } from "@/app/lib/data";

async function Players() {
  const data = await fetchPlayerData();

  return (
    <>
      <h1>Player's in database</h1>
      {data.map((player: any) => (
        <h1 className="flex text-xl" key={player.id}>
          {player.name} -
          <p className="font-bold"> Cicero Score: {player.stats.ciceroScore}</p>
        </h1>
      ))}
    </>
  );
}
export default Players;
