import { fetchPlayerData } from '@/app/(main)/lib/data';
import { Player } from '@/app/(main)/lib/definitions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

// import { Link } from 'next-view-transitions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Add revalidate to the component level as well

async function Players() {
  const data: Player[] = await fetchPlayerData();
  // console.log(data);
  return (
    <>
      <Card>
        <CardHeader className="pb-1">
          <h2 className="text-2xl font-bold">Top Trenders</h2>
        </CardHeader>
        <CardContent>
          <CardDescription>
            These players have had the biggest increases to their PR scores over
            the last week. Updated Daily.
          </CardDescription>
          <div className="w-full">
            <Table className="gap-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>PR Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {data.map((player: Player) => (
                  <TableRow key={player.id} className="w-full">
                    <TableCell className="w-1/5 font-medium">
                      {player.display_fi_last}
                    </TableCell>

                    <TableCell className="w-1/5">{player.team_name}</TableCell>
                    <TableCell className="w-1/5">
                      <Link href={`/players/${player.id}`}>
                        <Button>View More</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                A list of players and their PR scores, seeded with Drizzle ORM
                to Neon Postgres.
              </TableCaption>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default Players;
