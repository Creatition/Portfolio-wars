import Link from "next/link";
import { cn } from "@/lib/cn";
import { Avatar } from "./Avatar";
import { MedalCluster } from "./Medal";
import type { Alias } from "@pw/shared";

export function AliasChip({
  alias,
  showHandle = true,
  showMedals = true,
  ring = false,
  tagLine,
  className
}: {
  alias: Alias;
  showHandle?: boolean;
  showMedals?: boolean;
  ring?: boolean;
  /** Secondary line shown under the alias (e.g. "10M tier · 4 medals"). */
  tagLine?: string;
  className?: string;
}) {
  return (
    <Link
      href={`/alias/${encodeURIComponent(alias.name)}`}
      className={cn("flex items-center gap-3 group", className)}
    >
      <Avatar name={alias.name} ring={ring} />
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="flex items-center gap-2 min-w-0">
          <span className="truncate font-semibold text-[15px] text-fg group-hover:text-gold-bright transition-colors">
            {alias.name}
          </span>
          {showMedals && (
            <MedalCluster
              medals={alias.medals.map(m => ({ place: m.place, label: m.label }))}
              size="md"
            />
          )}
        </span>
        {(showHandle || tagLine) && (
          <span className="text-[11px] font-mono text-fg-muted tracking-wide">
            {showHandle && alias.xHandle ? (
              <>
                @{alias.xHandle}
                {alias.xHandleVerified && <span className="text-gain ml-1">✓</span>}
                {tagLine && <span className="ml-2">· {tagLine}</span>}
              </>
            ) : (
              <>{tagLine ?? "anonymous"}</>
            )}
          </span>
        )}
      </span>
    </Link>
  );
}
