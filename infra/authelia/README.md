# Authelia (local Compose)

Authelia is exposed through the Traefik gateway at:

**https://agent-plm.local/authelia**

Architecture:

- `authelia` — HTTP internally on port 9091, served at subpath `/authelia`
- `traefik` — TLS termination on `https://agent-plm.local`

Setup:

```bash
mkcert -install
echo "127.0.0.1 agent-plm.local" | sudo tee -a /etc/hosts
make gateway-certs
make dev
```

To regenerate gateway certificates:

```bash
make gateway-certs-force
```

Login wiring to the Next.js app is a later phase. Replace all placeholder secrets before production.
