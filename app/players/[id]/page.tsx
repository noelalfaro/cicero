// import { Player } from '@/app/lib/definitions';
// import { fetchPlayerDataByID } from '@/app/lib/data';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { PlayerStatsChart } from '@/components/player-stats-chart';
// import { PlayerCardSkeleton } from '@/components/skeletons';

// export default async function PlayerDetails({
//   params,
// }: {
//   params: Promise<Player>;
// }) {
//   // unstable_noStore();
//   const { id } = await params;
//   const player: Player | null = await fetchPlayerDataByID(id);

//   if (!player)
//     return (
//       <div className="h-screen content-center">
//         <h1 className="text-4xl font-bold">
//           Technical Foul! Player not found. 🫠
//         </h1>
//       </div>
//     );

//   const formattedDate = new Date(player.birthdate);

//   const latestGame = player.stats!.length - 1;

//   return (
//     <>
//       <div className="flex w-full flex-col gap-2 pb-4 md:flex-row">
//         <Card className="flex max-h-fit w-full flex-col gap-1 rounded-xl border bg-card text-card-foreground shadow-sm md:w-[300px]">
//           <CardHeader className="flex w-full flex-col pb-0 md:justify-center md:gap-1">
//             <div className="relative flex h-[250px] w-full max-w-[250px] self-center">
//               <Image
//                 src={player.picture!}
//                 alt={`${player.id}.png`}
//                 // width={250}
//                 // height={250}
//                 sizes="(max-width: 768px) 100vw, 250px"
//                 fill={true}
//                 className="rounded-full object-cover"
//                 priority={true}
//               />
//             </div>
//             <div className="flex flex-col">
//               <CardTitle>
//                 {player.first_name} {player.last_name}
//               </CardTitle>
//               <CardDescription>
//                 {player.team_city} {player.team_name}
//               </CardDescription>
//             </div>
//           </CardHeader>
//           <CardContent className="flex flex-col">
//             <Button variant={'secondary'}>Add to Watchlist</Button>
//           </CardContent>
//         </Card>

//         <PlayerStatsChart stats={player.stats ?? []} />
//       </div>
//     </>
//   );
// }

// app/players/[id]/page.tsx
import { fetchPlayerDataByID } from '@/app/lib/data';
import { PlayerDetailsStatic } from '@/components/player-detail-static';
import { PlayerCardSkeleton } from '@/components/skeletons';
import { PlayerStatsChart } from '@/components/player-stats-chart';
import { Player } from '@/app/lib/definitions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PlayerDetailsPage({ params }: Props) {
  const { id } = await params;
  // Validate ID is a number
  const playerId = Number(id);

  if (isNaN(playerId)) {
    return (
      <div className="h-screen content-center">
        <h1 className="text-4xl font-bold">Invalid Player ID 🫠</h1>
      </div>
    );
  }

  const player: Player | null = await fetchPlayerDataByID(playerId);

  if (!player) {
    return (
      <div className="h-screen content-center">
        <h1 className="text-4xl font-bold">
          Technical Foul! Player not found. 🫠
        </h1>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 pb-4 md:flex-row">
      <PlayerDetailsStatic player={player} />
      <PlayerStatsChart stats={player.stats ?? []} />
    </div>
  );
}
