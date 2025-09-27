"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  revenueUSD: number;
  expensesUSD: number;
  revenueSOL: number;
  expensesSOL: number;
  loading?: boolean;
  className?: string;
};

export default function ProfitCard({ revenueUSD, expensesUSD, revenueSOL, expensesSOL, loading, className }: Props) {
  const profitUSD = Math.max(0, revenueUSD - expensesUSD);
  const profitSOL = Math.max(0, revenueSOL - expensesSOL);
  return (
    <Card className={cn("border-neutral-200 bg-white", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-neutral-600">Profit</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-4xl font-semibold tracking-tight text-neutral-900 font-amplitude">
          {loading ? "—" : formatCurrency(profitUSD)}
        </div>
        <div className="text-sm text-emerald-600 font-amplitude">
          {loading ? "—" : `${formatNumber(profitSOL)} SOL`}
        </div>
      </CardContent>
    </Card>
  );
}
