import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { PlayerAverages } from '@/lib/definitions';

interface PlayerActionBarProps {
  averages: PlayerAverages | null | undefined;
}

const PlayerActionBar = ({ averages }: PlayerActionBarProps) => {
  return (
    <Card className="flex h-full w-full flex-col justify-between py-6 md:col-span-8 md:flex-row">
      <CardHeader className="w-full flex-row md:w-3/4">
        <CardTitle className="text-xl">PPG: {averages?.ppg}</CardTitle>
        <CardTitle className="text-xl">APG: {averages?.apg}</CardTitle>
        <CardTitle className="text-xl">RPG: {averages?.rpg}</CardTitle>
      </CardHeader>

      <CardContent className="flex w-full justify-end gap-4 md:w-1/4">
        <ThumbsUp />
        <ThumbsDown />
      </CardContent>
    </Card>
  );
};

export default PlayerActionBar;
