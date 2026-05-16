"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/",        label: "Leaderboards" },
  { href: "/compete", label: "Compete" },
  { href: "/history", label: "History" },
  { href: "/about",   label: "About" }
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-rule backdrop-blur-md bg-canvas/80">
      <div className="mx-auto max-w-[1240px] flex items-center justify-between px-7 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-gold text-sm group-hover:text-gold-bright transition-colors">◆</span>
          <span className="font-display font-bold text-[22px] tracking-[0.08em] uppercase text-gold-bright">
            Portfolio Wars
          </span>
        </Link>

        <nav className="hidden md:flex gap-7">
          {NAV_ITEMS.map(item => {
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/compete"
          className={cn(
            "inline-flex items-center gap-2 rounded-sharp px-4 py-2.5",
            "bg-gold text-canvas font-semibold text-[13px] tracking-wide",
            "shadow-btn hover:bg-gold-bright transition-colors"
          )}
        >
          Enter This Week
          <span className="text-[10px]">◆</span>
        </Link>
      </div>
    </header>
  );
}
