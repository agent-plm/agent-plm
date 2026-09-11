const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6">
      <p className="text-sm tracking-[0.2em] text-[var(--accent)] uppercase">
        Phase 1 · Platform skeleton
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Agent PLM</h1>
      <p className="max-w-xl text-lg text-[var(--muted)]">
        An open-source, AI-native Product Lifecycle Management platform. Opinionated PLM
        product, extensible kernel.
      </p>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 p-4">
          <dt className="text-[var(--muted)]">API</dt>
          <dd className="mt-1 font-mono">{apiUrl}</dd>
        </div>
        <div className="rounded-lg border border-white/10 p-4">
          <dt className="text-[var(--muted)]">Health</dt>
          <dd className="mt-1 font-mono">
            <a className="underline decoration-[var(--accent)] underline-offset-4" href={`${apiUrl}/q/health`}>
              /q/health
            </a>
          </dd>
        </div>
      </dl>
    </main>
  );
}
