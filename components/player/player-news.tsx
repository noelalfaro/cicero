import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { fetchPlayerNews } from '@/lib/data/players';

export default async function PlayerNews({ playerId }: { playerId: number }) {
  const news = await fetchPlayerNews(playerId);

  return (
    <Card className="flex w-full flex-col justify-between md:col-span-4">
      <Carousel className="flex grow flex-col">
        <CardHeader className="flex w-full flex-row space-y-0 pb-3">
          <div className="flex h-full w-1/2 flex-col">
            <CardTitle className="text-2xl">NBA News</CardTitle>
            <CardDescription>Get the latest news on the NBA</CardDescription>
          </div>

          <div className="mt-0 flex grow items-center justify-end gap-2">
            <CarouselPrevious className="relative left-0 right-0 top-0 m-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative left-0 right-0 top-0 m-0 translate-x-0 translate-y-0" />
          </div>
        </CardHeader>

        <CardContent className="flex h-full flex-col justify-start">
          <CarouselContent className="h-full md:grow">
            {news.map((newsItem) => (
              <CarouselItem key={newsItem.id} className="grow-0">
                <div className="flex h-full flex-col justify-between md:grow">
                  <h3 className="text-xl font-bold">{newsItem.title}</h3>
                  <p className="pb-6 text-sm md:pb-0 lg:max-h-20 lg:grow lg:overflow-auto">
                    {newsItem.content}
                  </p>

                  <p className="text-left text-sm">
                    Source:{' '}
                    <a href="https://www.nba.com" className="underline">
                      NBA.com
                    </a>
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </CardContent>
      </Carousel>
      {/* <CardFooter> */}

      {/* </CardFooter> */}
    </Card>
  );
}
