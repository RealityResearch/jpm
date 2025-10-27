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

  // Use the dedicated get-token-holder-stats endpoint
  // https://docs.moralis.com/web3-data-api/solana/reference/get-token-holder-stats
  const base = "https://solana-gateway.moralis.io";
  const network = "mainnet";
  const url = `${base}/token/${network}/holders/${mint}`;
  const headers: Record<string, string> = { "X-API-Key": env.moralisKey, "accept": "application/json" };
  
  try {
    const res = await fetchJSON<{ totalHolders?: number }>(
      url, 
      { headers, cache: "no-store" },
      15000
    );
    
    const holders = res.totalHolders ?? 0;
    
    console.log("[api/holders] Response:", {
      totalHolders: holders,
      hasTotalHolders: res.totalHolders !== undefined,
      responseKeys: Object.keys(res)
    });
    
    return json(200, { holders });
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : (e as Error).message;
    console.error("[api/holders] Error:", msg, e instanceof HttpError ? `Status: ${e.status}, Body: ${e.body?.slice(0, 200)}` : '');
    return json(502, { holders: 0, error: msg });
  }
}
