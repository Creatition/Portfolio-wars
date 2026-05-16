/** Number formatting helpers used across the leaderboard and profile pages. */

export function formatPct(n: number, opts: { signed?: boolean; digits?: number } = {}) {
  const { signed = true, digits = 1 } = opts;
  const sign = signed && n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(digits)}%`;
}

export function formatUsd(n: number, opts: { digits?: number; compact?: boolean } = {}) {
  const { digits = 2, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000) {
    return `$${(n / 1000).toFixed(1)}k`;
  }
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function formatPls(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M PLS`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k PLS`;
  return `${n} PLS`;
}

export function maskAddress(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}••••${addr.slice(-4)}`;
}

export function formatCountdown(targetIso: string, nowIso?: string) {
  const target = new Date(targetIso).getTime();
  const now = nowIso ? new Date(nowIso).getTime() : Date.now();
  let diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000); diff -= days * 86_400_000;
  const hours = Math.floor(diff / 3_600_000); diff -= hours * 3_600_000;
  const minutes = Math.floor(diff / 60_000);
  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}
