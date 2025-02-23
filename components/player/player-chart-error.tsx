import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function PlayerChartError() {
  return (
    <Card className="col-span-1 flex h-full grow flex-col items-center justify-center md:col-span-5 lg:col-span-6">
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          There was a problem loading the player's stats.
        </p>
      </CardContent>
    </Card>
  );
}

export default PlayerChartError;
