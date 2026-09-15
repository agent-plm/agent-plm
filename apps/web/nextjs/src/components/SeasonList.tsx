"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listSeasons, type Season, type SeasonStatus } from "@/lib/seasons";
import { cn } from "@/lib/utils";

const statusStyles: Record<SeasonStatus, string> = {
  DRAFT: "bg-secondary text-secondary-foreground",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  CLOSED: "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200",
};

export function SeasonList() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSeasons()
      .then(setSeasons)
      .catch((caught: unknown) => {
        setError(caught instanceof Error ? caught.message : "Unable to load seasons.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading seasons…</p>;
  }
  if (error) {
    return (
      <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error}
      </p>
    );
  }
  if (seasons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">No seasons yet. Create the first calendar season.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Window</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((season) => (
              <tr key={season.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono">
                  <Link
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                    href={`/seasons/${season.id}`}
                  >
                    {season.code}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground">{season.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{season.calendarYear ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {season.startsOn ?? "—"} → {season.endsOn ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[season.status],
                    )}
                  >
                    {season.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
