import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardTools = () => {
  return (
    <Card className="grid h-full grid-cols-3 grid-rows-4 gap-2 lg:col-span-3 lg:row-span-4 xl:row-span-5">
      {/* <CardHeader></CardHeader> */}
      {/* <div className="grid grid-cols-2 grid-rows-2 gap-2"> */}
      {/* <Button className="col-span-1 row-span-1 p-8">IH</Button>
      <Button className="col-span-1 row-span-1 p-8">M</Button>
      <Button className="col-span-1 row-span-1 p-8">W</Button>
      <Button className="col-span-1 row-span-1 p-8">UE</Button> */}
      {/* </div> */}
    </Card>
  );
};

export default DashboardTools;
