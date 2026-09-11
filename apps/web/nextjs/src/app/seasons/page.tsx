import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SeasonList } from "@/components/SeasonList";

export default function SeasonsPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.2em] text-[var(--accent)] uppercase">Core PLM</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Seasons</h1>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            Calendar seasons used to plan collections, line sheets, and product development.
          </p>
        </div>
        <Link
          href="/seasons/new"
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black"
        >
          New season
        </Link>
      </div>
      <SeasonList />
    </AppShell>
  );
}
