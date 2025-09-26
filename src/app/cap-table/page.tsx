"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import useSWR from "swr";
import { formatAbbrCurrency, formatCurrency, formatNumber } from "@/lib/format";

type Holder = {
  rank: number;
  address: string;
  balance: number;
  pct: number;
  usd: number;
};

type ApiResp = {
  totalSupply: number;
  usdPrice: number;
  holders: Holder[];
  stats: {
    topHolderPct: number;
    top10Pct: number;
    avgBal: number;
    totalHolders: number;
  };
};

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json());

export default function CapTablePage() {
  const { data, isLoading, error } = useSWR<ApiResp>("/api/top-holders", fetcher, {
    refreshInterval: 120_000,
    revalidateOnFocus: false,
  });

  const s = data?.stats;
  const statCards = [
    {
      label: "Top Holder %",
      value: s ? `${s.topHolderPct.toFixed(2)}%` : null,
    },
    {
      label: "Top 10 %",
      value: s ? `${s.top10Pct.toFixed(2)}%` : null,
    },
    {
      label: "Avg Balance",
      value: s ? formatNumber(s.avgBal) : null,
    },
    {
      label: "Total Supply",
      value: data ? formatNumber(data.totalSupply) : null,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6 space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Cap Table</h1>
        <p className="text-sm text-neutral-500">
          Top 10 holders and distribution metrics
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-12 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="col-span-6 md:col-span-3">
            <Card className="border-neutral-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-neutral-600 text-sm font-medium">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {s.value ? (
                  <div className="text-lg font-semibold tracking-tight text-neutral-900">
                    {s.value}
                  </div>
                ) : (
                  <Skeleton className="h-6 w-24" />
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card className="border-neutral-200 bg-white">
        <CardHeader>
          <CardTitle className="text-neutral-700 text-base">Top Holders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-neutral-600 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Rank</th>
                <th className="px-4 py-2 text-left font-medium">Address</th>
                <th className="px-4 py-2 text-right font-medium">Balance</th>
                <th className="px-4 py-2 text-right font-medium">USD</th>
                <th className="px-4 py-2 text-right font-medium">% Supply</th>
              </tr>
            </thead>
            <tbody>
              {(data?.holders ?? Array.from({ length: 10 })).map((row: any, idx: number) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="px-4 py-2">
                    {data ? idx + 1 : <Skeleton className="h-4 w-6" />}
                  </td>
                  <td className="px-4 py-2 max-w-[200px] break-all">
                    {data && row?.address ? (
                      <a
                        href={`https://solscan.io/account/${row.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        {row.address.slice(0, 4)}…{row.address.slice(-4)}
                      </a>
                    ) : (
                      <Skeleton className="h-4 w-40" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {data && row?.balance !== undefined ? (
                      formatNumber(row.balance)
                    ) : (
                      <Skeleton className="h-4 w-16 ml-auto" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {data && row?.usd !== undefined ? (
                      formatAbbrCurrency(row.usd)
                    ) : (
                      <Skeleton className="h-4 w-16 ml-auto" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {data && row?.pct !== undefined ? (
                      `${row.pct.toFixed(2)}%`
                    ) : (
                      <Skeleton className="h-4 w-12 ml-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && <p className="text-red-600 text-sm mt-2">Failed to load cap table.</p>}
        </CardContent>
      </Card>
    </main>
  );
}
