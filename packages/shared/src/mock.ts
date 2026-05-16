/**
 * Mock data layer for the MVP.
 *
 * In production this is backed by Postgres + ClickHouse + chain indexer
 * (see Portfolio_Wars_Architecture_Plan.docx §6, §7, §9).
 *
 * For the scaffolding we generate a deterministic, varied set of aliases
 * and a small set of active competitions.
 */

import type {
  Alias,
  Competition,
  LeaderboardEntry,
  LeaderboardSnapshot,
  Medal,
  Period,
  Tier
} from "./types";

/** Mask a wallet address for public display when wallet_visible = false. */
function maskAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}••••${addr.slice(-4)}`;
}

// ----- Constants -----

/** Live-ish PLS spot in USD (as of doc draft date). Real backend pulls this from §8. */
export const PLS_USD = 0.0000073;

const PERIOD_LABEL: Record<Period, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly"
};

const TIER_PLS: Record<Tier, number> = {
  TEN_M: 10_000_000,
  HUNDRED_M: 100_000_000
};

// ----- Aliases -----

const aliasSeeds: Array<{
  name: string;
  xHandle: string | null;
  xHandleVerified: boolean;
  walletVisible: boolean;
  medals: Array<{ place: 1 | 2 | 3; period: Period; tier: Tier; label: string }>;
}> = [
  { name: "nightowl_v3",        xHandle: "night_owl",      xHandleVerified: true,  walletVisible: false, medals: [
    { place: 1, period: "YEARLY",  tier: "TEN_M",     label: "Yearly · 2025" },
    { place: 1, period: "MONTHLY", tier: "TEN_M",     label: "Monthly · Apr 2026" },
    { place: 2, period: "WEEKLY",  tier: "TEN_M",     label: "Week 18 · 2026" },
    { place: 3, period: "WEEKLY",  tier: "HUNDRED_M", label: "Week 12 · 2026" }
  ]},
  { name: "scalewithme",        xHandle: null,             xHandleVerified: false, walletVisible: false, medals: [
    { place: 2, period: "MONTHLY", tier: "TEN_M",     label: "Monthly · Feb 2026" }
  ]},
  { name: "basement.degen",     xHandle: "bsmt_dgn",       xHandleVerified: false, walletVisible: true,  medals: [
    { place: 3, period: "MONTHLY", tier: "TEN_M",     label: "Monthly · Mar 2026" },
    { place: 3, period: "WEEKLY",  tier: "TEN_M",     label: "Week 14 · 2026" }
  ]},
  { name: "kublai",             xHandle: "kbl",            xHandleVerified: false, walletVisible: false, medals: []},
  { name: "paperhands_no_more", xHandle: null,             xHandleVerified: false, walletVisible: false, medals: []},
  { name: "mainnetking",        xHandle: "mainnet_k",      xHandleVerified: true,  walletVisible: true,  medals: [
    { place: 1, period: "WEEKLY",  tier: "HUNDRED_M", label: "Week 11 · 2026" }
  ]},
  { name: "rugrider.exe",       xHandle: null,             xHandleVerified: false, walletVisible: false, medals: []},
  { name: "silentdegen.pls",    xHandle: "silent_eth",     xHandleVerified: true,  walletVisible: false, medals: [
    { place: 1, period: "MONTHLY", tier: "HUNDRED_M", label: "Monthly · Apr 2026" },
    { place: 1, period: "WEEKLY",  tier: "HUNDRED_M", label: "Week 17 · 2026" },
    { place: 1, period: "WEEKLY",  tier: "HUNDRED_M", label: "Week 16 · 2026" }
  ]},
  { name: "heartcore",          xHandle: null,             xHandleVerified: false, walletVisible: false, medals: []},
  { name: "moneyprintergobrrr", xHandle: "brrr_chad",      xHandleVerified: true,  walletVisible: false, medals: [
    { place: 2, period: "WEEKLY",  tier: "HUNDRED_M", label: "Week 19 · 2026" }
  ]},
  { name: "thirtyninesixty",    xHandle: "_3960",          xHandleVerified: true,  walletVisible: true,  medals: []},
  { name: "wpls.maxi",          xHandle: "wpls_maxi",      xHandleVerified: false, walletVisible: false, medals: []},
  { name: "hexagon",            xHandle: null,             xHandleVerified: false, walletVisible: false, medals: [
    { place: 3, period: "WEEKLY",  tier: "HUNDRED_M", label: "Week 18 · 2026" }
  ]},
  { name: "alphawitch",         xHandle: "alpha_witch",    xHandleVerified: true,  walletVisible: false, medals: []},
  { name: "quietquant",         xHandle: null,             xHandleVerified: false, walletVisible: false, medals: []}
];

function pseudoAddress(name: string): string {
  // Deterministic-looking address based on the alias name. NOT a real wallet.
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hex = h.toString(16).padStart(8, "0");
  return `0x${hex}${"0123456789abcdef0123456789abcdef".slice(0, 32 - hex.length)}${hex.slice(0, 4)}`;
}

function buildAlias(seed: typeof aliasSeeds[number]): Alias {
  const medals: Medal[] = seed.medals.map(m => ({
    place: m.place,
    period: m.period,
    tier: m.tier,
    label: m.label,
    awardedAt: "2026-04-15T00:00:00Z" // placeholder
  }));
  return {
    name: seed.name,
    xHandle: seed.xHandle,
    xHandleVerified: seed.xHandleVerified,
    walletVisible: seed.walletVisible,
    primaryWallet: pseudoAddress(seed.name),
    joinedAt: "2026-01-14T00:00:00Z",
    medals
  };
}

export const ALIASES: Alias[] = aliasSeeds.map(buildAlias);

/** Get an alias by name; respects wallet-visible toggle (masking on response). */
export function getAlias(name: string): Alias | null {
  const a = ALIASES.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (!a) return null;
  return {
    ...a,
    primaryWallet: a.walletVisible ? a.primaryWallet : maskAddress(a.primaryWallet)
  };
}

// ----- Competitions -----

/** Helper to pin a date with no surprises. */
function iso(year: number, month: number, day: number, hour = 0, minute = 0): string {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0)).toISOString();
}

export const COMPETITIONS: Competition[] = [
  // Active week (May 18–24, 2026 — week 20)
  {
    id: "weekly-10m-2026-W20",
    tier: "TEN_M",
    period: "WEEKLY",
    status: "IN_PROGRESS",
    startsAt: iso(2026, 5, 18, 0, 0),
    endsAt:   iso(2026, 5, 24, 23, 59),
    label: "Week 20 · 2026",
    cap: 2_000,
    entries: 1_412,
    fundingPls: TIER_PLS.TEN_M
  },
  {
    id: "weekly-100m-2026-W20",
    tier: "HUNDRED_M",
    period: "WEEKLY",
    status: "IN_PROGRESS",
    startsAt: iso(2026, 5, 18, 0, 0),
    endsAt:   iso(2026, 5, 24, 23, 59),
    label: "Week 20 · 2026",
    cap: 2_000,
    entries: 612,
    fundingPls: TIER_PLS.HUNDRED_M
  },
  {
    id: "monthly-10m-2026-05",
    tier: "TEN_M",
    period: "MONTHLY",
    status: "IN_PROGRESS",
    startsAt: iso(2026, 5, 1, 0, 0),
    endsAt:   iso(2026, 5, 31, 23, 59),
    label: "May 2026",
    cap: 5_000,
    entries: 3_104,
    fundingPls: TIER_PLS.TEN_M
  },
  {
    id: "monthly-100m-2026-05",
    tier: "HUNDRED_M",
    period: "MONTHLY",
    status: "IN_PROGRESS",
    startsAt: iso(2026, 5, 1, 0, 0),
    endsAt:   iso(2026, 5, 31, 23, 59),
    label: "May 2026",
    cap: 5_000,
    entries: 1_488,
    fundingPls: TIER_PLS.HUNDRED_M
  },
  {
    id: "yearly-10m-2026",
    tier: "TEN_M",
    period: "YEARLY",
    status: "IN_PROGRESS",
    startsAt: iso(2026, 1, 1, 0, 0),
    endsAt:   iso(2026, 12, 31, 23, 59),
    label: "Year 2026",
    cap: 20_000,
    entries: 8_241,
    fundingPls: TIER_PLS.TEN_M
  },
  {
    id: "yearly-100m-2026",
    tier: "HUNDRED_M",
    period: "YEARLY",
    status: "IN_PROGRESS",
    startsAt: iso(2026, 1, 1, 0, 0),
    endsAt:   iso(2026, 12, 31, 23, 59),
    label: "Year 2026",
    cap: 20_000,
    entries: 2_812,
    fundingPls: TIER_PLS.HUNDRED_M
  }
];

export function getCompetition(id: string): Competition | null {
  return COMPETITIONS.find(c => c.id === id) ?? null;
}

// ----- Leaderboard -----

/** Pre-canned, hand-tuned rankings for each tier — feels real, not random. */
const HOLDINGS_POOL = [
  ["PLSX", "INC", "HEX"],
  ["PLS", "WBTC", "USDL"],
  ["PLS", "INC", "pHEX"],
  ["PLSX", "WPLS"],
  ["PLS", "HEX"],
  ["PLSX", "INC", "WBTC"],
  ["PLS", "PLSX"],
  ["WPLS", "INC"],
  ["HEX", "INC"],
  ["PLS"]
];

function rankingsForTier(tier: Tier): Array<{ aliasName: string; pctGain: number; trades: number }> {
  if (tier === "TEN_M") {
    return [
      { aliasName: "nightowl_v3",        pctGain: 567.4,  trades: 47 },
      { aliasName: "scalewithme",        pctGain: 327.1,  trades: 22 },
      { aliasName: "basement.degen",     pctGain: 267.7,  trades: 61 },
      { aliasName: "kublai",             pctGain: 176.2,  trades: 18 },
      { aliasName: "paperhands_no_more", pctGain: 95.9,   trades: 9 },
      { aliasName: "mainnetking",        pctGain: 54.4,   trades: 33 },
      { aliasName: "thirtyninesixty",    pctGain: 41.2,   trades: 14 },
      { aliasName: "wpls.maxi",          pctGain: 22.8,   trades: 6 },
      { aliasName: "alphawitch",         pctGain: 11.6,   trades: 21 },
      { aliasName: "quietquant",         pctGain: -4.1,   trades: 17 },
      { aliasName: "rugrider.exe",       pctGain: -34.1,  trades: 52 }
    ];
  }
  // HUNDRED_M
  return [
    { aliasName: "silentdegen.pls",    pctGain: 412.7,  trades: 39 },
    { aliasName: "heartcore",          pctGain: 286.1,  trades: 12 },
    { aliasName: "moneyprintergobrrr", pctGain: 241.4,  trades: 28 },
    { aliasName: "hexagon",            pctGain: 188.5,  trades: 19 },
    { aliasName: "mainnetking",        pctGain: 121.7,  trades: 31 },
    { aliasName: "alphawitch",         pctGain: 74.2,   trades: 24 },
    { aliasName: "nightowl_v3",        pctGain: 41.0,   trades: 8 },
    { aliasName: "kublai",             pctGain: 8.4,    trades: 4 },
    { aliasName: "thirtyninesixty",    pctGain: -12.1,  trades: 11 }
  ];
}

export function getLeaderboard(competitionId: string): LeaderboardSnapshot | null {
  const comp = getCompetition(competitionId);
  if (!comp) return null;

  const fundedUsd = comp.fundingPls * PLS_USD;
  const rows = rankingsForTier(comp.tier);

  const entries: LeaderboardEntry[] = rows.map((r, idx) => {
    const a = getAlias(r.aliasName);
    if (!a) throw new Error(`Mock data inconsistency: alias '${r.aliasName}' missing`);
    return {
      rank: idx + 1,
      alias: a,
      trades: r.trades,
      topHoldings: HOLDINGS_POOL[idx % HOLDINGS_POOL.length],
      valueUsd: fundedUsd * (1 + r.pctGain / 100),
      pctGain: r.pctGain
    };
  });

  return {
    competition: comp,
    asOf: new Date().toISOString(),
    entries,
    plsUsd: PLS_USD
  };
}

export function getActiveCompetitionsByPeriod(period: Period): Competition[] {
  return COMPETITIONS.filter(c => c.period === period && c.status === "IN_PROGRESS");
}

/** Aggregate site-wide stats for the hero. */
export function getSiteStats() {
  const activeCompetitors = COMPETITIONS
    .filter(c => c.status === "IN_PROGRESS")
    .reduce((sum, c) => sum + c.entries, 0);
  const medalsAwarded = ALIASES.reduce((sum, a) => sum + a.medals.length, 0) * 980; // mock fan-out
  return { activeCompetitors, medalsAwarded, plsUsd: PLS_USD };
}
