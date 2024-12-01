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
import { Player } from '@/app/lib/definitions';

export function PlayerDetailsStatic({ player }: { player: Player }) {
  return (
    <Card className="flex max-h-fit w-full flex-col gap-1 rounded-xl border bg-card text-card-foreground shadow-sm md:w-[300px]">
      <CardHeader className="flex w-full flex-col pb-0 md:justify-center md:gap-1">
        <div className="relative flex h-[250px] w-full max-w-[250px] self-center">
          <Image
            src={player.picture!}
            alt={`${player.first_name} ${player.last_name}`}
            sizes="(max-width: 768px) 100vw, 250px"
            fill={true}
            className="rounded-full object-cover"
            priority={true}
          />
        </div>
        <div className="flex flex-col">
          <CardTitle>
            {player.first_name} {player.last_name}
          </CardTitle>
          <CardDescription>
            {player.team_city} {player.team_name}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <Button variant={'secondary'}>Add to Watchlist</Button>
      </CardContent>
    </Card>
  );
}
