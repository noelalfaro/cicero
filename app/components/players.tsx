import { fetchPlayerData } from "@/app/lib/data";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Player = {
  id: number;
  name: string;
  stats: {
    apg: number;
    ppg: number;
    rpg: number;
    plusMinus: number;
    ciceroScore: number;
  };
  position: string;
  hometown: string;
};

async function Players() {
  const data = await fetchPlayerData();

  // console.log(data);
  return (
    <>
      <h1>Player's in database</h1>
      <Table>
        <TableCaption>A list player's and their cicero scores</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Position</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>PPG</TableHead>
            <TableHead>APG</TableHead>
            <TableHead>Hometown</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player: Player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.position}</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>{/* {player.stats.ppg} */}</TableCell>

              <TableCell>{/* {player.stats.apg} */}</TableCell>
              <TableCell>{player.hometown}</TableCell>
              <TableCell className="text-right">
                {/* {player.stats.ciceroScore} */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
export default Players;
