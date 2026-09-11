#!/bin/sh
set -e

uid="${DOCKER_UID:-1000}"
gid="${DOCKER_GID:-1000}"

mkdir -p /repo/node_modules /repo/apps/web/nextjs/node_modules /pnpm/store /pnpm/home /pnpm/cache
chown -R "${uid}:${gid}" /repo/node_modules /repo/apps/web/nextjs/node_modules /pnpm

exec su-exec "${uid}:${gid}" env \
  HOME=/pnpm/home \
  XDG_CACHE_HOME=/pnpm/cache \
  PNPM_HOME=/pnpm \
  PATH="/pnpm:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
  NEXT_TELEMETRY_DISABLED=1 \
  /usr/local/bin/docker-dev-entrypoint.sh
