import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

const PlayerAiSummary = () => {
  return (
    <Card className="flex w-full flex-col justify-between md:col-span-4">
      <CardHeader>
        <CardTitle>PR Trend</CardTitle>
        <CardDescription>
          AI Summary of what affected the score.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
        officiis soluta doloribus officia ipsam doloremque ullam molestias earum
        dolorem aut, laboriosam natus laborum. Facere, voluptatum? Corrupti
        consequuntur ea repellat eligendi.
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
};

export default PlayerAiSummary;
