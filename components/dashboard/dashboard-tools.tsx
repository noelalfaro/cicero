import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardTools = () => {
  return (
    <Card className="col-span-1 row-span-1 flex h-full w-full flex-col items-center justify-start gap-2 md:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl">Your Top Performer</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default DashboardTools;
