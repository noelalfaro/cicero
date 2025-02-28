// app/players/[id]/PlayerDetailsStatic.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Player } from '@/lib/definitions';

export function PlayerDetailsStatic({ player }: { player: Player }) {
  return (
    <Card className="bg-card text-card-foreground col-span-1 flex w-full flex-col items-center justify-start gap-0 rounded-xl border shadow-xs md:col-span-3 lg:col-span-2">
      <CardHeader className="flex w-full flex-col items-center justify-center gap-0 pb-0">
        <div className="relative flex h-[200px] w-[200px]">
          <Image
            src={player.picture!}
            alt={`${player.first_name} ${player.last_name}`}
            sizes="(max-width: 768px) 100vw, 250px"
            fill={true}
            className="rounded-full object-cover"
            priority={true}
          />
        </div>
        <div className="flex w-full flex-col items-start">
          <CardTitle className="text-2xl">
            {player.first_name} {player.last_name}
          </CardTitle>
          <CardDescription>
            {player.team_city} {player.team_name}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex w-full grow flex-col justify-center">
        <Button variant={'secondary'}>Add to Watchlist</Button>
      </CardContent>
    </Card>
  );
}
