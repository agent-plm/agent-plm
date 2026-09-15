# PostgreSQL + pgvector init scripts for local Compose.

Compose uses `pgvector/pgvector:pg18` with volume **`postgres-data-18`** mounted at **`/var/lib/postgresql`** (required for PostgreSQL 18+ Docker images).

If Postgres still fails after an upgrade, remove leftover volumes (destroys data):

```bash
make postgres-volume-reset
make dev
```

Init scripts in this directory run only on first database creation (`/docker-entrypoint-initdb.d`).
