#!/bin/sh
set -e

export HOME="${HOME:-/pnpm/home}"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-/pnpm/cache}"
export PNPM_HOME="${PNPM_HOME:-/pnpm}"
export PATH="$PNPM_HOME:$PATH"

mkdir -p "$HOME" "$XDG_CACHE_HOME" /pnpm/store
pnpm config set store-dir /pnpm/store >/dev/null

if [ ! -f node_modules/.modules.yaml ]; then
  pnpm install --frozen-lockfile --filter @agent-plm/web...
fi

cd apps/web/nextjs
exec pnpm dev --hostname 0.0.0.0 --port 3000
