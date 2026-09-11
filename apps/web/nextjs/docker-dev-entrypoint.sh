#!/bin/sh
set -e

corepack enable

if [ ! -f node_modules/.modules.yaml ]; then
  pnpm install --frozen-lockfile --filter @agent-plm/web...
fi

cd apps/web/nextjs
exec pnpm dev --hostname 0.0.0.0 --port 3000
