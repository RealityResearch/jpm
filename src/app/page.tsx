"use client";

import Image from "next/image";
import TreasuryCard from "@/components/TreasuryCard";
import MetricCard from "@/components/MetricCard";
import Milestones from "@/components/Milestones";
import { useRewards } from "@/hooks/useRewards";
import { useHolders } from "@/hooks/useHolders";
import { useTokenMetrics } from "@/hooks/useTokenMetrics";
import { formatNumber, formatAbbrCurrency } from "@/lib/format";

export default function HomePage() {
  // Rewards (if you still need them elsewhere)
  const { data: rewards, loading: loadingRewards } = useRewards();

  // Holders
  const { holders, loading: loadingHolders } = useHolders();

  // Market cap / token price (from Moralis-backed hook)
  const {
    data: tokenMetrics,
    error: metricsError,
    isLoading: loadingMetrics,
  } = useTokenMetrics();

  const marketCapUSD = tokenMetrics?.marketCapUsd ?? 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      {/* Top-center logo */}
      <header className="flex justify-center">
        <Image
          src="/jpm-brown.png"
          alt="J.P. Moregain logo"
          width={192}
          height={56}
          priority
        />
      </header>

      {/* Treasury hero (center, large) */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <TreasuryCard className="h-full" />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Shareholders */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <MetricCard
            label="Shareholders"
            primary={formatNumber(holders ?? 0)}
            loading={loadingHolders}
          />
        </div>

        {/* Market Cap */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <MetricCard
            label="Market Cap"
            primary={formatAbbrCurrency(marketCapUSD)}
            loading={loadingMetrics}
            // Optionally show an error state:
            // error={metricsError ? "Failed to load market cap" : undefined}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <Milestones />
        </div>
      </div>
    </main>
  );
}