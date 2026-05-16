import { Eyebrow } from "./Eyebrow";
import { ChampCard } from "./ChampCard";
import { formatUsd } from "@/lib/format";
import type { LeaderboardEntry } from "@pw/shared";

interface HomeHeroProps {
  weekLabel: string;
  activeCompetitors: number;
  medalsAwarded: number;
  plsUsd: number;
  championship: {
    title: string;
    endsAt: string;
    topThree: LeaderboardEntry[];
  };
}

export function HomeHero({
  weekLabel,
  activeCompetitors,
  medalsAwarded,
  plsUsd,
  championship
}: HomeHeroProps) {
  return (
    <section className="relative border-b border-rule py-14">
      <div className="absolute inset-0 pointer-events-none hero-glow" />
      <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-14 items-end">
        <div>
          <Eyebrow>Live · {weekLabel}</Eyebrow>
          <h1 className="font-display font-semibold text-fg leading-[0.95] tracking-tight my-4 text-[64px] sm:text-[84px]">
            Outperform.
            <br />
            <span className="text-gold italic">Get a medal.</span>
          </h1>
          <p className="text-fg-muted text-[17px] leading-relaxed max-w-[540px]">
            Real PulseChain wallets. Real PLS. Real bragging rights. Pick your league,
            get funded, and trade your way to the top of the weekly, monthly, and yearly
            leaderboards.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-9 max-w-[520px]">
            <Stat number={activeCompetitors.toLocaleString()} label="Active Competitors" />
            <Stat number={medalsAwarded.toLocaleString()} label="Medals Awarded" />
            <Stat number={formatUsd(plsUsd, { digits: 7 })} label="PLS · Live" />
          </div>
        </div>

        <ChampCard
          title={championship.title}
          endsAt={championship.endsAt}
          topThree={championship.topThree}
        />
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-l border-rule pl-4 py-1">
      <div className="font-mono text-[26px] font-semibold text-gold-bright tabular">{number}</div>
      <div className="text-fg-muted text-[11px] tracking-[0.16em] uppercase mt-1">{label}</div>
    </div>
  );
}
