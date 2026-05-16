"use client";

import { cn } from "@/lib/cn";
import type { Period, Tier } from "@pw/shared";

export const PERIOD_OPTIONS: Period[] = ["WEEKLY", "MONTHLY", "YEARLY"];
export const PERIOD_LABEL: Record<Period, string> = {
  WEEKLY: "Week",
  MONTHLY: "Month",
  YEARLY: "Year"
};

export const TIER_OPTIONS: Tier[] = ["TEN_M", "HUNDRED_M"];
export const TIER_LABEL: Record<Tier, string> = {
  TEN_M: "10M PLS",
  HUNDRED_M: "100M PLS"
};

export function PeriodToggle({
  value,
  onChange
}: {
  value: Period;
  onChange: (next: Period) => void;
}) {
  return (
    <div className="inline-flex p-1 rounded-sharp border border-rule bg-surface">
      {PERIOD_OPTIONS.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-3.5 py-2 text-[12px] uppercase font-semibold tracking-wider transition-colors rounded-sharp",
            opt === value ? "bg-gold text-canvas" : "text-fg-muted hover:text-fg"
          )}
        >
          {PERIOD_LABEL[opt]}
        </button>
      ))}
    </div>
  );
}

export function TierToggle({
  value,
  onChange
}: {
  value: Tier;
  onChange: (next: Tier) => void;
}) {
  return (
    <div className="inline-flex p-[3px] rounded-sharp border border-rule bg-surface">
      {TIER_OPTIONS.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-4 py-2 text-[12px] font-semibold tracking-wide transition-colors rounded-sharp",
            opt === value ? "bg-canvas text-gold-bright" : "text-fg-muted hover:text-fg"
          )}
        >
          {TIER_LABEL[opt]}
        </button>
      ))}
    </div>
  );
}
