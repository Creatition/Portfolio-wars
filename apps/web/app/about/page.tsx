import { Eyebrow } from "@/components/Eyebrow";
import { Panel } from "@/components/Panel";

const RULES = [
  {
    title: "Real wallets, real outcomes",
    body: "Every trade is on-chain on PulseChain. The platform never custodies your funds. You receive PLS into a fresh competition wallet you control."
  },
  {
    title: "Anonymous by default",
    body: "Your alias is the only thing the world sees. Your wallet address is hidden unless you choose to reveal it. Paste an X handle if you want credit; leave it blank if you don't."
  },
  {
    title: "Keep your winnings",
    body: "Whatever the wallet is worth at close is yours — gains and losses. The medal is the prize. The platform never reclaims a single PLS."
  },
  {
    title: "Skill-based, not chance-based",
    body: "Rankings are computed from portfolio performance in USD, with TWAP smoothing at settlement. No entry fee. No prize pool of player money. No gambling."
  },
  {
    title: "Anti-manipulation",
    body: "Tokens below a liquidity floor count as $0 in rankings. Wash trades are filtered. Pre-funding deposits are flagged. Settlement uses time-weighted prices, not last-second pumps."
  },
  {
    title: "Treasury transparency",
    body: "Funding amounts, cap utilization, and treasury balances are public. The Funding Contract is open-source and audited before mainnet deployment."
  }
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-7 py-14">
      <Eyebrow>About</Eyebrow>
      <h1 className="font-display text-[64px] font-semibold leading-none mt-3">How Portfolio Wars works.</h1>
      <p className="text-fg-muted text-[17px] max-w-2xl mt-5 leading-relaxed">
        Portfolio Wars is a recurring portfolio competition for members of the PulseChain
        community. Six rules. One scoreboard. One question: who's the sharpest trader this week?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        {RULES.map((r, idx) => (
          <Panel key={idx}>
            <Eyebrow>Rule {String(idx + 1).padStart(2, "0")}</Eyebrow>
            <h2 className="font-display text-[24px] font-semibold mt-1.5">{r.title}</h2>
            <p className="text-fg-muted text-sm mt-2.5 leading-relaxed">{r.body}</p>
          </Panel>
        ))}
      </div>

      <section className="mt-16">
        <Eyebrow>The fine print</Eyebrow>
        <h2 className="font-display text-[32px] font-semibold mt-2 mb-6">A few things to know.</h2>
        <ul className="space-y-3 text-sm text-fg-muted max-w-3xl">
          <li>◆  Portfolio Wars is not a financial advisor, broker, or investment service. Leaderboards are entertainment.</li>
          <li>◆  Players are responsible for their own taxes. The platform offers a CSV export of trades as a courtesy.</li>
          <li>◆  Restricted jurisdictions are blocked at the edge. Check current geofence list in your local Terms.</li>
          <li>◆  Smart-contract risk is real. The Funding Contract is audited but no audit is a guarantee.</li>
          <li>◆  Caps protect the treasury. Once a competition fills, new entries close until the next period.</li>
        </ul>
      </section>
    </div>
  );
}
