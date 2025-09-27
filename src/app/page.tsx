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
import Image from "next/image";
import MilestonesCarousel from "@/components/MilestonesCarousel";
import Chat from "@/components/Chat";

export default function HomePage() {
  const { data: rewards, loading: loadingRewards } = useRewards();
  const revenueUSD = rewards?.balanceUSD ?? 0;
  const revenueSOL = rewards?.balanceSOL ?? 0;

  const { holders, loading: loadingHolders } = useHolders();
  const {
    marketCapUSD,
    isLoading: loadingCap,
  } = useTokenMetrics();

  const { active, upcoming, completed, completedTotalUSD: expensesUSD } = useMilestones(revenueUSD);
  const profitUSD = Math.max(0, revenueUSD - expensesUSD);
  const ratio = revenueUSD > 0 ? revenueSOL / revenueUSD : 0;
  const expensesSOL = expensesUSD * ratio;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      {/* Contract address */}
      <header className="flex justify-center">
        <p className="text-xs text-neutral-400">CA: {process.env.NEXT_PUBLIC_JPM_MINT}</p>
      </header>

      {/* Financials header */}
      <h2 className="text-2xl text-neutral-700 mb-4 font-century underline">Financials</h2>

      {/* Top three cards */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <RevenueCard usd={revenueUSD} sol={revenueSOL} loading={loadingRewards} />
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
            loading={loadingRewards}
          />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6">
          <MetricCard label="Holders" primary={formatNumber(holders ?? 0)} loading={loadingHolders} />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <MetricCard label="Market Cap" primary={formatAbbrCurrency(marketCapUSD)} loading={loadingCap} />
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