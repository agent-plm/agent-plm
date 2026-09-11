import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-[0.18em] uppercase">
            Agent PLM
          </Link>
          <nav className="flex gap-6 text-sm text-[var(--muted)]">
            <Link className="hover:text-[var(--foreground)]" href="/">
              Home
            </Link>
            <Link className="hover:text-[var(--foreground)]" href="/seasons">
              Seasons
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
