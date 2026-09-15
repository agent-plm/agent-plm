"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SeasonForm } from "@/components/SeasonForm";
import { createSeason } from "@/lib/seasons";

export default function NewSeasonPage() {
  const router = useRouter();

  return (
    <AppShell>
      <PageHeader eyebrow="Core PLM" title="New season" description="Create a calendar season for planning and assortment work." />
      <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm">
        <SeasonForm
          submitLabel="Create season"
          onSubmit={async (input) => {
            const created = await createSeason(input);
            router.push(`/seasons/${created.id}`);
          }}
        />
      </div>
    </AppShell>
  );
}
