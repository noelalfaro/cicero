import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const Watchlist = async () => {
  return (
    <Card className="flex grow flex-col md:col-span-5 md:flex-row lg:col-span-6">
      <CardHeader className="text-3xl font-bold">My Portfolio</CardHeader>
    </Card>
  );
};

export default Watchlist;
