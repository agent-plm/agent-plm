# Authelia (local Compose)

Authelia is exposed through the Traefik gateway at:

**https://agent-plm.local/authelia**

Architecture:

- `authelia` — HTTP internally on port 9091, served at subpath `/authelia`, OIDC issuer for the API
- `traefik` — TLS termination on `https://agent-plm.local`
- `api` — validates Bearer JWTs issued by Authelia (`quarkus-oidc`), discovers OIDC metadata via Traefik at `https://agent-plm.local/authelia` (Authelia rejects plain internal HTTP for OIDC discovery)

## Test users (local only)

| Username | Password | Groups |
| --- | --- | --- |
| `admin` | `admin` | `admins`, `dev` |
| `planner` | `planner` | `planners` |
| `viewer` | `viewer` | `viewers` |

Regenerate a password hash:

```bash
make authelia-hash PASSWORD=admin
```

## Setup

```bash
mkcert -install
echo "127.0.0.1 agent-plm.local" | sudo tee -a /etc/hosts
make gateway-certs
make authelia-oidc-keys
make dev
```

## Obtain an API access token (Postman)

1. Log in at `https://agent-plm.local/authelia` with a test user.
2. In Postman OAuth 2.0:
   - Auth URL: `https://agent-plm.local/authelia/api/oidc/authorization`
   - Token URL: `https://agent-plm.local/authelia/api/oidc/token`
   - Client ID: `plm-api`
   - Client Secret: `local-dev-plm-api-secret` (from `.env.example`)
   - Scope: `openid profile email groups`
   - Callback URL: `https://oauth.pstmn.io/v1/callback`
3. Call the API:

```bash
curl -H "Authorization: Bearer $TOKEN" https://agent-plm.local/api/seasons
curl https://agent-plm.local/api/seasons   # 401 without token
```

Next.js login wiring is a later phase. Replace all placeholder secrets before production.
