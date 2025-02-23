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

const NbaNews = () => {
  return (
    <Card className="mb-3">
      <Carousel>
        <CardHeader className="flex w-full flex-row">
          <div className="flex w-1/2 flex-col">
            <CardTitle className="text-2xl">NBA News</CardTitle>
            <CardDescription>Get the latest news on the NBA</CardDescription>
          </div>

          <div className="flex grow items-center justify-end gap-2">
            <CarouselPrevious className="relative left-0 right-0 top-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative left-0 right-0 top-0 translate-x-0 translate-y-0" />
          </div>
        </CardHeader>

        <CardContent>
          <CarouselContent>
            <CarouselItem>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">NBA Finals</h3>
                <p>
                  The NBA Finals are set to begin on July 8th, 2022. The
                  Milwaukee Bucks are the defending champions.
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">NBA Draft</h3>
                <p>
                  The 2022 NBA Draft is set to take place on July 29th, 2022.
                  The Detroit Pistons have the first overall pick.
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">NBA All-Star Game</h3>
                <p>
                  The 2022 NBA All-Star Game will be held in Salt Lake City,
                  Utah on February 20th, 2022.
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
        </CardContent>
      </Carousel>
      <CardFooter>
        <p className="text-center text-sm">
          Source:{' '}
          <a href="https://www.nba.com" className="underline">
            NBA.com
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default NbaNews;
