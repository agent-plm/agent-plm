"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listSeasons, type Season } from "@/lib/seasons";

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
    return <p className="text-[var(--muted)]">Loading seasons…</p>;
  }
  if (error) {
    return <p className="text-red-400">{error}</p>;
  }
  if (seasons.length === 0) {
    return <p className="text-[var(--muted)]">No seasons yet. Create the first calendar season.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 text-[var(--muted)]">
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
            <tr key={season.id} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-3 font-mono">
                <Link className="underline decoration-[var(--accent)] underline-offset-4" href={`/seasons/${season.id}`}>
                  {season.code}
                </Link>
              </td>
              <td className="px-4 py-3">{season.name}</td>
              <td className="px-4 py-3">{season.calendarYear ?? "—"}</td>
              <td className="px-4 py-3 text-[var(--muted)]">
                {season.startsOn ?? "—"} → {season.endsOn ?? "—"}
              </td>
              <td className="px-4 py-3">{season.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
