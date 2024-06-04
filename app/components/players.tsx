import { fetchPlayerData } from "@/app/lib/data";
import { Player } from "@/app/lib/definitions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";

async function Players() {
  const data: Player[] = await fetchPlayerData();
  // console.log(data);
  return (
    <>
      <h2 className="my-2 text-2xl font-bold">Top Trenders</h2>
      <Table className="w-full gap-4">
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>PPG</TableHead>
            <TableHead>APG</TableHead>
            <TableHead>Hometown</TableHead>
            <TableHead>Score</TableHead>
            {/* <TableHead className="text-right">Link</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player) => (
            <TableRow key={player.player_id}>
              <TableCell className="font-medium">
                {player.leagues.pos}
              </TableCell>
              <TableCell>
                {player.firstname} {player.lastname}
              </TableCell>
              {/* <TableCell>{player.stats?.points}</TableCell> */}
              {/* <TableCell>{player.stats?.assists}</TableCell> */}
              <TableCell>{player.birth.country}</TableCell>
              {/* <TableCell>{player.stats.cicero_score}</TableCell> */}
              <TableCell>
                <Link href={`/players/${player.player_id}`}>
                  <Button>View More</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          A list of players and their cicero scores, seeded with Drizzle ORM to
          Neon Postgres.
        </TableCaption>
      </Table>
    </>
  );
}

export default Players;
