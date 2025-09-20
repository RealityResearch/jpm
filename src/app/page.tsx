import { EarningsSection } from "@/components/EarningsSection";
import { RewardsTracker } from "@/components/RewardsTracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10 flex flex-col gap-12 items-center">
      <EarningsSection />
      <RewardsTracker />

      {/* Milestones placeholder */}
      <section className="w-full max-w-5xl border border-neutral-800 rounded-2xl p-10 text-neutral-400 text-center">
        <h2 className="text-xl font-semibold mb-2">Milestones</h2>
        <p className="text-sm">Coming soon…</p>
      </section>
    </main>
  );
}
