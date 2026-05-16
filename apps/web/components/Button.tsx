import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "destructive";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-gold text-canvas hover:bg-gold-bright shadow-btn",
  ghost:
    "bg-transparent text-gold hover:text-gold-bright hover:bg-gold/5 shadow-[inset_0_0_0_1px_#C9A24B]",
  destructive:
    "bg-transparent text-loss hover:bg-loss/5 shadow-[inset_0_0_0_1px_#E26B6B]"
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sharp",
        "px-[18px] py-2.5 text-[13px] font-semibold tracking-wide",
        "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
