import { PlayerActionBarSkeleton } from '@/components/layout/skeletons';
import { PlayerAiSummarySkeleton } from '@/components/layout/skeletons';
import { PlayerDetailsStaticSkeleton } from '@/components/layout/skeletons';
import { PlayerNewsSkeleton } from '@/components/layout/skeletons';
import { PlayerStatsChartSkeleton } from '@/components/layout/skeletons';

// app/player/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="grid h-full w-full gap-2 md:max-h-max md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]">
      <PlayerDetailsStaticSkeleton />
      <PlayerStatsChartSkeleton />
      <PlayerActionBarSkeleton />
      <PlayerNewsSkeleton />
      <PlayerAiSummarySkeleton />
    </div>
  );
}
