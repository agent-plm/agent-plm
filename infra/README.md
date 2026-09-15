# Infrastructure

Compose service configuration for PostgreSQL, RustFS, Valkey, Authelia, Cerbos, Traefik, and the Quarkus/Next.js apps.

## Local gateway

Traefik terminates TLS on `https://agent-plm.local` and routes by path:

| Path | Service |
| --- | --- |
| `/` | Next.js web |
| `/api/*`, `/q/*` | Quarkus API |
| `/authelia/*` | Authelia |
| `/cerbos/*` | Cerbos HTTP API |
| `/rustfs/*` | RustFS console |

Setup:

```bash
mkcert -install                          # once per machine
echo "127.0.0.1 agent-plm.local" | sudo tee -a /etc/hosts
make gateway-certs                       # once per clone
make dev
```

Config: `infra/traefik/` (`dynamic/routes.yml` for path routing). TLS certs (gitignored): `infra/gateway/tls/`.

Direct localhost ports (`8080`, `3000`, etc.) remain available as fallback during transition.
