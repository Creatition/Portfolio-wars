import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Panel({
  children,
  className,
  inset = false
}: {
  children: ReactNode;
  className?: string;
  /** Render with surface color instead of canvas — used inside surface containers. */
  inset?: boolean;
}) {
  return (
    <div
      className={cn(
        "border border-rule rounded-sharp p-[22px]",
        inset ? "bg-canvas" : "bg-surface",
        className
      )}
    >
      {children}
    </div>
  );
}
