#!/bin/sh
set -e

mkdir -p /config/runtime

if [ ! -f /bootstrap/oidc/oidc.key ] || [ ! -f /bootstrap/oidc/oidc.crt ]; then
  echo "Missing Authelia OIDC keys. Run: make authelia-oidc-keys" >&2
  exit 1
fi

cp /bootstrap/users_database.yml /config/users_database.yml

while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in
    '@OIDC_PRIVATE_KEY@')
      sed 's/^/          /' /bootstrap/oidc/oidc.key
      ;;
    '@OIDC_CERTIFICATE@')
      sed 's/^/          /' /bootstrap/oidc/oidc.crt
      ;;
    *)
      printf '%s\n' "$line"
      ;;
  esac
done < /bootstrap/configuration.template.yml > /config/configuration.yml

echo "Authelia is available at https://agent-plm.local/authelia" >&2
exec authelia --config /config/configuration.yml
