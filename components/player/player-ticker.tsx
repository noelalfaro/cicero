'use client';

import React, { useState, useEffect } from 'react';
import { CardHeader } from '@/components/ui/card';
import NumberFlow from '@number-flow/react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { ComingSoonButton } from '@/components/coming-soon';

const PlayerTicker = ({ lastGamePrScore }: { lastGamePrScore: number }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(lastGamePrScore);
  }, [lastGamePrScore]);
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 md:gap-1">
      <CardHeader className="p-0 text-center text-8xl font-bold md:text-6xl">
        <NumberFlow continuous={true} value={score} />
        <div className="text-muted-foreground text-sm">Pulse Rating (PR)</div>
      </CardHeader>
      <ComingSoonButton
        className="w-full rounded-md text-lg md:h-10 md:text-base"
        size={'lg'}
      >
        Buy <ArrowUpIcon className="h-4 w-4" />
      </ComingSoonButton>
      <ComingSoonButton
        className="w-full rounded-md text-lg md:h-10 md:text-base"
        variant={'destructive'}
        size={'lg'}
      >
        Sell <ArrowDownIcon className="h-4 w-4" />
      </ComingSoonButton>
    </div>
  );
};

export default PlayerTicker;
