import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { fetchJSON, HttpError } from "@/lib/http";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function json(status: number, data: unknown) {
  const res = NextResponse.json(data, { status });
  if (status === 200) {
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=120, stale-while-revalidate=60"
    );
  }
  return res;
}

export async function GET() {
  const mint = env.mint;
  if (!mint) return json(400, { holders: 0, error: "Missing NEXT_PUBLIC_JPM_MINT" });
  if (!env.moralisKey) return json(400, { holders: 0, error: "Missing MORALIS_API_KEY" });

  // Use the top-holders endpoint to get total holders count
  const url = `https://solana-gateway.moralis.io/token/mainnet/${mint}/top-holders?limit=1`;
  try {
    const res = await fetchJSON<{ total?: number; result?: unknown[] }>(url, {
      headers: { "X-API-Key": env.moralisKey, accept: "application/json" },
      cache: "no-store",
    }, 10000);
    
    // Total holders is in the total field
    const holders = res.total ?? 0;
    return json(200, { holders });
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : (e as Error).message;
    console.error("[api/holders] Error:", msg);
    return json(502, { holders: 0, error: msg });
  }
}
