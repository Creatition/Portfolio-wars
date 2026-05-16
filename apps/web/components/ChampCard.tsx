import { Avatar } from "./Avatar";
import { formatCountdown, formatPct, formatUsd } from "@/lib/format";
import type { LeaderboardEntry } from "@pw/shared";

const ROMAN = ["I", "II", "III"];

export function ChampCard({
  title,
  endsAt,
  topThree
}: {
  title: string;
  endsAt: string;
  topThree: LeaderboardEntry[];
}) {
  return (
    <div className="relative border border-gold rounded-sharp p-7 bg-gradient-to-br from-surface to-elevated shadow-champ">
      {/* Decorative corner brackets */}
      <span className="absolute top-2.5 left-2.5 h-3 w-3 border-t border-l border-gold-bright" />
      <span className="absolute top-2.5 right-2.5 h-3 w-3 border-t border-r border-gold-bright" />
      <span className="absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-gold-bright" />
      <span className="absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-gold-bright" />

      <div className="text-center font-mono text-[11px] tracking-[0.18em] uppercase text-fg-muted">
        Closing in {formatCountdown(endsAt)}
      </div>
      <h3 className="mt-1.5 text-center font-display text-[28px] font-semibold text-gold-bright">
        {title}
      </h3>

      <div className="mt-5 flex flex-col">
        {topThree.map((entry, idx) => (
          <div
            key={entry.alias.name}
            className="grid grid-cols-[36px_1fr_auto] gap-3.5 items-center py-2.5 border-b border-rule last:border-b-0"
          >
            <div className="flex items-center justify-center font-display text-[22px] font-semibold text-gold">
              {ROMAN[idx]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar name={entry.alias.name} size="sm" />
                <span className="truncate font-semibold text-[15px]">{entry.alias.name}</span>
                {entry.alias.xHandle && (
                  <span className="text-[11px] font-mono text-fg-muted truncate">
                    @{entry.alias.xHandle}
                    {entry.alias.xHandleVerified && <span className="text-gain ml-1">✓</span>}
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-[11px] font-mono text-fg-muted">
                100M PLS · {entry.trades} trades
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-semibold text-[16px] text-gain tabular">
                {formatPct(entry.pctGain)}
              </div>
              <div className="font-mono text-[11px] text-fg-muted tabular">
                {formatUsd(entry.valueUsd, { digits: 0 })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
