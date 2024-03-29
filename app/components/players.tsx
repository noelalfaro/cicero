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

async function Players() {
  const data = await fetchPlayerData();

  // console.log(data);
  return (
    <>
      <Table className="w-full">
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
          {data.map((player: any) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.position}</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.stats.ppg}</TableCell>

              <TableCell>{player.stats.apg}</TableCell>
              <TableCell>{player.hometown}</TableCell>
              <TableCell className="text-right">
                {player.stats.ciceroScore}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          A list of players and their cicero scores, seeded with Drizzle ORM to
          Vercel Postgres.
        </TableCaption>
      </Table>
    </>
  );
}
export default Players;
