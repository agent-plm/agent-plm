# Agent PLM

Open-source, AI-native Product Lifecycle Management. Opinionated PLM product plus an extensible kernel.

Specification: [PLM_SPEC.md](PLM_SPEC.md)

**Wiki:** [agent-plm/agent-plm/wiki](https://github.com/agent-plm/agent-plm/wiki) (auto-published from `main`)

**Current phase:** 2 — Seasons (CRUD UI + API on the entity kernel).

## Stack

| Layer | Choice |
| --- | --- |
| API | Java 25, Quarkus 3.39 |
| UI | Next.js, TypeScript, Tailwind CSS |
| Data | PostgreSQL 17 + pgvector (JSON, FTS, graph later) |
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

Copy environment defaults:

```bash
cp .env.example .env
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

API health: `http://localhost:8080/q/health` and `http://localhost:8080/api/health`  
Seasons API: `http://localhost:8080/api/seasons`  
UI: `http://localhost:3000/seasons`

## Notes

- Redis/Valkey is not the system of record.
- Authelia and Cerbos are started in Compose; login and real policies come in later phases.
- Authelia portal: **https://plm.lvh.me:9091** (HTTPS only; `http://` on port 9091 will fail). Run `make authelia-certs` before `make dev`.
- Local web dev uses `Dockerfile.dev` with bind mounts and skips production `next build`; production image uses `apps/web/nextjs/Dockerfile`.
- PostgreSQL 19 from the spec is not used yet; Compose uses a pgvector image on Postgres 17 until 19 is published.
