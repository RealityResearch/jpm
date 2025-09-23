"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Milestone } from "@/hooks/useMilestones";
import { formatCurrency } from "@/lib/format";

type Props = { milestone: Milestone; progress: number };
export default function MilestoneCard({ milestone, progress }: Props) {
  return (
    <Card className="w-full flex-none snap-center border-neutral-200 bg-white flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-neutral-800 text-base font-medium">
          {milestone.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-neutral-500">Cost: {formatCurrency(milestone.costUSD)}</p>
        <Progress value={progress} />
        <p className="text-xs text-neutral-400">{Math.round(progress)}% funded</p>
      </CardContent>
    </Card>
  );
}
