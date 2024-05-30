// import { fetchPlayerData } from "@/app/lib/data";
// import { Player } from "@/app/lib/definitions";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Link } from "next-view-transitions";

// async function Players() {
//   const data = await fetchPlayerData();
//   // console.log(data);

//   // console.log(data);
//   return (
//     <>
//       <h2 className="my-2 text-2xl font-bold">Top Trenders</h2>
//       {/* <p>
//         This table will be set to showcase the top trenders. Green Badges
//         indicate they're trending upwards, while red indicates trending
//         downwards
//       </p> */}
//       <Table className="w-full">
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[100px]">Position</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>PPG</TableHead>
//             <TableHead>APG</TableHead>
//             <TableHead>Hometown</TableHead>
//             <TableHead>Score</TableHead>
//             <TableHead>Link</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.map((player: any) => (
//             <TableRow key={player.player_id}>
//               <TableCell className="font-medium">{player.position}</TableCell>
//               <TableCell>
//                 {player.given_name + " " + player.family_name}
//               </TableCell>
//               <TableCell>{player.stats.ppg}</TableCell>

//               <TableCell>{player.stats.apg}</TableCell>
//               <TableCell>{player.hometown}</TableCell>
//               <TableCell>{player.stats.cicero_score}</TableCell>
//               <Link className="w-full" href={`/players/${player.player_id}`}>
//                 <TableCell className="text-right">View More</TableCell>
//               </Link>
//             </TableRow>
//           ))}
//         </TableBody>
//         <TableCaption>
//           A list of players and their cicero scores, seeded with Drizzle ORM to
//           Neon Postgres.
//         </TableCaption>
//       </Table>
//     </>
//   );
// }
// export default Players;
// src/app/players/page.tsx
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
import Link from "next/link"; // Use Next.js Link component
import { Button } from "@/components/ui/button";

async function Players() {
  const data: Player[] = await fetchPlayerData();
  console.log(data);
  return (
    <>
      <h2 className="my-2 text-2xl font-bold">Top Trenders</h2>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Position</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>PPG</TableHead>
            <TableHead>APG</TableHead>
            <TableHead>Hometown</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player) => (
            <TableRow key={player.player_id}>
              <TableCell className="font-medium">{player.position}</TableCell>
              <TableCell>
                {player.given_name} {player.family_name}
              </TableCell>
              <TableCell>{player.stats.ppg}</TableCell>
              <TableCell>{player.stats.apg}</TableCell>
              <TableCell>{player.hometown}</TableCell>
              <TableCell>{player.stats.cicero_score}</TableCell>
              <TableCell className="text-right">
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
