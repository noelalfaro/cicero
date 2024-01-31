async function Players() {
  const data = await fetch(
    "https://65baa203b4d53c0665535c4a.mockapi.io/api/prodigy-portfolio/players",
    { cache: "no-store" },
  );
  const res = await data.json();

  return (
    <>
      <h1>Player's PPG</h1>
      {res.map((player: any) => (
        <h1 key={player.id}>{player.name}</h1>
      ))}
    </>
  );
}
export default Players;
