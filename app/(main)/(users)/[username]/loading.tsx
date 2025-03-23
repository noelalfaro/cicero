import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default async function loading() {
  return (
    <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]">
      <Card className="bg-card text-card-foreground col-span-1 flex w-full flex-col items-center justify-start gap-0 rounded-xl border shadow-xs md:col-span-3 lg:col-span-2">
        <CardHeader className="flex w-full flex-col items-center justify-center gap-0 pb-0">
          <div className="relative flex h-[200px] w-[200px]"></div>

          <div className="flex w-full flex-col items-start">
            <CardTitle className="text-2xl"></CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex w-full grow flex-col justify-center"></CardContent>
      </Card>
      <Card className="flex grow flex-col md:col-span-5 md:flex-row lg:col-span-6">
        <CardHeader className="text-3xl font-bold"></CardHeader>
      </Card>
    </div>
  );
}
