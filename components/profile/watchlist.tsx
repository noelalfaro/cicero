import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Watchlist = async () => {
  return (
    <Card className="flex grow flex-col md:col-span-5 lg:col-span-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">My Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Coming soon — holdings and watchlist will appear here once trading
          ships.
        </p>
      </CardContent>
    </Card>
  );
};

export default Watchlist;
