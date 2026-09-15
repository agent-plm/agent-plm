# Traefik gateway

Local HTTPS reverse proxy for Docker Compose. Used by `docker-compose.yml`.

- Static config: `traefik.yml`
- TLS certs: `../gateway/tls/` (generated via `make gateway-certs` with mkcert)
- Routes: file provider in `dynamic/routes.yml` (Compose service hostnames)

Entrypoints: `80` redirects to `443`. No Docker socket required.
