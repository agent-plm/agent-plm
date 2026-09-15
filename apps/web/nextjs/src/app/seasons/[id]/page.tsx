"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SeasonForm } from "@/components/SeasonForm";
import { archiveSeason, getSeason, updateSeason, type Season } from "@/lib/seasons";

export default function SeasonDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [season, setSeason] = useState<Season | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSeason(params.id)
      .then(setSeason)
      .catch((caught: unknown) => {
        setError(caught instanceof Error ? caught.message : "Unable to load season.");
      });
  }, [params.id]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Core PLM"
        title={season?.name ?? "Season"}
        description={season ? `${season.code} · ${season.status}` : "Edit season details"}
      />
      {error ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {season ? (
        <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm">
          <SeasonForm
            initial={season}
            submitLabel="Save changes"
            onSubmit={async (input) => {
              const updated = await updateSeason(season.id, input);
              setSeason(updated);
            }}
          />
          <button
            className="mt-6 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            type="button"
            onClick={async () => {
              await archiveSeason(season.id);
              router.push("/seasons");
            }}
          >
            Close season
          </button>
        </div>
      ) : null}
    </AppShell>
  );
}
