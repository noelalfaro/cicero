import { ComingSoonButton } from '@/components/coming-soon';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ControlCenter() {
  return (
    <Card className="flex h-full flex-col items-center justify-start gap-2 md:col-span-8 md:flex-row">
      <CardHeader>
        <CardTitle className="text-xl">Control Center</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full w-full grow flex-col content-center items-center justify-end gap-2 md:w-fit md:flex-row md:p-0 md:px-6">
        <ComingSoonButton variant="secondary" className="w-full md:w-fit">
          Investment History
        </ComingSoonButton>
        <ComingSoonButton variant="secondary" className="w-full md:w-fit">
          Manage Balance
        </ComingSoonButton>
        <ComingSoonButton variant="secondary" className="w-full md:w-fit">
          Watchlist
        </ComingSoonButton>
      </CardContent>
    </Card>
  );
}
