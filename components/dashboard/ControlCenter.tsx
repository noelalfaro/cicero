import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ControlCenter() {
  return (
    <>
      <Card className="flex h-full flex-col items-center justify-start gap-2 md:col-span-8 md:flex-row">
        <CardHeader>
          <CardTitle className="text-xl">Control Center</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full w-full grow flex-col content-center items-center justify-end gap-2 md:w-fit md:flex-row md:p-0 md:px-6">
          <Button variant={'secondary'} className="w-full md:w-fit">
            Investment History
          </Button>
          <Button variant={'secondary'} className="w-full md:w-fit">
            Manage Balance
          </Button>
          <Button variant={'secondary'} className="w-full md:w-fit">
            Watchlist
          </Button>
          {/* <Button variant={'secondary'}>UE</Button> */}
        </CardContent>
      </Card>
    </>
  );
}
