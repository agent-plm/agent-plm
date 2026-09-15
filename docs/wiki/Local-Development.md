# Local Development

## Prerequisites

- JDK 25
- Node.js 22 and pnpm 10
- Docker Compose

```bash
cp .env.example .env
make authelia-certs   # once, for HTTPS Authelia on plm.lvh.me
make dev              # full stack
```

## Endpoints

| Service | URL |
| --- | --- |
| UI | http://localhost:3000 |
| Seasons UI | http://localhost:3000/seasons |
| API health | http://localhost:8080/api/health |
| Quarkus Dev UI | http://localhost:8080/q/dev-ui (Compose dev mode only) |
| Seasons API | http://localhost:8080/api/seasons |
| Authelia | https://plm.lvh.me:9091 (HTTPS only) |

## Common commands

```bash
make down             # stop Compose
make test             # Maven verify + Next.js lint/build
./mvnw verify         # backend only
pnpm --filter @agent-plm/web dev   # UI outside Docker (optional)
```

## Infrastructure

Compose services: PostgreSQL (pgvector), RustFS, Valkey, Authelia, Cerbos, Quarkus API, Next.js web. Configuration lives under `infra/`. See [[Infrastructure]].

## Notes

- Valkey is not the system of record.
- Authelia and Cerbos start in Compose; full login flows arrive in later phases.
- Web dev uses `Dockerfile.dev` with bind mounts; production uses `apps/web/nextjs/Dockerfile`.
