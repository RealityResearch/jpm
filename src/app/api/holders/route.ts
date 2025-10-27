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

  // Use the holder-stats endpoint to get total holders count
  const base = "https://solana-gateway.moralis.io";
  const url = `${base}/token/mainnet/${mint}/holder-stats`;
  try {
    const res = await fetchJSON<{ totalHolders?: number; uniqueHolders?: number }>(
      url, 
      { headers: { "X-API-Key": env.moralisKey, accept: "application/json" }, cache: "no-store" },
      10000
    );
    
    // Try totalHolders first, fallback to uniqueHolders if available
    const holders = res.totalHolders ?? res.uniqueHolders ?? 0;
    
    console.log("[api/holders] Response:", { totalHolders: res.totalHolders, uniqueHolders: res.uniqueHolders, final: holders });
    
    return json(200, { holders });
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : (e as Error).message;
    console.error("[api/holders] Error:", msg);
    return json(502, { holders: 0, error: msg });
  }
}
