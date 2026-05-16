import { serverTrpc } from "@/lib/trpc/server";
import { HomeHero } from "@/components/HomeHero";
import { HomeLeaderboard } from "@/components/HomeLeaderboard";
import { MedalHierarchy } from "@/components/MedalHierarchy";

// Refresh server-rendered numbers every 30 seconds.
export const revalidate = 30;

export default async function HomePage() {
  // Fetch initial data server-side so the hero is filled on first paint.
  // Falls back gracefully if the API is unreachable (e.g., first cold start).
  let stats = { activeCompetitors: 0, medalsAwarded: 0, plsUsd: 0.0000073 };
  let featured: Awaited<ReturnType<typeof serverTrpc.getLeaderboard.query>> | null = null;
  try {
    [stats, featured] = await Promise.all([
      serverTrpc.siteStats.query(),
      serverTrpc.getLeaderboard.query({ competitionId: "weekly-100m-2026-W20" })
    ]);
  } catch (err) {
    console.warn("Server fetch failed, rendering with placeholders:", err);
  }

  const topThree = featured?.entries.slice(0, 3) ?? [];

  return (
    <div className="mx-auto max-w-[1240px] px-7">
      <HomeHero
        weekLabel="Week 20 · 2026"
        activeCompetitors={stats.activeCompetitors}
        medalsAwarded={stats.medalsAwarded}
        plsUsd={stats.plsUsd}
        championship={{
          title: "100M Weekly Final",
          endsAt: featured?.competition.endsAt ?? new Date(Date.now() + 86_400_000 * 3).toISOString(),
          topThree
        }}
      />

      <HomeLeaderboard />

      <MedalHierarchy />
    </div>
  );
}
