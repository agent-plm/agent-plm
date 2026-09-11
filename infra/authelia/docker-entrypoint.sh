#!/bin/sh
set -e

mkdir -p /config/tls /config/runtime
cp /bootstrap/configuration.yml /config/configuration.yml
cp /bootstrap/users_database.yml /config/users_database.yml

if [ ! -f /bootstrap/tls/cert.pem ] || [ ! -f /bootstrap/tls/key.pem ]; then
  echo "Missing Authelia TLS material. Run: make authelia-certs" >&2
  exit 1
fi

cp /bootstrap/tls/cert.pem /bootstrap/tls/key.pem /config/tls/
echo "Authelia is available at https://plm.lvh.me:9091 (HTTPS required — http:// will fail)" >&2
exec authelia --config /config/configuration.yml
