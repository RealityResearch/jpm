"use client";
import MilestoneCard from "@/components/MilestoneCard";
import { Milestone } from "@/hooks/useMilestones";

type Props = {
  active: Milestone[];
  upcoming: Milestone[];
  completed: Milestone[];
  profitUSD: number;
};

export default function MilestonesCarousel({ active, upcoming, completed, profitUSD }: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl text-neutral-700 mb-4 font-century underline">OpEx</h2>
      
      {/* Active milestones - show ALL active milestones */}
      {active.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-600 font-amplitude-light">Active</h3>
          {active.map((m, idx) => {
            // Only the first milestone shows progress, others show 0 until it's their turn
            const pct = idx === 0 && m.costUSD > 0 ? Math.min(100, Math.max(0, (profitUSD / m.costUSD) * 100)) : 0;
            const progress = Number.isFinite(pct) ? pct : 0;
            return <MilestoneCard key={m.id} milestone={m} progress={progress} />;
          })}
        </div>
      )}

      {/* Completed milestones - show ALL completed milestones */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-600 mb-2 font-amplitude-light">Completed</h3>
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
