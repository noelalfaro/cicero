import { PlayerActionBarSkeleton } from '@/components/skeletons';
import { PlayerAiSummarySkeleton } from '@/components/skeletons';
import { PlayerDetailsStaticSkeleton } from '@/components/skeletons';
import { PlayerNewsSkeleton } from '@/components/skeletons';
import { PlayerStatsChartSkeleton } from '@/components/skeletons';

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
