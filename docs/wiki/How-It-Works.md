# How Agent PLM Works

Agent PLM is an open-source, AI-native Product Lifecycle Management platform built as a **monorepo + Docker Compose appliance**.

## Product shape

- **Opinionated PLM product** — core concepts (Product, Season, Material, Supplier, BOM, etc.) work out of the box.
- **Extensible kernel** — entity identity, metadata, relationships, search, workflow, and authorization are shared across all types.
- **Same patterns everywhere** — every core type uses the universal entity kernel plus a type-specific extension table.

## Runtime stack

| Layer | Technology |
| --- | --- |
| API | Java 25, Quarkus 3.39, Hibernate ORM 7.4 |
| UI | Next.js, TypeScript, Tailwind CSS |
| Database | PostgreSQL + pgvector (Flyway migrations) |
| Objects | RustFS (S3-compatible) |
| Cache | Valkey |
| AuthN | Authelia (local dev) |
| AuthZ | Cerbos (policies in `policies/cerbos`) |

## Request flow (Seasons example)

1. Browser calls Next.js at `/seasons`.
2. UI fetches JSON from Quarkus at `/api/seasons`.
3. `SeasonService` validates input via `SeasonRules` in `modules/season`.
4. Service persists `EntityRecord` (kernel row) + `SeasonRecord` (extension row) with the same UUID.
5. Application `AuditEvent` rows record CREATE / UPDATE / ARCHIVE for the API operation.
6. Hibernate `@Temporal` / `@Audited` maintain history and change logs in companion tables.

## Repository layout

See [[Home]] for the directory map. Deep specification lives in [[Product-Spec]].

## Current phase

Phase 2 — **Seasons** is the first end-to-end feature (Flyway schema, domain module, REST API, Next.js UI).

Future phases add Product, Material, Supplier, auth integration, and semantic/AI capabilities per the product spec.
