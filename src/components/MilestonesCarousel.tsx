"use client";
import { useRef } from "react";
import MilestoneCard from "@/components/MilestoneCard";
import { Milestone } from "@/hooks/useMilestones";

type Props = {
  active: Milestone[];
  upcoming: Milestone[];
  completed: Milestone[];
  profitUSD: number;
};

export default function MilestonesCarousel({ active, upcoming, completed, profitUSD }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const delta = dir === "left" ? -300 : 300;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-700">OpEx</h2>
      {/* Active */}
      {active.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-600">Active</h3>
          {active.filter(a=>!completed.some(c=>c.id===a.id)).map((m, idx) => {
            const pct = idx === 0 && m.costUSD > 0 ? Math.min(100, Math.max(0, (profitUSD / m.costUSD) * 100)) : 0;
            const progress = Number.isFinite(pct) ? pct : 0;
            return <MilestoneCard key={m.id} milestone={m} progress={progress} />;
          })}
        </div>
      )}

      {/* completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-600 mb-2">Completed</h3>
          <div className="space-y-4">
            {completed.map((m) => (
              <MilestoneCard key={m.id} milestone={m} progress={100} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
