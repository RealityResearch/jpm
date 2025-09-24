"use client";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRewards } from "@/hooks/useRewards";
import { cn } from "@/lib/utils";

export function EarningsSection({ source = "mock" }: { source?: "mock" | "api" }) {
  const { data, loading, error } = useRewards();

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-6 text-center">
        <p className="mb-4 text-neutral-400">Failed to load metrics.</p>
        <button
          className="rounded-md bg-neutral-800 px-3 py-2 text-sm hover:bg-neutral-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </Card>
    );
  }

  const metrics = [
    {
      label: "Treasury Balance",
      primary: `$${data.balanceUSD.toLocaleString()}`,
      secondary: `${data.balanceSOL.toFixed(2)} SOL`,
      accent: "emerald",
    },
    {
      label: "Fees (24h)",
      primary: `$${data.fees24hUSD.toLocaleString()}`,
      secondary: `${data.fees24hSOL.toFixed(2)} SOL`,
      accent: "emerald",
    },
    {
      label: "Trades (24h)",
      primary: data.trades24h.toLocaleString(),
      secondary: "trades",
      accent: "sky",
    },
    {
      label: "SOL Price",
      primary: `$${data.solPriceUSD.toFixed(2)}`,
      secondary: "USD",
      accent: "sky",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} accent={m.accent as "emerald" | "sky" | "red"} sparkline={data.sparklineSOL} />
      ))}
    </div>
  );
}

function MetricCard({
  label,
  primary,
  secondary,
  accent,
  sparkline,
}: {
  label: string;
  primary: string;
  secondary: string;
  accent: "emerald" | "red" | "sky";
  sparkline: number[];
}) {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-neutral-400">{label}</h3>
          <p
            className={cn(
              "text-xl font-semibold aria-live=polite",
              accent === "emerald" && "text-emerald-400",
              accent === "sky" && "text-sky-400",
              accent === "red" && "text-red-400"
            )}
          >
            {primary}
          </p>
          <p className="text-xs text-neutral-500">{secondary}</p>
        </div>
        <Sparkline values={sparkline} accent={accent} />
      </div>
    </Card>
  );
}

function Sparkline({ values, accent }: { values: number[]; accent: string }) {
  const max = Math.max(...values);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 24 - (v / max) * 24;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width="100"
      height="24"
      viewBox="0 0 100 24"
      fill="none"
      strokeWidth="2"
      className="hidden sm:block"
    >
      <polyline
        points={points}
        className={cn(
          accent === "emerald" && "stroke-emerald-400",
          accent === "sky" && "stroke-sky-400",
          accent === "red" && "stroke-red-400"
        )}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
