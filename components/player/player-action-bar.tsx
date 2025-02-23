import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const PlayerActionBar = async () => {
  return (
    <Card className="flex h-full w-full flex-col justify-between py-6 md:col-span-8 md:flex-row">
      <CardHeader className="w-full md:w-1/2">
        <CardTitle className="text-xl">Do You Agree?</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full justify-end gap-4 md:w-1/4">
        <ThumbsUp />
        <ThumbsDown />
      </CardContent>
    </Card>
  );
};

export default PlayerActionBar;
