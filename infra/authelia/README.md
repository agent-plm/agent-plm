# Authelia (local Compose)

Authelia 4 requires HTTPS. Opening `http://…:9091` produces:

`tls: first record does not look like a TLS handshake`

Use this URL instead:

**https://plm.lvh.me:9091**

(`plm.lvh.me` resolves to `127.0.0.1`; accept the self-signed certificate in your browser.)

Architecture:

- `authelia` — HTTP internally on port 9091
- `authelia-gateway` — nginx TLS termination on host port 9091

Setup:

```bash
make authelia-certs
docker compose -f docker-compose.yml -f docker-compose.dev.yml up authelia authelia-gateway -d --force-recreate
```

If you previously generated certs for `127.0.0.1` only:

```bash
make authelia-certs-force
```

Login wiring to the Next.js app is a later phase. Replace all placeholder secrets before production.
