export const env = {
  creator: process.env.NEXT_PUBLIC_PUMP_CREATOR ?? "89zVoAsmmv4b2f2cHs9xTp7mZ88Ewi5Zx8fhs2LwkaBH",
  mint: process.env.NEXT_PUBLIC_JPM_MINT ?? "GNp2Vzrf5VfjA1vRF7MyzpcC3YfF8LEiJLY7rNsRpump",
  pumpBase: process.env.NEXT_PUBLIC_PUMP_BASE ?? "https://swap-api.pump.fun",
  interval: process.env.NEXT_PUBLIC_PUMP_INTERVAL ?? "30m",
  limit: Number(process.env.NEXT_PUBLIC_PUMP_LIMIT ?? "336"),
  jupPriceUrl:
    process.env.NEXT_PUBLIC_JUP_PRICE_URL ??
    "https://price.jup.ag/v6/price?ids=SOL",
  moralisKey: process.env.MORALIS_API_KEY ?? "",
  moralisPublicKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY ?? "",
} as const;