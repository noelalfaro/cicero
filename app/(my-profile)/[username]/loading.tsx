import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@mui/material';

export default async function Loading() {
  return (
    <main className="flex w-full flex-col items-start justify-between gap-2">
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <Card className="flex w-full flex-col md:w-6/12 lg:w-4/12 xl:w-3/12">
          <CardHeader className="w-full gap-1 text-start">
            <div className="relative flex h-[250px] w-full max-w-[250px] self-center">
              {/* <Image
                src={user?.picture}
                
                alt={`${user?.username}.png`}
                fill={true}
                className="rounded-full object-cover"
              /> */}
            </div>

            {/* <div>
              <CardTitle>{user.display_name}</CardTitle>
              <div className="flex justify-start">
                <CardDescription>@{user.username}</CardDescription>
              </div>
            </div> */}
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>

            <CardDescription className="text-base text-current">
              This is an example bio
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full md:w-6/12 lg:w-8/12 xl:w-9/12">
          <CardHeader>
            <CardTitle>My Top Perfomers</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
