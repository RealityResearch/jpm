"use client";
import { useEffect, useState } from "react";

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
    title: "100x DEX Boost",
    costUSD: 900,
    description: "Purchase boosts for visibility.",
  },
  {
    id: "top-10-holder-bonus",
    title: "Top 10 Holder Bonus",
    costUSD: 1000,
    description: "Distribute a bonus to the top 10 holders.",
  },
  {
    id: "aerial-banner",
    title: "Aerial Banner",
    costUSD: 2500,
    description: "Fly an aerial banner over NYC.",
  },
  {
    id: "poster-jp-offices",
    title: "Tape posters on J.P. Morgan Office in NY",
    costUSD: 4000,
    description: "Deploy guerrilla posters on the J.P. Morgan NYC office.",
  },
  {
    id: "times-square-billboard",
    title: "Times Square Billboard",
    costUSD: 5000,
    description: "Buy ad space on a Times Square billboard.",
  },
  {
    id: "aster-leverage",
    title: "Aster Leverage Account",
    costUSD: 10000,
    description: "Open a leverage account for high-risk, high-reward plays.",
  },
  {
    id: "jpm-god-candle",
    title: "JPM God Candle",
    costUSD: 25000,
    description: "Fuck it, jew mode.",
  },
  {
    id: "emergency-meeting",
    title: "EMERGENCY SHAREHOLDER MEETING",
    costUSD: 30000,
    description: "Call an emergency shareholder meeting.",
  },
  {
    id: "jpm-treasury",
    title: "JPM Treasury",
    costUSD: 40000,
    description: "Create a dedicated treasury for operational and strategic moves.",
  },
  {
    id: "lp-injection",
    title: "LP Injection",
    costUSD: 50000,
    description: "Inject fees into LP to stabilize and strengthen the market.",
  },
  {
    id: "strategic-acquisition",
    title: "JPM Strategic Acquisition Fund",
    costUSD: 100000,
    description: "Acquire other memecoins or assets under J.P. Moregain brand.",
  },
  {
    id: "jamie-dimon-interview",
    title: "INTERVIEW JAMIE DIMON HIMSELF",
    costUSD: 250000,
    description: "Secure an interview with Jamie Dimon himself.",
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
      // Show ALL remaining milestones as active - no limits
      setActive(remaining);
      setUpcoming([]);
    } else {
      // all milestones completed previously – show all completed milestones
      setActive([]);
      setUpcoming([]);
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
        // Remove the completed milestone from active list
        const [, ...rest] = a;
        return rest;
      });
    }
  }, [revenueUSD, active, completed]);

  const completedTotalUSD = completed.reduce((sum, m) => sum + m.costUSD, 0);

  return { active, upcoming, completed, completedTotalUSD } as const;
}
