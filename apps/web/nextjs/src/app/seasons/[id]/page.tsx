"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
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
      <p className="text-sm tracking-[0.2em] text-[var(--accent)] uppercase">Core PLM</p>
      <h1 className="mt-2 mb-8 text-3xl font-semibold tracking-tight">{season?.name ?? "Season"}</h1>
      {error ? <p className="text-red-400">{error}</p> : null}
      {season ? (
        <>
          <SeasonForm
            initial={season}
            submitLabel="Save changes"
            onSubmit={async (input) => {
              const updated = await updateSeason(season.id, input);
              setSeason(updated);
            }}
          />
          <button
            className="mt-6 text-sm text-[var(--muted)] underline underline-offset-4"
            type="button"
            onClick={async () => {
              await archiveSeason(season.id);
              router.push("/seasons");
            }}
          >
            Close season
          </button>
        </>
      ) : null}
    </AppShell>
  );
}
