'use client';

import React, { useState, useEffect } from 'react';
import { CardHeader } from '@/components/ui/card';
import NumberFlow from '@number-flow/react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlayerTicker = ({ latestScore }: { latestScore: number }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(latestScore);
  }, [latestScore]);
  return (
    <div className="flex h-full w-full flex-grow flex-col items-center justify-center gap-3 px-2 md:w-1/4 md:gap-1">
      <CardHeader className="p-0 text-center text-8xl font-bold md:text-6xl">
        <NumberFlow continuous={true} value={score} />
        {/* {stats[latestGame].points} */}
        {/* <NumberFlow value={123} /> */}
        <div className="text-sm text-muted-foreground">Pulse Rating (PR)</div>
      </CardHeader>
      <Button className="w-full rounded-md">
        Buy <ArrowUpIcon className="ml-2 h-4 w-4" />
      </Button>
      <Button className="w-full rounded-md" variant={'destructive'}>
        Sell <ArrowDownIcon className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default PlayerTicker;
