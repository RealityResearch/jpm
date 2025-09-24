"use client";

import { useCallback, useEffect, useState, useRef } from "react";

export function useHolders() {
  const [holders, setHolders] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastRef = useRef(0);

  const fetchData = useCallback(async () => {
    const now = Date.now();
    if (now - lastRef.current < 120_000) return; // throttle 2 min

    lastRef.current = now;
    setUpdating(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/holders", { cache: "no-store" });
      const json = await res.json();
      setHolders(json.holders ?? 0);
      if (!res.ok) setError(json.error ?? "Error");
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 120_000);
    return () => clearInterval(id);
  }, [fetchData]);

  return { holders, loading, updating, error, refresh: fetchData } as const;
}
