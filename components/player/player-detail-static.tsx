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
import * as Avatar from '@radix-ui/react-avatar'; // Import Radix Avatar

export function PlayerDetailsStatic({ player }: { player: Player }) {
  return (
    <Card className="bg-card text-card-foreground col-span-1 flex w-full flex-col items-center justify-start gap-0 rounded-xl border shadow-xs md:col-span-3 lg:col-span-2">
      <CardHeader className="flex w-full flex-col items-center justify-center gap-0 pb-0">
        <div className="relative flex h-[200px] w-[200px]">
          {player.picture ? (
            <Image
              src={player.picture}
              alt={`${player.first_name} ${player.last_name}`}
              fill={true}
              className="rounded-full object-cover"
              priority={true}
              draggable={false}
            />
          ) : (
            <Avatar.Root className="bg-muted relative flex h-[200px] w-[200px] overflow-hidden rounded-full">
              <Avatar.Fallback delayMs={600}>
                {player.first_name[0]}
                {player.last_name[0]}
              </Avatar.Fallback>
            </Avatar.Root>
          )}
        </div>
        <div className="flex w-full flex-col items-start">
          <CardTitle className="text-card-foreground dynamic-font-size leading-snug font-bold">
            {player.first_name} {player.last_name}
          </CardTitle>
          <CardDescription>
            {player.team_city} {player.team_name}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex w-full grow flex-col justify-center">
        <Button variant={'secondary'} className="hover:bg-secondary/80">
          Add to Watchlist
        </Button>
      </CardContent>
    </Card>
  );
}
