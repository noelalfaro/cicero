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
            <TableHead>Name</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Team</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player: Player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">
                {player.display_fi_last}
              </TableCell>
              <TableCell className="font-medium">{player.school}</TableCell>
              <TableCell>{player.position}</TableCell>
              <TableCell>{player.team_name}</TableCell>
              <TableCell>
                <Link href={`/players/${player.id}`}>
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
