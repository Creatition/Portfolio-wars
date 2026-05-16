import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { Panel } from "@/components/Panel";

const LEAGUES = [
  {
    tier: "10M PLS",
    usd: "≈ $73",
    desc: "Accessible. Anyone can try. Lower stakes, larger fields, gateway league.",
    cta: "Enter the 10M league"
  },
  {
    tier: "100M PLS",
    usd: "≈ $730",
    desc: "Serious. Bigger stake, sharper play. Marquee medals.",
    cta: "Enter the 100M league"
  }
];

const STEPS = [
  "Pick your league.",
  "Connect your PulseChain wallet (no custody — you keep your keys).",
  "Choose an alias. Optionally paste an X handle.",
  "Sign a free, gasless entry message.",
  "Receive your funding within one PulseChain block (~10s).",
  "Trade however you want. Your wallet, your rules."
];

export default function ComputePage() {
  return (
    <div className="mx-auto max-w-[1240px] px-7 py-14">
      <Eyebrow>Compete</Eyebrow>
      <h1 className="font-display font-semibold text-[64px] leading-none mt-3 mb-6">Enter the arena.</h1>
      <p className="text-fg-muted text-[17px] max-w-2xl leading-relaxed">
        Choose your league below. You'll be funded with real PLS to a fresh competition wallet
        you fully control. Whatever the wallet is worth when the period ends is yours to keep.
        The medal is the prize.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        {LEAGUES.map(L => (
          <Panel key={L.tier} className="p-9">
            <Eyebrow>League</Eyebrow>
            <h2 className="font-display text-[44px] font-semibold mt-2">{L.tier}</h2>
            <p className="text-fg-muted text-sm mt-1">Funded balance · {L.usd}</p>
            <p className="text-fg mt-5 leading-relaxed">{L.desc}</p>
            <button
              className="mt-8 inline-flex items-center gap-2 rounded-sharp px-4 py-3 bg-gold text-canvas font-semibold text-[13px] tracking-wide shadow-btn hover:bg-gold-bright transition-colors disabled:opacity-60"
              disabled
              title="Wallet connect is not yet wired in this MVP scaffold."
            >
              {L.cta} <span className="text-[10px]">◆</span>
            </button>
            <p className="mt-3 text-[11px] font-mono text-fg-muted">
              Wallet integration ships with the Funding Contract (see /contracts).
            </p>
          </Panel>
        ))}
      </div>

      <section className="mt-16">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="font-display text-[38px] font-semibold mt-2 mb-7">Six steps. About 90 seconds.</h2>
        <ol className="space-y-3 list-none">
          {STEPS.map((step, idx) => (
            <li key={idx} className="grid grid-cols-[36px_1fr] gap-4 items-start border-b border-rule pb-3">
              <span className="font-display font-semibold text-[26px] text-gold-bright">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="pt-1">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 border border-gold rounded-sharp bg-canvas p-6">
          <Eyebrow>What you keep</Eyebrow>
          <p className="mt-2 text-[15px] leading-relaxed">
            <span className="font-semibold">Everything.</span> The competition wallet's contents
            at close belong to you — gains and losses. The platform never reclaims a single PLS.
            The medal is the prize.
          </p>
        </div>
      </section>

      <p className="text-sm text-fg-muted mt-10">
        Already in?  <Link href="/" className="text-gold hover:text-gold-bright underline underline-offset-4">View the live leaderboards</Link>.
      </p>
    </div>
  );
}
