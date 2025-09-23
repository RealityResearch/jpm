"use client";
import { useEffect, useState, useCallback } from "react";

export type Milestone = {
  id: string;
  title: string;
  costUSD: number;
  description?: string;
};

const seed: Milestone[] = [
  {
    id: "dex-listing-fee",
    title: "Pay DEX",
    costUSD: 300,
    description: "Cover the initial listing cost for DEX.",
  },
  {
    id: "dex-boosts",
    title: "100x DEX Boosts",
    costUSD: 900,
    description: "Purchase boosts for visibility.",
  },
  {
    id: "times-square",
    title: "Times Square Billboard",
    costUSD: 1000,
    description: "Ad space in Times Square.",
  },
  {
    id: "aerial-banner",
    title: "Aerial Banner",
    costUSD: 1500,
    description: "NYC Aerial Banner.",
  },
  {
    id: "poster-jp-offices",
    title: "Tape posters on J.P. Morgan office",
    costUSD: 2500,
    description: "Tape posters on J.P. Morgan offices.",
  },
  {
    id: "top-10-holders-bonus",
    title: "Top 10 Holders Bonus",
    costUSD: 5000,
    description: "Bonus for top 10 holders.",
  },
];


const STORE_KEY = "jpm:completedMilestones";

export function useMilestones(revenueUSD: number) {
  const [active, setActive] = useState<Milestone[]>([]);
  const [upcoming, setUpcoming] = useState<Milestone[]>([]);
  const [completed, setCompleted] = useState<Milestone[]>([]);

  useEffect(() => {
    const doneIds: string[] = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    const completedSeed = seed.filter((m) => doneIds.includes(m.id));
    const remaining = seed.filter((m) => !doneIds.includes(m.id));
    setCompleted(completedSeed);
    if (remaining.length) {
      setActive(remaining.slice(0, 5));
      setUpcoming(remaining.slice(2));
    } else {
      // all milestones completed previously – show first two in completed as active for display
      setActive(completedSeed.slice(-2));
    }
  }, []);

  useEffect(() => {
    if (!active.length) return;
    const head = active[0];
    const profit = revenueUSD - completed.reduce((sum,m)=>sum+m.costUSD,0);
    const progress = (profit / head.costUSD) * 100;
    if (progress >= 100) {
      setCompleted((c) => {
        const next = [...c, head];
        localStorage.setItem(STORE_KEY, JSON.stringify(next.map((m) => m.id)));
        return next;
      });
      setActive((a) => {
        const [, ...rest] = a;
        const promoted = upcoming.slice(0, 1);
        setUpcoming((u) => u.slice(1));
        return [...rest, ...promoted];
      });
    } else if (active.length === 0 && upcoming.length) {
      // ensure at least one active for display
      setActive(upcoming.slice(0, 1));
      setUpcoming((u) => u.slice(1));
    }
  }, [revenueUSD, active, upcoming]);

  const completedTotalUSD = completed.reduce((sum, m) => sum + m.costUSD, 0);

  return { active, upcoming, completed, completedTotalUSD } as const;
}
