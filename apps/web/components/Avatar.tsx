import { cn } from "@/lib/cn";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const SIZE: Record<AvatarSize, { box: string; text: string }> = {
  sm: { box: "h-7 w-7",  text: "text-xs" },
  md: { box: "h-8 w-8",  text: "text-sm" },
  lg: { box: "h-12 w-12", text: "text-lg" },
  xl: { box: "h-24 w-24", text: "text-4xl" }
};

export function Avatar({
  name,
  size = "md",
  ring = false,
  className
}: {
  name: string;
  size?: AvatarSize;
  /** Gold ring around the avatar — indicates "currently competing". */
  ring?: boolean;
  className?: string;
}) {
  const initial = (name?.[0] ?? "?").toUpperCase();
  const sz = SIZE[size];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full flex-none font-display font-semibold text-gold-bright",
        "bg-gradient-to-br from-elevated to-canvas",
        ring ? "shadow-[0_0_0_1px_#C9A24B]" : "shadow-[0_0_0_1px_#2A2A36]",
        sz.box,
        sz.text,
        className
      )}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
