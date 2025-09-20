"use client";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRewards } from "@/hooks/useRewards";
import { cn } from "@/lib/utils";

export function RewardsTracker({ source = "mock" }: { source?: "mock" | "api" }) {
  const { data, isLoading, isError } = useRewards();

  if (isLoading) return <Skeleton className="h-16 w-full" />;
  if (isError || !data)
    return (
      <Card className="p-4 text-center">Failed to load rewards.</Card>
    );

  return (
    <Card className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-400">Treasury</p>
        <p className="font-semibold text-emerald-400">
          ${data.balanceUSD.toLocaleString()}
        </p>
      </div>
      <MiniSparkline values={data.sparklineSOL} />
    </Card>
  );
}

function MiniSparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${16 - (v / max) * 16}`)
    .join(" ");
  return (
    <svg width="80" height="16" viewBox="0 0 100 16" fill="none" strokeWidth="2">
      <polyline
        points={points}
        className="stroke-emerald-400"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
