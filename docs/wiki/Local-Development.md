# Local Development

## Prerequisites

- JDK 25
- Node.js 22 and pnpm 10
- Docker Compose
- [mkcert](https://github.com/FiloSottile/mkcert)

```bash
cp .env.example .env
mkcert -install
echo "127.0.0.1 agent-plm.local" | sudo tee -a /etc/hosts
make gateway-certs   # once, for HTTPS gateway certs
make dev             # full stack
```

## Endpoints

| Service | URL |
| --- | --- |
| UI | https://agent-plm.local |
| Seasons UI | https://agent-plm.local/seasons |
| API health | https://agent-plm.local/api/health |
| Quarkus Dev UI | https://agent-plm.local/q/dev-ui (Compose dev mode only) |
| Seasons API | https://agent-plm.local/api/seasons |
| Authelia | https://agent-plm.local/authelia |
| Cerbos | https://agent-plm.local/cerbos |
| RustFS console | https://agent-plm.local/rustfs |

Direct localhost fallback (optional): `http://localhost:3000`, `http://localhost:8080/api/seasons`

## Common commands

```bash
make down             # stop Compose
make test             # Maven verify + Next.js lint/build
./mvnw verify         # backend only
pnpm --filter @agent-plm/web dev   # UI outside Docker (optional)
```

## Infrastructure

Compose services: PostgreSQL (pgvector), RustFS, Valkey, Authelia, Cerbos, Traefik, Quarkus API, Next.js web. Configuration lives under `infra/`. See [[Infrastructure]].

## Notes

- Valkey is not the system of record.
- Authelia and Cerbos start in Compose; full login flows arrive in later phases.
- Web dev uses `Dockerfile.dev` with bind mounts; production uses `apps/web/nextjs/Dockerfile`.
