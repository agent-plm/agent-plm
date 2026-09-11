# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /repo
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/web/nextjs/package.json apps/web/nextjs/package.json
COPY sdk/typescript/package.json sdk/typescript/package.json
COPY packages/core-schema/package.json packages/core-schema/package.json
COPY packages/semantic-model/package.json packages/semantic-model/package.json
COPY packages/ui-extension-sdk/package.json packages/ui-extension-sdk/package.json
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @agent-plm/web...

FROM deps AS build
COPY apps/web/nextjs apps/web/nextjs
COPY sdk/typescript sdk/typescript
COPY packages packages
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=true
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    --mount=type=cache,id=next-cache,target=/repo/apps/web/nextjs/.next/cache \
    pnpm --filter @agent-plm/web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN adduser -D -u 1001 nextjs
COPY --from=build --chown=nextjs:nextjs /repo/apps/web/nextjs/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /repo/apps/web/nextjs/.next/static ./apps/web/nextjs/.next/static
COPY --from=build --chown=nextjs:nextjs /repo/apps/web/nextjs/public ./apps/web/nextjs/public
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/web/nextjs/server.js"]
