import { cn } from "@/lib/cn";

type MedalPlace = 1 | 2 | 3;
type MedalSize = "sm" | "md" | "lg" | "xl";

const PLACE_BG: Record<MedalPlace, string> = {
  1: "linear-gradient(135deg, #E6C76B 0%, #C9A24B 60%, #8C7236 100%)",
  2: "linear-gradient(135deg, #DCE0EA 0%, #B5BAC7 60%, #7E8290 100%)",
  3: "linear-gradient(135deg, #C28B57 0%, #9B6B3A 60%, #694422 100%)"
};

const SIZE: Record<MedalSize, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-[18px] w-[18px]",
  xl: "h-6 w-6"
};

export interface MedalProps {
  place: MedalPlace;
  size?: MedalSize;
  /** Visual label, e.g. "Week 18 · 10M". Shown on hover and to screen readers. */
  label?: string;
  /** Yearly-gold gets a subtle shimmer animation in the trophy case. */
  shimmer?: boolean;
  className?: string;
}

export function Medal({ place, size = "md", label, shimmer = false, className }: MedalProps) {
  return (
    <span
      className={cn(
        "inline-block shadow-medal rotate-45",
        SIZE[size],
        shimmer && "animate-shimmer bg-[length:200%_100%]",
        className
      )}
      style={{ background: PLACE_BG[place] }}
      role="img"
      aria-label={label ?? `Place ${place} medal`}
      title={label}
    />
  );
}

export function MedalCluster({ medals, size = "md", max = 4 }: {
  medals: Array<{ place: MedalPlace; label?: string; shimmer?: boolean }>;
  size?: MedalSize;
  max?: number;
}) {
  if (!medals.length) return null;
  const shown = medals.slice(0, max);
  return (
    <span className="inline-flex items-center gap-1">
      {shown.map((m, i) => (
        <Medal key={i} place={m.place} size={size} label={m.label} shimmer={m.shimmer} />
      ))}
      {medals.length > max && (
        <span className="ml-1 text-[11px] font-mono text-fg-muted tabular">+{medals.length - max}</span>
      )}
    </span>
  );
}
