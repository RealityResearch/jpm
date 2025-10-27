"use client";

import RevenueCard from "@/components/RevenueCard";
import ExpensesCard from "@/components/ExpensesCard";
import ProfitCard from "@/components/ProfitCard";
import MetricCard from "@/components/MetricCard";
import { useRewards } from "@/hooks/useRewards";
import { useHolders } from "@/hooks/useHolders";
import { useTokenMetrics } from "@/hooks/useTokenMetrics";
import { useMilestones } from "@/hooks/useMilestones";
import { formatNumber, formatAbbrCurrency } from "@/lib/format";
import { env } from "@/lib/env";
import MilestonesCarousel from "@/components/MilestonesCarousel";
import Chat from "@/components/Chat";

export default function HomePage() {
  // Check if we have a valid CA (Contract Address)
  // Use runtime env var to ensure it's available in production
  const mint = process.env.NEXT_PUBLIC_JPM_MINT || env.mint || "";
  const hasValidCA = mint && mint.trim() !== "";
  
  const { data: rewards, loading: loadingRewards } = useRewards();
  const revenueUSD = hasValidCA ? (rewards?.balanceUSD ?? 0) : 0;
  const revenueSOL = hasValidCA ? (rewards?.balanceSOL ?? 0) : 0;

  const { holders, loading: loadingHolders } = useHolders();
  const {
    marketCapUSD,
    isLoading: loadingCap,
  } = useTokenMetrics();

  const { active, upcoming, completed, completedTotalUSD: expensesUSD } = useMilestones(revenueUSD);
  const profitUSD = hasValidCA ? Math.max(0, revenueUSD - expensesUSD) : 0;
  const ratio = revenueUSD > 0 ? revenueSOL / revenueUSD : 0;
  const expensesSOL = hasValidCA ? (expensesUSD * ratio) : 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      {/* Contract address */}
      <header className="flex justify-center">
        <p className="text-xs text-neutral-400">
          CA: {hasValidCA ? mint : "CA Incoming..."}
        </p>
      </header>

      {/* Financials header */}
      <h2 className="text-2xl text-neutral-700 mb-4 font-century underline">Financials</h2>

      {/* Top three cards */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <RevenueCard usd={revenueUSD} sol={revenueSOL} loading={hasValidCA ? loadingRewards : false} />
        </div>
        <div className="col-span-12 md:col-span-4">
          <ExpensesCard totalUSD={expensesUSD} totalSOL={expensesSOL} />
        </div>
        <div className="col-span-12 md:col-span-4">
          <ProfitCard
            revenueUSD={revenueUSD}
            expensesUSD={expensesUSD}
            revenueSOL={revenueSOL}
            expensesSOL={expensesSOL}
            loading={hasValidCA ? loadingRewards : false}
          />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6">
          <MetricCard 
            label="Holders" 
            primary={hasValidCA ? formatNumber(holders ?? 0) : "0"} 
            loading={hasValidCA ? loadingHolders : false} 
          />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <MetricCard 
            label="Market Cap" 
            primary={hasValidCA ? formatAbbrCurrency(marketCapUSD) : "$0"} 
            loading={hasValidCA ? loadingCap : false} 
          />
        </div>
      </div>

      <MilestonesCarousel
        active={active}
        upcoming={upcoming}
        completed={completed}
        profitUSD={profitUSD}
      />

      {/* Shareholder Meetings header */}
      <h2 className="text-2xl text-neutral-700 mb-4 font-century underline">Shareholder Meetings</h2>

      <Chat />
    </main>
  );
}