import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const revalidate = 120;
export const runtime = "nodejs";

export async function GET() {
  try {
    const apiKey = process.env.MORALIS_API_KEY;
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet";
    const address = process.env.NEXT_PUBLIC_MINT_ADDRESS ?? env.mint;

    if (!apiKey || !network || !address) {
      return NextResponse.json(
        { error: "Missing MORALIS_API_KEY, NEXT_PUBLIC_SOLANA_NETWORK or NEXT_PUBLIC_MINT_ADDRESS" },
        { status: 500 }
      );
    }

    const base = "https://solana-gateway.moralis.io";
    const priceUrl = `${base}/token/${encodeURIComponent(network)}/${encodeURIComponent(address)}/price`;
    const metaUrl  = `${base}/token/${encodeURIComponent(network)}/${encodeURIComponent(address)}/metadata`;
    const headers = { "X-API-Key": apiKey, accept: "application/json" };

    const [priceRes, metaRes] = await Promise.all([
      fetch(priceUrl, { headers, next: { revalidate: 120 } }),
      fetch(metaUrl, { headers, next: { revalidate: 120 } }),
    ]);

    if (!priceRes.ok) {
      return NextResponse.json(
        { error: `Moralis price failed (${priceRes.status})` },
        { status: 502 }
      );
    }
    if (!metaRes.ok) {
      return NextResponse.json(
        { error: `Moralis metadata failed (${metaRes.status})` },
        { status: 502 }
      );
    }

    const price = await priceRes.json();
    const meta  = await metaRes.json();

    // Plan:
    // - Avoid using BigInt literals (e.g., 0n, 10n) for compatibility with lower than ES2020.
    // - Use BigInt constructor for all BigInt values.
    // - Ensure all calculations use BigInt, then convert to Number for totalSupply.
    const decimals = Number(meta.decimals ?? 0);
    const totalSupplyRaw = meta.totalSupply as string | undefined;
    const totalSupplyBig = totalSupplyRaw ? BigInt(totalSupplyRaw) : BigInt(0);
    const divisor = BigInt(10) ** BigInt(decimals);
    const totalSupply = Number(totalSupplyBig / divisor);

    const usdPrice = Number(price.usdPrice ?? 0);
    const marketCapUSD = Number.isFinite(totalSupply * usdPrice) ? totalSupply * usdPrice : 0;

    return NextResponse.json(
      {
        usdPrice,
        totalSupply,
        decimals,
        marketCapUsd: marketCapUSD,
        source: "moralis",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=120",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown", step: "unexpected" }, { status: 500 });
  }
}
