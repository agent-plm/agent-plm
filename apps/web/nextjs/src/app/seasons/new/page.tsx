"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { SeasonForm } from "@/components/SeasonForm";
import { createSeason } from "@/lib/seasons";

export default function NewSeasonPage() {
  const router = useRouter();

  return (
    <AppShell>
      <p className="text-sm tracking-[0.2em] text-[var(--accent)] uppercase">Core PLM</p>
      <h1 className="mt-2 mb-8 text-3xl font-semibold tracking-tight">New season</h1>
      <SeasonForm
        submitLabel="Create season"
        onSubmit={async (input) => {
          const created = await createSeason(input);
          router.push(`/seasons/${created.id}`);
        }}
      />
    </AppShell>
  );
}
