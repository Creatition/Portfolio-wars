import { notFound } from "next/navigation";
import { serverTrpc } from "@/lib/trpc/server";
import { Avatar } from "@/components/Avatar";
import { MedalCluster, Medal } from "@/components/Medal";
import { Panel } from "@/components/Panel";
import { Eyebrow } from "@/components/Eyebrow";
import { formatPct, formatUsd } from "@/lib/format";

export default async function AliasPage({ params }: { params: { name: string } }) {
  const alias = await serverTrpc.getAlias.query({ name: decodeURIComponent(params.name) });
  if (!alias) notFound();

  // Pull leaderboard entries to compute the alias's current standings across competitions.
  const competitions = await serverTrpc.listCompetitions.query();
  const standings: Array<{ label: string; pct: number; usd: number }> = [];
  for (const c of competitions) {
    const lb = await serverTrpc.getLeaderboard.query({ competitionId: c.id });
    const e = lb?.entries.find(x => x.alias.name === alias.name);
    if (e) {
      standings.push({
        label: `${c.period[0]}${c.period.slice(1).toLowerCase()} · ${c.label} · ${c.tier === "TEN_M" ? "10M" : "100M"}`,
        pct: e.pctGain,
        usd: e.valueUsd
      });
    }
  }

  return (
    <div className="mx-auto max-w-[1240px] px-7 py-14">
      <Eyebrow>Alias Profile</Eyebrow>
      <h1 className="font-display text-[44px] font-semibold mt-2 mb-6">{alias.name}</h1>

      <div className="relative overflow-hidden bg-surface border border-rule rounded-sharp p-9">
        <div className="absolute inset-0 pointer-events-none profile-glow" />
        <div className="relative flex flex-col md:flex-row items-start gap-6">
          <Avatar name={alias.name} size="xl" ring />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-[40px] font-semibold leading-none">{alias.name}</span>
              <MedalCluster
                medals={alias.medals.map(m => ({
                  place: m.place,
                  label: m.label,
                  shimmer: m.period === "YEARLY" && m.place === 1
                }))}
                size="xl"
                max={6}
              />
            </div>
            <div className="mt-2 font-mono text-[13px] text-fg-muted">
              {alias.xHandle ? (
                <>
                  @{alias.xHandle}
                  {alias.xHandleVerified && <span className="text-gain ml-2">✓ Verified</span>}
                </>
              ) : (
                "anonymous"
              )}
              {" · "}
              joined {new Date(alias.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              {" · "}
              {alias.medals.length} medal{alias.medals.length === 1 ? "" : "s"}
            </div>

            {alias.medals.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {alias.medals.map((m, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-2.5 py-1 border border-rule rounded-sharp bg-canvas font-mono text-[11px] text-fg-muted"
                  >
                    <Medal place={m.place} size="sm" />
                    {m.label} · {m.tier === "TEN_M" ? "10M" : "100M"}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5 mt-8">
          <Panel inset>
            <h3 className="font-display text-[22px] font-semibold mb-3.5">Active competitions</h3>
            {standings.length === 0 ? (
              <p className="text-fg-muted text-sm">Not currently competing.</p>
            ) : (
              standings.map((s, idx) => (
                <div key={idx} className="flex justify-between py-2.5 border-b border-rule last:border-0">
                  <span className="text-fg-muted text-[12px] uppercase tracking-[0.12em]">{s.label}</span>
                  <span className={`font-mono text-sm tabular ${s.pct >= 0 ? "text-gain" : "text-loss"}`}>
                    {formatPct(s.pct)} · {formatUsd(s.usd, { digits: 2 })}
                  </span>
                </div>
              ))
            )}
          </Panel>

          <Panel inset>
            <h3 className="font-display text-[22px] font-semibold mb-3.5">Identity</h3>
            <KV k="X handle"
                v={alias.xHandle ? `@${alias.xHandle} ${alias.xHandleVerified ? "✓" : ""}` : "—"} />
            <KV k="Wallet"
                v={alias.walletVisible ? alias.primaryWallet : `Hidden · ${alias.primaryWallet}`} />
            <KV k="Joined"
                v={new Date(alias.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
            <KV k="Medals" v={String(alias.medals.length)} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-rule last:border-0">
      <span className="text-fg-muted text-[12px] uppercase tracking-[0.12em]">{k}</span>
      <span className="font-mono text-sm">{v}</span>
    </div>
  );
}
