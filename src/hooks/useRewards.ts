"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Rewards } from "@/types/rewards";

const POLL_MS = 15_000;

type ApiResult =
  | { ok: true; data: Rewards }
  | { ok: false; status: number; message: string };

export function useRewards() {
  const [data, setData] = useState<Rewards | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOnce = useCallback(async (signal?: AbortSignal): Promise<ApiResult> => {
    try {
      const res = await fetch("/api/rewards", {
        cache: "no-store",
        headers: { accept: "application/json" },
        signal,
      });
      const text = await res.text();
      const parse = () => {
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      };
      if (!res.ok) {
        const body = parse();
        const message = body?.error || body?.message || `HTTP ${res.status}`;
        return { ok: false, status: res.status, message };
      }
      const json = parse() as Rewards | null;
      if (!json) return { ok: false, status: 200, message: "Invalid JSON" };
      return { ok: true, data: json };
    } catch (e: unknown) {
      if ((e as DOMException).name === "AbortError") {
        return { ok: false, status: 499, message: "Aborted" };
      }
      const msg = (e as Error).message || "Network error";
      return { ok: false, status: 0, message: msg };
    }
  }, []);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setError(null);
      const res = await fetchOnce(signal);
      if (res.ok) setData(res.data);
      else setError(res.message);
      if (!signal?.aborted) setLoading(false);
    },
    [fetchOnce]
  );

  useEffect(() => {
    let alive = true;
    const c = new AbortController();
    load(c.signal);
    pollRef.current = setInterval(() => {
      if (!alive) return;
      const i = new AbortController();
      load(i.signal);
    }, POLL_MS);
    return () => {
      alive = false;
      c.abort();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [load]);

  const refresh = useCallback(async () => {
    const c = new AbortController();
    await load(c.signal);
    c.abort();
  }, [load]);

  return { data, error, loading, refresh } as const;
}