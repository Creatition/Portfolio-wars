/** Shared TypeScript types — used by both API and UI. */

export type Tier = "TEN_M" | "HUNDRED_M";
export type Period = "WEEKLY" | "MONTHLY" | "YEARLY";
export type CompetitionStatus = "UPCOMING" | "OPEN" | "IN_PROGRESS" | "SETTLING" | "FINAL";

export interface Medal {
  /** Place: 1 = gold, 2 = silver, 3 = bronze. */
  place: 1 | 2 | 3;
  period: Period;
  tier: Tier;
  /** ISO date of the competition this came from. */
  awardedAt: string;
  /** Human label, e.g. "Week 18, 2026" */
  label: string;
}

export interface Alias {
  name: string;
  /** Optional X handle (without the @). */
  xHandle: string | null;
  xHandleVerified: boolean;
  /** When false (default), the wallet address is masked in public views. */
  walletVisible: boolean;
  /** Real wallet address (already masked unless walletVisible is true on the server response). */
  primaryWallet: string;
  joinedAt: string;
  medals: Medal[];
}

export interface Competition {
  id: string;
  tier: Tier;
  period: Period;
  status: CompetitionStatus;
  startsAt: string;
  endsAt: string;
  /** Display label, e.g. "Week 20 · 2026" */
  label: string;
  /** Max entries (the per-period cap). */
  cap: number;
  /** Current number of funded entries. */
  entries: number;
  /** Per-entry funding amount in raw PLS (not formatted). */
  fundingPls: number;
}

export interface LeaderboardEntry {
  rank: number;
  alias: Alias;
  /** Number of trades placed in the competition wallet. */
  trades: number;
  /** Top-3 holdings (token symbols) for the snippet column. */
  topHoldings: string[];
  /** Current USD value of the competition wallet. */
  valueUsd: number;
  /** Percent gain vs. funding (e.g., 312.4 = +312.4%). */
  pctGain: number;
  /** Has the entry been flagged by anti-abuse? */
  flagged?: boolean;
}

export interface LeaderboardSnapshot {
  competition: Competition;
  asOf: string;
  entries: LeaderboardEntry[];
  /** PLS spot price used for USD conversion at the time of this snapshot. */
  plsUsd: number;
}
