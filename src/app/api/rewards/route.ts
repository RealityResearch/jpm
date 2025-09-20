// app/api/rewards/route.ts
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { fetchJSON, HttpError } from "@/lib/http";
import type { PumpFeeResponse, PumpFeeTotal } from "@/types/pump";

export const revalidate = 15; // ISR hint

function json(status: number, data: unknown) {
  const res = NextResponse.json(data, { status });
  if (status === 200) {
    res.headers.set("Cache-Control", "public, s-maxage=15, stale-while-revalidate=60");
  }
  return res;
}

export async function GET() {
  const meta: Record<string, unknown> = {};
  try {
    const { creator, mint, pumpBase, interval, limit, jupPriceUrl } = env;
    if (!creator && !mint) {
      return json(400, { error: "Set NEXT_PUBLIC_PUMP_CREATOR or NEXT_PUBLIC_JPM_MINT." });
    }

    const basePath = creator ? `/v1/creators/${creator}` : `/v1/coins/${mint}`;
    const feesUrl = `${pumpBase}${basePath}/fees?interval=${interval}&limit=${limit}`;
    const totalUrl = creator ? `${pumpBase}${basePath}/fees/total` : null;
    meta.feesUrl = feesUrl;
    if (totalUrl) meta.totalUrl = totalUrl;

    const coinMetaUrl = `${pumpBase}/v1/coins/${mint}`;
    meta.coinUrl = coinMetaUrl;

    const [feesRes, totalRes, priceRes, coinRes] = await Promise.allSettled([
      fetchJSON<PumpFeeResponse>(feesUrl, { cache: "no-store" }, 12000),
      totalUrl ? fetchJSON<PumpFeeTotal>(totalUrl, { cache: "no-store" }, 10000) : Promise.resolve(null),
      fetchJSON<{ data: { SOL: { price: number } } }>(jupPriceUrl, { cache: "no-store" }, 8000),
      fetchJSON<{ holders: number }>(coinMetaUrl, { cache: "no-store" }, 8000),
    ]);

    if (feesRes.status !== "fulfilled" || !Array.isArray(feesRes.value) || feesRes.value.length === 0) {
      return json(404, { error: "No fee buckets returned.", meta });
    }

    const fees = feesRes.value;
    const total = totalRes && totalRes.status === "fulfilled" ? totalRes.value : null;
    let solPriceUSD = priceRes.status === "fulfilled" ? Number(priceRes.value?.data?.SOL?.price ?? 0) : 0;
    if (!solPriceUSD) {
      try {
        const cg = await fetchJSON<{ solana: { usd: number } }>(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
          {},
          6000
        );
        solPriceUSD = cg.solana.usd ?? 0;
      } catch {}
    }

    const shareholders = coinRes.status === "fulfilled" ? coinRes.value?.holders ?? 0 : 0;

    const sparklineSOL = fees.map((b) => Number(b.cumulativeCreatorFeeSOL || 0));
    let balanceSOL = sparklineSOL.at(-1) ?? 0;

    const totalSOL = Number(total?.creatorFeeSOL ?? NaN);
    if (!Number.isNaN(totalSOL) && totalSOL >= 0) {
      balanceSOL = totalSOL;
    }

    const windowSize = interval === "30m" ? Math.min(48, fees.length) : Math.min(48, fees.length);
    const slice = fees.slice(-windowSize);
    const startCum = Number(slice.at(0)?.cumulativeCreatorFeeSOL ?? 0);
    const endCum = Number(slice.at(-1)?.cumulativeCreatorFeeSOL ?? 0);
    const fees24hSOL = Math.max(0, endCum - startCum);
    const trades24h = slice.reduce((acc, b) => acc + (b.numTrades ?? 0), 0);

    return json(200, {
      mode: creator ? "creator" : "mint",
      mint: mint || "(creator-mode)",
      solPriceUSD,
      balanceSOL,
      balanceUSD: balanceSOL * solPriceUSD,
      fees24hSOL,
      fees24hUSD: fees24hSOL * solPriceUSD,
      trades24h,
      shareholders,
      updatedAt: new Date().toISOString(),
      sparklineSOL,
      meta,
    });
  } catch (e) {
    const isHttp = e instanceof HttpError;
    console.error("[/api/rewards]", isHttp ? e.message : e, meta);
    return json(502, { error: (e as Error)?.message ?? "Upstream error", meta });
  }
}