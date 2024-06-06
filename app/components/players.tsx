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
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Is Active?</TableHead>
            <TableHead>Player ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player: Player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.first_name}</TableCell>
              <TableCell className="font-medium">{player.last_name}</TableCell>
              <TableCell>{player.is_active ? <>Yes</> : <>No</>}</TableCell>
              <TableCell>{player.id}</TableCell>
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
