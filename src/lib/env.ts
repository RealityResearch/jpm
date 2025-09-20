export const env = {
  creator: process.env.NEXT_PUBLIC_PUMP_CREATOR ?? "",
  mint:
    process.env.NEXT_PUBLIC_JPM_MINT ??
    "5wVtfsFhLjxm27K9mN3ziYWCCpQwXXq7HWUiRMW7pump",
  pumpBase: process.env.NEXT_PUBLIC_PUMP_BASE ?? "https://swap-api.pump.fun",
  interval: process.env.NEXT_PUBLIC_PUMP_INTERVAL ?? "30m",
  limit: Number(process.env.NEXT_PUBLIC_PUMP_LIMIT ?? "336"),
  jupPriceUrl:
    process.env.NEXT_PUBLIC_JUP_PRICE_URL ??
    "https://price.jup.ag/v6/price?ids=SOL",
  moralisKey: process.env.MORALIS_API_KEY ?? "",
  moralisPublicKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY ?? "",
} as const;