import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SeasonList } from "@/components/SeasonList";

export default function SeasonsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Core PLM"
        title="Seasons"
        description="Calendar seasons used to plan collections, line sheets, and product development."
        actions={
          <Link
            href="/seasons/new"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            New season
          </Link>
        }
      />
      <SeasonList />
    </AppShell>
  );
}
