"use client";

import TreasuryCard from "@/components/TreasuryCard";
import MetricCard from "@/components/MetricCard";
import Milestones from "@/components/Milestones";
import { useRewards } from "@/hooks/useRewards";
import { formatCurrency, formatNumber } from "@/lib/format";
import Image from "next/image";

export default function HomePage() {
  const { data, loading } = useRewards();

  const fees24hUsd = data?.fees24hUSD ?? 0;
  const fees24hSol = data?.fees24hSOL ?? 0;
  const trades24h = data?.trades24h ?? 0;
  const solPrice = data?.solPriceUSD ?? 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      {/* Logo placeholder */}
      <header className="flex justify-center">
  <Image
    src="/jpm-brown.png"
    alt="J.P. Moregain logo"
    width={192}       // pick the intrinsic pixel width of your file
    height={56}       // or set `priority` / `sizes` props as needed
  />
</header>

      {/* Treasury hero */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <TreasuryCard className="h-full" />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <MetricCard
            label="Fees (24h)"
            primary={formatCurrency(fees24hUsd)}
            secondary={`${formatNumber(fees24hSol)} SOL`}
            loading={loading}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <MetricCard
            label="Trades (24h)"
            primary={formatNumber(trades24h)}
            secondary="trades"
            loading={loading}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <MetricCard
            label="SOL Price"
            primary={formatCurrency(solPrice)}
            secondary="USD"
            loading={loading}
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
