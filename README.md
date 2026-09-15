# Agent PLM

Open-source, AI-native Product Lifecycle Management. Opinionated PLM product plus an extensible kernel.

Specification: [PLM_SPEC.md](PLM_SPEC.md)

**Wiki:** [agent-plm/agent-plm/wiki](https://github.com/agent-plm/agent-plm/wiki) (auto-published from `main`; enable **Wiki** under repo Settings → Features before the first publish)

**Current phase:** 2 — Seasons (CRUD UI + API on the entity kernel).

## Stack

| Layer | Choice |
| --- | --- |
| API | Java 25, Quarkus 3.39 |
| UI | Next.js, TypeScript, Tailwind CSS |
| Data | PostgreSQL 18 + pgvector (JSON, FTS, graph later) |
| Objects | RustFS (S3) |
| Cache | Valkey |
| AuthN | Authelia |
| AuthZ | Cerbos |
| Dev appliance | Docker Compose |

## Repository

```
apps/api/quarkus     Quarkus modular monolith
apps/web/nextjs      Next.js UI
kernel/              Logical kernel JARs
modules/             Core PLM domain modules
extensions/          Industry packages
sdk/                 Java and TypeScript SDKs
packages/            Shared TS schema/UI packages
schemas/             Declarative schema YAML
policies/cerbos      Authorization policies
infra/               Compose service config
migrations/          Flyway SQL
```

## Prerequisites

- JDK 25
- Node.js 22 and pnpm 10
- Docker Compose (for `make dev`)
- [mkcert](https://github.com/FiloSottile/mkcert) (for local HTTPS gateway)

Copy environment defaults:

```bash
cp .env.example .env
mkcert -install
echo "127.0.0.1 agent-plm.local" | sudo tee -a /etc/hosts
make gateway-certs
```

## Commands

```bash
make dev              # start the full local stack
make down             # stop Compose
make test             # Maven verify + Next.js lint/build
make compose-config   # validate Compose files
./mvnw verify         # backend only
pnpm --filter @agent-plm/web dev
```

API health: `https://agent-plm.local/api/health` and `https://agent-plm.local/q/health`  
Quarkus Dev UI (Compose dev only): `https://agent-plm.local/q/dev-ui`  
Seasons API: `https://agent-plm.local/api/seasons`  
UI: `https://agent-plm.local/seasons`

Direct localhost fallback: `http://localhost:3000`, `http://localhost:8080/api/seasons`

## Notes

- Redis/Valkey is not the system of record.
- Authelia and Cerbos are started in Compose; login and real policies come in later phases.
- Local gateway: **https://agent-plm.local** (Traefik + mkcert). Run `make gateway-certs` before `make dev`.
- Local web dev uses `Dockerfile.dev` with bind mounts and skips production `next build`; production image uses `apps/web/nextjs/Dockerfile`.
- Local API dev uses `apps/api/quarkus/Dockerfile.dev` (`quarkus:dev`) via `docker-compose.dev.yml`; production image uses `apps/api/quarkus/Dockerfile`.
- PostgreSQL 19 from the spec is not used yet; Compose uses `pgvector/pgvector:pg18`.
- Upgrading from an older Compose Postgres volume: run `make postgres-volume-reset` once (destroys local DB data), then `make dev`. PG 18+ uses volume `postgres-data-18` mounted at `/var/lib/postgresql`.
