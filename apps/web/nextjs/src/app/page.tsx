import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";

import { getApiUrl } from "@/lib/api-url";

export default function HomePage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Open-source, AI-native Product Lifecycle Management. Start with seasons, then expand through the shared entity kernel."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Core PLM</p>
          <h2 className="mt-2 text-lg font-semibold text-card-foreground">Seasons</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan collections and product development against retail calendar seasons.
          </p>
          <Link
            href="/seasons"
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open seasons
          </Link>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">API</p>
          <h2 className="mt-2 text-lg font-semibold text-card-foreground">Seasons endpoint</h2>
          <p className="mt-2 text-sm text-muted-foreground">Inspect the Quarkus REST API for season CRUD.</p>
          <a
            className="mt-4 inline-flex rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            href={`${getApiUrl()}/api/seasons`}
          >
            View JSON
          </a>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Phase</p>
          <h2 className="mt-2 text-lg font-semibold text-card-foreground">Entity kernel</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Seasons is the first end-to-end feature on the universal entity model.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
