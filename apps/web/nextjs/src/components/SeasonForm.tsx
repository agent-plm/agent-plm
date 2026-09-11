"use client";

import { useState } from "react";
import type { Season, SeasonInput, SeasonStatus } from "@/lib/seasons";

const statuses: SeasonStatus[] = ["DRAFT", "ACTIVE", "CLOSED"];

type Props = {
  initial?: Season;
  submitLabel: string;
  onSubmit: (input: SeasonInput) => Promise<void>;
};

export function SeasonForm({ initial, submitLabel, onSubmit }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const calendarYearRaw = String(formData.get("calendarYear") ?? "").trim();
    const input: SeasonInput = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      code: String(formData.get("code") ?? ""),
      status: String(formData.get("status") ?? "DRAFT") as SeasonStatus,
      calendarYear: calendarYearRaw ? Number(calendarYearRaw) : null,
      startsOn: String(formData.get("startsOn") ?? "") || null,
      endsOn: String(formData.get("endsOn") ?? "") || null,
      version: initial?.version,
    };
    try {
      await onSubmit(input);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save season.");
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid max-w-xl gap-4">
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm">{error}</p>
      ) : null}
      <label className="grid gap-1 text-sm">
        Name
        <input
          required
          name="name"
          defaultValue={initial?.name}
          className="rounded-md border border-white/15 bg-transparent px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Code
        <input
          required
          name="code"
          defaultValue={initial?.code}
          placeholder="FW26"
          className="rounded-md border border-white/15 bg-transparent px-3 py-2 font-mono"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Description
        <textarea
          name="description"
          defaultValue={initial?.description ?? ""}
          rows={3}
          className="rounded-md border border-white/15 bg-transparent px-3 py-2"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Status
          <select
            name="status"
            defaultValue={initial?.status ?? "DRAFT"}
            className="rounded-md border border-white/15 bg-[var(--background)] px-3 py-2"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Calendar year
          <input
            name="calendarYear"
            type="number"
            defaultValue={initial?.calendarYear ?? ""}
            className="rounded-md border border-white/15 bg-transparent px-3 py-2"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Starts on
          <input
            name="startsOn"
            type="date"
            defaultValue={initial?.startsOn ?? ""}
            className="rounded-md border border-white/15 bg-transparent px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Ends on
          <input
            name="endsOn"
            type="date"
            defaultValue={initial?.endsOn ?? ""}
            className="rounded-md border border-white/15 bg-transparent px-3 py-2"
          />
        </label>
      </div>
      <button
        disabled={pending}
        className="mt-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        type="submit"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
