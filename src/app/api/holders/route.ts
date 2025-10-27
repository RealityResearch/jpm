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

  // Use the top-holders endpoint to get total holders count (same as cap-table uses)
  const base = "https://solana-gateway.moralis.io";
  const network = "mainnet";
  // Use limit=10 to ensure we get the total field (same as top-holders route)
  const url = `${base}/token/${network}/${mint}/top-holders?limit=10`;
  const headers = { "X-API-Key": env.moralisKey, accept: "application/json" };
  
  try {
    const res = await fetchJSON<{ total?: number; result?: unknown[]; totalSupply?: string }>(
      url, 
      { headers, cache: "no-store" },
      10000
    );
    
    // The total field contains the total number of holders
    const holders = res.total ?? 0;
    
    // Log response structure for debugging
    console.log("[api/holders] Response received:", {
      hasTotal: res.total !== undefined,
      totalValue: res.total,
      hasResult: Array.isArray(res.result),
      resultLength: res.result?.length ?? 0,
      responseKeys: Object.keys(res)
    });
    
    // If total is undefined or 0, log a warning
    if (!holders) {
      console.warn("[api/holders] No holders found or total field missing. Response:", JSON.stringify(res).slice(0, 200));
    }
    
    return json(200, { holders });
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : (e as Error).message;
    console.error("[api/holders] Error:", msg, e instanceof HttpError ? `Status: ${e.status}, Body: ${e.body?.slice(0, 200)}` : '');
    return json(502, { holders: 0, error: msg });
  }
}
