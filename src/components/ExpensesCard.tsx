"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { totalUSD: number; totalSOL: number; className?: string; loading?: boolean };
export default function ExpensesCard({ totalUSD, totalSOL, loading, className }: Props) {
  return (
    <Card className={cn("border-neutral-200 bg-white", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-neutral-600">Expenses</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-4xl font-semibold tracking-tight text-neutral-900">
          {loading ? "—" : formatCurrency(totalUSD)}
        </div>
        <div className="text-sm text-red-600">
          {loading ? "—" : `${formatNumber(totalSOL)} SOL`}
        </div>
      </CardContent>
    </Card>
  );
}
