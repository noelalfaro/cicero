import { fetchPlayerData } from '@/lib/data/players';
import { Player } from '@/lib/definitions';
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
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function Players() {
  const data: Player[] = await fetchPlayerData();

  return (
    <Card>
      <CardHeader className="pb-1">
        <h2 className="text-2xl font-bold">Active Players</h2>
      </CardHeader>
      <CardContent>
        <CardDescription>
          A sample of active roster players. Open a profile to see stats and PR
          score.
        </CardDescription>
        <div className="w-full">
          <Table className="gap-4">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Profile</TableHead>
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
                      <Button>View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Showing {data.length} active players. Use search to find others.
            </TableCaption>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default Players;
