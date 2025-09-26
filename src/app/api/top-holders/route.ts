import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { fetchJSON, HttpError } from "@/lib/http";

export const revalidate = 120;
export const runtime = "nodejs";

export async function GET() {
  const { moralisKey, mint } = env;
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet";
  if (!moralisKey) return NextResponse.json({ error: "Missing MORALIS_API_KEY" }, { status: 500 });
  if (!mint) return NextResponse.json({ error: "Missing NEXT_PUBLIC_JPM_MINT" }, { status: 500 });

  const base = "https://solana-gateway.moralis.io";
  const headers = { "X-API-Key": moralisKey, accept: "application/json" };

  try {
    const [holdersRes, metaRes] = await Promise.all([
      fetchJSON<{ result: { ownerAddress: string; balanceFormatted: string; percentageRelativeToTotalSupply: number; usdValue: string }[]; total?: number; totalSupply: string }>(
        `${base}/token/${network}/${mint}/top-holders?limit=10`,
        { headers },
        8_000
      ),
      fetchJSON<{ decimals: number }>(
        `${base}/token/${network}/${mint}/metadata`,
        { headers },
        6_000
      ),
    ]);

    let totalSupply = Number(holdersRes.totalSupply ?? 0);
    if (!totalSupply && holdersRes.result.length && holdersRes.result[0].percentageRelativeToTotalSupply) {
      // derive supply from first holder
      const first = holdersRes.result[0];
      const bal = Number(first.balanceFormatted);
      const pct = first.percentageRelativeToTotalSupply;
      if (pct) totalSupply = Math.round((bal / pct) * 100);
    }
    if (!totalSupply) totalSupply = 0;

    const raw = holdersRes.result.slice(1, 11); // skip index 0 (LP), take next 10
    const holders = raw.map((h, idx) => {
      const balance = Number(h.balanceFormatted);
      const pct = h.percentageRelativeToTotalSupply;
      return { rank: idx + 1, address: h.ownerAddress, balance, pct, usd: Number(h.usdValue) };
    });

    const top10Balance = holders.reduce((acc, h) => acc + h.balance, 0);
    const topHolderPct = holders[0] ? holders[0].pct : 0;
    const top10Pct = totalSupply > 0 ? (top10Balance / totalSupply) * 100 : 0;
    const avgBal = holders.length ? top10Balance / holders.length : 0;
    const totalHolders = holdersRes.total ?? 0;

    return NextResponse.json({
      totalSupply,
      usdPrice: 0,
      holders,
      stats: {
        topHolderPct,
        top10Pct,
        avgBal,
        totalHolders,
      },
    }, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" },
    });
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : (e as Error).message;
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
