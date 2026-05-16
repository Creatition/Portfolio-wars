"use client";

import { cn } from "@/lib/cn";
import { Avatar } from "./Avatar";
import { MedalCluster } from "./Medal";
import { formatPct, formatUsd } from "@/lib/format";
import type { LeaderboardEntry } from "@pw/shared";
import Link from "next/link";
import { TIER_LABEL } from "./TierPeriodToggle";

export function LeaderboardTable({ snapshot }: {
  snapshot: {
    entries: LeaderboardEntry[];
    competition: { tier: "TEN_M" | "HUNDRED_M" };
  };
}) {
  return (
    <div className="bg-surface border border-rule rounded-sharp overflow-hidden">
      <div className="grid grid-cols-[60px_1fr_100px_180px_140px_110px] items-center px-6 py-3.5 border-b border-rule bg-canvas eyebrow">
        <div>Rank</div>
        <div>Alias</div>
        <div>Trades</div>
        <div>Holdings</div>
        <div className="text-right">Value</div>
        <div className="text-right">% Gain</div>
      </div>

      {snapshot.entries.map((entry) => (
        <Link
          key={entry.alias.name}
          href={`/alias/${encodeURIComponent(entry.alias.name)}`}
          className="grid grid-cols-[60px_1fr_100px_180px_140px_110px] items-center px-6 py-4 border-b border-rule last:border-0 hover:bg-elevated transition-colors"
        >
          <div className={cn(
            "font-mono font-semibold text-base tabular",
            entry.rank <= 3 ? "text-gold-bright" : "text-fg"
          )}>
            {String(entry.rank).padStart(2, "0")}
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={entry.alias.name} ring />
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate font-semibold text-[15px]">{entry.alias.name}</span>
                <MedalCluster
                  medals={entry.alias.medals.map(m => ({
                    place: m.place,
                    label: m.label,
                    shimmer: m.period === "YEARLY" && m.place === 1
                  }))}
                  size="md"
                />
              </div>
              <div className="text-[11px] font-mono text-fg-muted tracking-wide truncate">
                {entry.alias.xHandle ? (
                  <>
                    @{entry.alias.xHandle}
                    {entry.alias.xHandleVerified && <span className="text-gain ml-1">✓</span>}
                  </>
                ) : (
                  "anonymous"
                )}
                <span className="ml-2">· {TIER_LABEL[snapshot.competition.tier]}</span>
              </div>
            </div>
          </div>

          <div className="font-mono text-sm text-fg tabular">{entry.trades}</div>

          <div className="font-mono text-sm text-fg-muted truncate">
            {entry.topHoldings.join(" · ")}
          </div>

          <div className="text-right font-mono font-semibold text-[14px] tabular">
            {formatUsd(entry.valueUsd, { digits: 2 })}
          </div>

          <div className={cn(
            "text-right font-mono font-semibold text-sm tabular",
            entry.pctGain >= 0 ? "text-gain" : "text-loss"
          )}>
            {formatPct(entry.pctGain)}
          </div>
        </Link>
      ))}
    </div>
  );
}
