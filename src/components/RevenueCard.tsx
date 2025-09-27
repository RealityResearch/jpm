"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  usd: number;
  sol: number;
  loading?: boolean;
  error?: boolean;
  className?: string;
};

export default function RevenueCard({ usd, sol, loading, error, className }: Props) {
  return (
    <Card className={cn("border-neutral-200 bg-white", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-neutral-600">Revenue</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-4xl font-semibold tracking-tight text-neutral-900 font-amplitude">
          {loading ? "—" : formatCurrency(usd)}
        </div>
        <div className="text-sm text-emerald-600 font-amplitude">
          {loading ? "—" : `${formatNumber(sol)} SOL`}
        </div>
        {error ? (
          <p className="pt-2 text-xs text-red-600" role="alert">
            Failed to load revenue.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
