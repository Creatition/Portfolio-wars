import { Eyebrow } from "@/components/Eyebrow";
import { Panel } from "@/components/Panel";
import { Medal } from "@/components/Medal";

// Mock past champions for the hall — replace with real settlement data in v1.
const PAST = [
  { period: "Week 19 · 2026", tier: "100M PLS", gold: "silentdegen.pls", silver: "moneyprintergobrrr", bronze: "hexagon",  pct: 488.2 },
  { period: "Week 19 · 2026", tier: "10M PLS",  gold: "nightowl_v3",     silver: "scalewithme",         bronze: "basement.degen", pct: 432.7 },
  { period: "Week 18 · 2026", tier: "100M PLS", gold: "silentdegen.pls", silver: "alphawitch",          bronze: "hexagon",  pct: 327.4 },
  { period: "Week 18 · 2026", tier: "10M PLS",  gold: "mainnetking",     silver: "nightowl_v3",         bronze: "kublai",   pct: 254.8 },
  { period: "Apr 2026",        tier: "100M PLS", gold: "silentdegen.pls", silver: "heartcore",           bronze: "mainnetking", pct: 1118.4 },
  { period: "Apr 2026",        tier: "10M PLS",  gold: "nightowl_v3",     silver: "basement.degen",      bronze: "scalewithme", pct: 891.2 }
];

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-7 py-14">
      <Eyebrow>History · Champions Hall</Eyebrow>
      <h1 className="font-display text-[64px] font-semibold leading-none mt-3 mb-3">Hall of Champions</h1>
      <p className="text-fg-muted max-w-2xl">
        Every completed competition. Filterable by period and tier in v1. For now, here's a snapshot
        of recent settlements.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {PAST.map((p, idx) => (
          <Panel key={idx}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <Eyebrow>{p.period}</Eyebrow>
                <p className="mt-1 font-display text-[22px] font-semibold">{p.tier}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-gain text-sm tabular">+{p.pct.toFixed(1)}%</p>
                <p className="text-[11px] text-fg-muted">Winning return</p>
              </div>
            </div>
            <Row place={1} alias={p.gold} />
            <Row place={2} alias={p.silver} />
            <Row place={3} alias={p.bronze} />
          </Panel>
        ))}
      </div>
    </div>
  );
}

function Row({ place, alias }: { place: 1 | 2 | 3; alias: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-rule last:border-0">
      <Medal place={place} size="lg" />
      <span className="font-semibold">{alias}</span>
    </div>
  );
}
