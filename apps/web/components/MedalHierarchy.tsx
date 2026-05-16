import { SectionHeader } from "./SectionHeader";
import { Medal } from "./Medal";
import { Panel } from "./Panel";

export function MedalHierarchy() {
  return (
    <section className="py-16">
      <SectionHeader
        eyebrow="Medal System"
        title="The Hierarchy"
        lede="Different cadences award visually different medals so a player's history reads at a glance. Yearly gold is the rarest mark on the site."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Tier label="Weekly" detail="Slim Diamond — brushed-metal finish · 18px"
              medals={<>
                <Medal place={1} size="lg" />
                <Medal place={2} size="lg" />
                <Medal place={3} size="lg" />
              </>}/>
        <Tier label="Monthly" detail="Inner-Glow Diamond — soft drop-shadow · 22px"
              medals={<>
                <Medal place={1} size="xl" />
                <Medal place={2} size="xl" />
                <Medal place={3} size="xl" />
              </>}/>
        <Tier label="Yearly" detail="Laurel Medallion — gold version shimmers · 28px"
              medals={<>
                <Medal place={1} size="xl" shimmer className="h-8 w-8" />
                <Medal place={2} size="xl" className="h-8 w-8" />
                <Medal place={3} size="xl" className="h-8 w-8" />
              </>}/>
      </div>
    </section>
  );
}

function Tier({ label, detail, medals }: { label: string; detail: string; medals: React.ReactNode }) {
  return (
    <Panel className="text-center p-9">
      <p className="eyebrow">{label}</p>
      <div className="my-4 flex justify-center items-center gap-2.5">{medals}</div>
      <p className="font-display text-[22px] mt-3">{label} Champion</p>
      <p className="text-[12px] text-fg-muted mt-1.5">{detail}</p>
    </Panel>
  );
}
