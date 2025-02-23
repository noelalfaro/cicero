import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { generateAiSummary } from '@/lib/data/players';

export default async function PlayerAiSummary({
  playerId,
}: {
  playerId: number;
}) {
  const summary = await generateAiSummary(playerId);

  return (
    <Card className="flex w-full flex-col justify-start md:col-span-4">
      <CardHeader className="min-h-[88px] pb-3">
        <CardTitle>PR Trend</CardTitle>
        <CardDescription className="h-full grow">
          AI Summary of what affected the score.
        </CardDescription>
      </CardHeader>
      <CardContent className="grow overflow-auto text-sm">
        {summary}
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm">
          Source:{' '}
          <a href="https://www.google.com" className="underline">
            AI-Model.com
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
