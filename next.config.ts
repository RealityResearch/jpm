import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure environment variables are properly accessible
  env: {
    NEXT_PUBLIC_JPM_MINT: process.env.NEXT_PUBLIC_JPM_MINT,
    NEXT_PUBLIC_PUMP_CREATOR: process.env.NEXT_PUBLIC_PUMP_CREATOR,
    NEXT_PUBLIC_PUMP_BASE: process.env.NEXT_PUBLIC_PUMP_BASE,
    NEXT_PUBLIC_PUMP_INTERVAL: process.env.NEXT_PUBLIC_PUMP_INTERVAL,
    NEXT_PUBLIC_PUMP_LIMIT: process.env.NEXT_PUBLIC_PUMP_LIMIT,
    NEXT_PUBLIC_JUP_PRICE_URL: process.env.NEXT_PUBLIC_JUP_PRICE_URL,
    NEXT_PUBLIC_MORALIS_API_KEY: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
  },
};

export default nextConfig;
