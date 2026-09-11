import Link from "next/link";
import { AppShell } from "@/components/AppShell";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function HomePage() {
  return (
    <AppShell>
      <p className="text-sm tracking-[0.2em] text-[var(--accent)] uppercase">Phase 2 · First domain feature</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Agent PLM</h1>
      <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">
        An open-source, AI-native Product Lifecycle Management platform. Start with seasons, then
        expand through the shared entity kernel.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/seasons"
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black"
        >
          Open seasons
        </Link>
        <a
          className="rounded-md border border-white/15 px-4 py-2 text-sm"
          href={`${apiUrl}/api/seasons`}
        >
          Seasons API
        </a>
      </div>
    </AppShell>
  );
}
