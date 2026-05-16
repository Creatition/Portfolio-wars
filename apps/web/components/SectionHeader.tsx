import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

export function SectionHeader({
  eyebrow,
  title,
  lede,
  actions
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-7">
      <div className="min-w-0">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display font-semibold text-[38px] tracking-tight mt-2">{title}</h2>
        {lede && (
          <p className="text-fg-muted text-sm max-w-[520px] mt-2">{lede}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-4 flex-none">{actions}</div>}
    </div>
  );
}
