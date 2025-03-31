// app/(main)/players/[id]/loading.tsx
import {
  PlayerDetailsStaticSkeleton,
  PlayerStatsChartSkeleton,
  PlayerNewsSkeleton,
  PlayerActionBarSkeleton,
  PlayerAiSummarySkeleton,
} from '@/components/layout/skeletons';

// This component's UI will be shown automatically by Next.js
// while the corresponding page.tsx is loading its data.
export default function Loading() {
  return (
    <div className="flex h-fit w-full flex-col gap-2 md:grid md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]">
      {/* Place the skeletons in the same grid positions as their corresponding components */}
      <PlayerDetailsStaticSkeleton />
      <PlayerStatsChartSkeleton />
      <PlayerActionBarSkeleton />
      <PlayerNewsSkeleton />
      <PlayerAiSummarySkeleton />
    </div>
  );
}
