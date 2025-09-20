"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useRewards } from "@/hooks/useRewards";
import { formatCurrency, formatNumber } from "@/lib/format";

type Props = { className?: string };

export default function TreasuryCard({ className }: Props) {
  const { data, loading, error } = useRewards();

  const usd = data?.balanceUSD ?? 0;
  const sol = data?.balanceSOL ?? 0;

  return (
    <Card className={cn("border-neutral-200 bg-white", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-neutral-600">Treasury</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-4xl font-semibold tracking-tight text-neutral-900">
          {loading ? "—" : formatCurrency(usd)}
        </div>
        <div className="text-sm text-emerald-600">
          {loading ? "—" : `${formatNumber(sol)} SOL`}
        </div>
        {error ? (
          <p className="pt-2 text-xs text-red-600" role="alert">
            Failed to load treasury data.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
