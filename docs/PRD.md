Project Overview

J.P. Moregain is a parody financial institution memecoin built on Pump.fun.
The website should serve as:
	1.	A live treasury tracker (creator rewards).
	2.	A corporate-style parody dashboard (earnings, milestones).
	3.	A community governance hub (shareholder voting & proposals).

Tone: Corporate parody — clean, minimal, institutional look, with tongue-in-cheek commentary.
Stack: Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui.

⸻

Core Features

1. Live Treasury Tracker
	•	Data Source: Pump.fun API
	•	Endpoint: https://swap-api.pump.fun/v1/creators/<MINT>/fees?interval=30m&limit=336
	•	SOL Price: https://price.jup.ag/v4/price?ids=SOL
	•	Displayed Values:
	•	Total Treasury Balance (USD + SOL)
	•	24h Fees (USD + SOL)
	•	24h Trades (count)
	•	Last updated timestamp
	•	Sparkline of cumulative fees over time
	•	UI:
	•	EarningsSection (corporate report-style KPI cards)
	•	RewardsTracker (compact widget, smaller version of above)

⸻

2. Milestones & Goals
	•	Data: Static config (data/goals.ts)
	•	Each goal has id, title, usdTarget, blurb.
	•	UI:
	•	Progress bars showing % toward each goal.
	•	List of goals (e.g. $300 = DEXScreener, $2,500 = Billboard).
	•	Logic:
	•	Progress = treasury balance / usdTarget.
	•	Cap at 100%.

⸻

3. Shareholder Governance (Phase 2)
	•	MVP: External voting links (Twitter, Discord, Pump.fun).
	•	Future: On-chain governance integration.
	•	UI:
	•	“Shareholder Proposals” section.
	•	Each proposal = card with description, voting link, status.

⸻

4. Corporate Branding
	•	Aesthetic: Minimal corporate parody
	•	Background: bg-neutral-950
	•	Borders: border-neutral-800
	•	Text: text-neutral-100 / 400 / 500
	•	Accents: emerald (gains), red (losses), sky (info)
	•	Fonts: System default; lean corporate.
	•	Logos & Media Assets:
	•	Metallic “J.P. Moregain” logo (parody of JPMorgan).
	•	Images of buildings, conferences, etc.

⸻

Tech Requirements
	•	Next.js App Router project (app/ directory).
	•	TypeScript strict mode.
	•	TailwindCSS with tailwindcss-animate.
	•	shadcn/ui for UI primitives (Button, Card, Progress, Dialog, Tabs).
	•	lucide-react for icons.
	•	API route:
	•	/api/rewards → returns normalized data object:
    {
  "mint": "...",
  "solPriceUSD": 245.12,
  "balanceSOL": 679.59,
  "balanceUSD": 166735.2,
  "fees24hSOL": 12.3,
  "fees24hUSD": 3012.2,
  "trades24h": 492,
  "updatedAt": "2025-09-20T16:00:00Z",
  "sparklineSOL": [0, 2, 5, 10, ...]
}
	•	Env var: NEXT_PUBLIC_JPM_MINT (defaults to test mint if missing).

Deliverables
	1.	API Layer
	•	/api/rewards proxy route (SOL balance, USD value, 24h metrics).
	•	Cache: 15s revalidate.
	2.	Components
	•	EarningsSection.tsx → Corporate parody KPI dashboard.
	•	RewardsTracker.tsx → Compact live tracker widget.
	•	Goals.tsx → Milestones progress bars.
	•	Proposals.tsx (future) → Voting cards.
	3.	Pages
	•	/ (homepage):
	•	Hero = EarningsSection
	•	Treasury widget (RewardsTracker)
	•	Milestones (Goals)
	•	Proposals (placeholder Phase 2)
	4.	Docs
	•	docs/PRD.md (this file).
	•	README.md with setup instructions.

⸻

Milestone Plan
	•	M1 — Treasury Live Tracker (MVP)
API + EarningsSection + RewardsTracker live with test mint.
	•	M2 — Milestones
Goals progress bars wired to treasury.
	•	M3 — Governance MVP
Proposal cards linking to X/Discord polls.
	•	M4 — Media Assets
Branded parody visuals integrated into site.
	•	M5 — Deployment
Vercel + custom domain.