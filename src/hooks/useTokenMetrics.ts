"use client";
import useSWR from "swr";

type TokenMetrics = {
  usdPrice: number;
  totalSupplyFormatted: number;
  marketCapUsd: number;
  fdvUsd: number;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as TokenMetrics;
};

export function useTokenMetrics() {
  const { data, error, isLoading, mutate } = useSWR<TokenMetrics>(
    "/api/token-metrics",
    fetcher,
    { refreshInterval: 120_000, revalidateOnFocus: false }
  );
  const marketCapUSD =
    data && typeof data.marketCapUsd === "number" && Number.isFinite(data.marketCapUsd)
      ? data.marketCapUsd
      : 0;
  return {
    data,
    marketCapUSD,
    error,
    isLoading,
    refresh: () => mutate(),
  } as const;
}
