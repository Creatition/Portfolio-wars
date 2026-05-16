"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { SectionHeader } from "./SectionHeader";
import { LeaderboardTable } from "./LeaderboardTable";
import { PeriodToggle, TierToggle, TIER_LABEL } from "./TierPeriodToggle";
import type { Period, Tier } from "@pw/shared";

export function HomeLeaderboard() {
  const [tier, setTier] = useState<Tier>("TEN_M");
  const [period, setPeriod] = useState<Period>("WEEKLY");

  const competitionsQ = trpc.listCompetitions.useQuery({ period });

  const competitionId = useMemo(() => {
    const list = competitionsQ.data ?? [];
    const match = list.find(c => c.tier === tier && c.period === period);
    return match?.id ?? null;
  }, [competitionsQ.data, tier, period]);

  const leaderboardQ = trpc.getLeaderboard.useQuery(
    { competitionId: competitionId ?? "" },
    { enabled: !!competitionId, refetchInterval: 8_000 }
  );

  const subtitle = useMemo(() => {
    if (period === "WEEKLY") return "This Week";
    if (period === "MONTHLY") return "This Month";
    return "This Year";
  }, [period]);

  return (
    <section className="py-16">
      <SectionHeader
        eyebrow="Live Leaderboard"
        title={`${subtitle} · ${TIER_LABEL[tier]}`}
        actions={
          <div className="flex items-center gap-3">
            <TierToggle value={tier} onChange={setTier} />
            <PeriodToggle value={period} onChange={setPeriod} />
          </div>
        }
      />

      {leaderboardQ.isLoading && (
        <div className="bg-surface border border-rule rounded-sharp p-12 text-center text-fg-muted">
          Loading leaderboard…
        </div>
      )}

      {leaderboardQ.data && <LeaderboardTable snapshot={leaderboardQ.data} />}

      {!leaderboardQ.isLoading && !leaderboardQ.data && (
        <div className="bg-surface border border-rule rounded-sharp p-12 text-center text-fg-muted">
          No competition is currently running in this category.
        </div>
      )}
    </section>
  );
}
