export function Footer() {
  return (
    <footer className="border-t border-rule mt-20">
      <div className="mx-auto max-w-[1240px] px-7 py-8 text-center">
        <p className="eyebrow">Portfolio Wars · MVP scaffolding · {new Date().getFullYear()}</p>
        <p className="mt-2 text-xs text-fg-muted">
          PulseChain · Chain ID 369 · Non-custodial · Skill-based
        </p>
      </div>
    </footer>
  );
}
