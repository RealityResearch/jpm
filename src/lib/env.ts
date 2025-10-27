export const env = {
  creator: process.env.NEXT_PUBLIC_PUMP_CREATOR ?? "Dq8vPWajStmA74PMCohJd11sTJUA3RfLjAv8YsH1xLXE",
  mint: process.env.NEXT_PUBLIC_JPM_MINT ?? "GkyPYa7NnCFbduLknCfBfP7p8564X1VZhwZYJ6CZpump",
  pumpBase: process.env.NEXT_PUBLIC_PUMP_BASE ?? "https://swap-api.pump.fun",
  interval: process.env.NEXT_PUBLIC_PUMP_INTERVAL ?? "30m",
  limit: Number(process.env.NEXT_PUBLIC_PUMP_LIMIT ?? "336"),
  jupPriceUrl:
    process.env.NEXT_PUBLIC_JUP_PRICE_URL ??
    "https://price.jup.ag/v6/price?ids=SOL",
  moralisKey: process.env.MORALIS_API_KEY ?? "",
  moralisPublicKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY ?? "",
} as const;