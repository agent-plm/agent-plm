"use client";

import { useState } from "react";
import type { Season, SeasonInput, SeasonStatus } from "@/lib/seasons";

const statuses: SeasonStatus[] = ["DRAFT", "ACTIVE", "CLOSED"];

const fieldClassName =
  "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
    <form action={handleSubmit} className="grid gap-4">
      {error ? (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Name</span>
        <input required name="name" defaultValue={initial?.name} className={fieldClassName} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Code</span>
        <input
          required
          name="code"
          defaultValue={initial?.code}
          placeholder="FW26"
          className={`${fieldClassName} font-mono`}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Description</span>
        <textarea
          name="description"
          defaultValue={initial?.description ?? ""}
          rows={3}
          className={fieldClassName}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Status</span>
          <select name="status" defaultValue={initial?.status ?? "DRAFT"} className={fieldClassName}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Calendar year</span>
          <input name="calendarYear" type="number" defaultValue={initial?.calendarYear ?? ""} className={fieldClassName} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Starts on</span>
          <input name="startsOn" type="date" defaultValue={initial?.startsOn ?? ""} className={fieldClassName} />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Ends on</span>
          <input name="endsOn" type="date" defaultValue={initial?.endsOn ?? ""} className={fieldClassName} />
        </label>
      </div>
      <button
        disabled={pending}
        className="mt-2 inline-flex w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        type="submit"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
