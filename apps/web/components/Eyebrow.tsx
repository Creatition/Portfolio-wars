import { cn } from "@/lib/cn";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("font-mono text-[11px] tracking-[0.18em] uppercase text-fg-muted", className)}>
      {children}
    </div>
  );
}
