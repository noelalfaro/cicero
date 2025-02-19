import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const Watchlist = async () => {
  return (
    <Card className="flex flex-grow flex-col md:col-span-5 md:flex-row lg:col-span-6">
      <CardHeader>
        <CardTitle className="">My Portfolio</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default Watchlist;
