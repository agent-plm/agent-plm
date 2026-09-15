#!/bin/sh
set -e

mkdir -p /config/runtime
cp /bootstrap/configuration.yml /config/configuration.yml
cp /bootstrap/users_database.yml /config/users_database.yml

echo "Authelia is available at https://agent-plm.local/authelia" >&2
exec authelia --config /config/configuration.yml
