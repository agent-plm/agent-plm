---
name: create-plm-entity
description: >-
  Scaffold a new PLM entity end-to-end (Flyway migration, Java domain module,
  Quarkus REST API, Next.js UI) using the universal entity kernel. Use when
  adding a core PLM type (Product, Material, Supplier, Collection, etc.),
  implementing a new entity feature, or when the user asks to create/build an
  entity like Seasons.
---

# Create PLM Entity

Implement a new core PLM entity by copying the **Season** reference implementation. Every entity shares the `entity` + `entity_type` kernel and adds a type-specific extension table.

## Before You Start

Gather (or infer from PLM_SPEC.md):

| Input | Example (Season) |
|-------|------------------|
| Entity name (PascalCase) | `Season` |
| Plural REST path | `/api/seasons` |
| UI route prefix | `/seasons` |
| Status enum values | `DRAFT`, `ACTIVE`, `CLOSED` |
| Type-specific fields | `code`, `calendarYear`, `startsOn`, `endsOn` |
| Unique business key | `code` |
| Archive semantics | DELETE sets status to terminal enum (Season → `CLOSED`) |

Read the Season reference files listed in [examples.md](examples.md) before writing code.

## Workflow Checklist

Copy and track progress:

```
- [ ] 1. Plan schema + allocate entity_type UUID
- [ ] 2. Flyway migration (both locations)
- [ ] 3. Domain module (modules/{entity})
- [ ] 4. EntityTypes constant (kernel/entity)
- [ ] 5. API persistence + service + resource
- [ ] 6. Wire Maven dependencies
- [ ] 7. Next.js lib + components + pages + nav
- [ ] 8. Verify (build, API smoke test, UI)
```

---

## Step 1 — Plan Schema

**Naming conventions** (see [reference.md](reference.md)):

- SQL table: `{entity_snake}` (e.g. `season`)
- Java record: `{Entity}Record` in `api.persistence`
- Module package: `io.agentplm.modules.{entity}`
- REST package: `io.agentplm.api.{entity}`

**Entity type UUID**: add a constant to `EntityTypes.java`. Use the next sequential placeholder UUID (Season = `11111111-…`, Product = `22222222-…`, Material = `33333333-…`, etc.) unless the spec defines one.

**Migration version**: next `V{N}__{description}.sql` in both:

- `migrations/`
- `apps/api/quarkus/src/main/resources/db/migration/`

Migration must:

1. `INSERT INTO entity_type` for the new type (skip if reusing V2 tables).
2. `CREATE TABLE {entity}` with `id UUID PRIMARY KEY REFERENCES entity (id) ON DELETE CASCADE`.
3. Add unique constraints and CHECK constraints for domain invariants.
4. Keep `entity` and `audit_event` unchanged (created in V2).

---

## Step 2 — Domain Module

Location: `modules/{entity}/`

Create (mirror Season):

| File | Purpose |
|------|---------|
| `{Entity}Status.java` | Enum for lifecycle states |
| `{Entity}Draft.java` | Immutable record of all editable fields |
| `{Entity}ValidationException.java` | Domain validation error |
| `{Entity}Rules.java` | `normalize()` + `validate()` |
| `{Entity}RulesTest.java` | Unit tests for rules |

Rules class responsibilities:

- Trim strings; uppercase codes if applicable.
- Default status to first draft state when null.
- Throw `{Entity}ValidationException` with clear messages.
- Keep validation **pure** — no DB or HTTP.

Add module to `modules/pom.xml` if not already listed. Artifact: `plm-module-{entity}`.

---

## Step 3 — API Layer

Location: `apps/api/quarkus/src/main/java/io/agentplm/api/`

### Persistence (`api.persistence`)

- `{Entity}Record.java` — JPA entity mapped to extension table.
- `{Entity}RecordRepository.java` — Panache repo with `findBy{UniqueKey}()` and `listAllOrdered()`.

Reuse existing: `PlmEntity`, `PlmEntityRepository`, `AuditEvent`, `AuditEventRepository`.

### REST (`api.{entity}`)

| File | Purpose |
|------|---------|
| `{Entity}Request.java` | Input DTO with `@NotBlank` on required fields, optional `version` for optimistic locking |
| `{Entity}Response.java` | Output DTO including `id`, `version`, timestamps |
| `{Entity}Service.java` | CRUD + audit |
| `{Entity}Resource.java` | JAX-RS at `/api/{entities}` |

**Service pattern** (follow `SeasonService` exactly):

1. `list()` — join extension table with `PlmEntity`, map to response.
2. `get(id)` — load both rows or throw `NotFoundException`.
3. `create(request)` — normalize → validate → check unique key → persist `PlmEntity` (with `EntityTypes.{ENTITY}`) + extension row → audit `CREATE`.
4. `update(id, request)` — optimistic lock via `version` → unique key check excluding self → update both rows → audit `UPDATE`.
5. `archive(id)` — set terminal status on `PlmEntity` → audit `ARCHIVE`. Do **not** delete rows.

Reuse shared exceptions: `ConflictException`, `NotFoundException`. Add `{Entity}ValidationExceptionMapper` in `api` package (400 + `{ "error": "..." }`).

### Maven wiring

In `apps/api/quarkus/pom.xml`:

```xml
<dependency>
  <groupId>io.agentplm</groupId>
  <artifactId>plm-module-{entity}</artifactId>
  <version>${project.version}</version>
</dependency>
```

---

## Step 4 — Next.js UI

Location: `apps/web/nextjs/src/`

| File | Purpose |
|------|---------|
| `lib/{entities}.ts` | Types, `SeasonInput`-like input type, CRUD fetch helpers |
| `components/{Entity}Form.tsx` | Create/edit form (client component) |
| `components/{Entity}List.tsx` | List with links to detail |
| `app/{entities}/page.tsx` | List page |
| `app/{entities}/new/page.tsx` | Create page |
| `app/{entities}/[id]/page.tsx` | Detail/edit page |

**API client**: copy `lib/seasons.ts` pattern. Use `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`). Parse `{ error: string }` from failed responses.

**UI conventions**:

- Wrap pages in `AppShell`.
- List page: heading, description, "New {entity}" link, `{Entity}List`.
- Form: `name`, `code` (if applicable), `description`, `status` select, type-specific fields.
- Pass `version` from `initial` on update for optimistic locking.
- Add nav link in `AppShell.tsx`.

Match existing styling: dark theme, `border-white/15`, `var(--accent)`, `var(--muted)`.

---

## Step 5 — Verify

Run in order:

```bash
# Domain tests
./mvnw -pl modules/{entity} test

# API compile + tests
./mvnw -pl apps/api/quarkus -am test

# Frontend typecheck
cd apps/web/nextjs && pnpm exec tsc --noEmit
```

Smoke test API (stack running):

```bash
curl -s http://localhost:8080/api/{entities} | jq .
curl -s -X POST http://localhost:8080/api/{entities} \
  -H 'Content-Type: application/json' \
  -d '{ ... minimal valid payload ... }' | jq .
```

Open UI at `http://localhost:3000/{entities}` — create, edit, archive.

Update `README.md` only if the user asks or the repo convention requires it for new features.

---

## Do Not

- Skip the dual Flyway migration copy.
- Put business validation in the REST layer — keep it in `{Entity}Rules`.
- Hard-delete entity rows; use archive/status transitions.
- Create a separate exception mapper per HTTP code — reuse shared mappers.
- Add auth/Cerbos integration unless explicitly requested (Phase 2+).

---

## Additional Resources

- File templates and naming table: [reference.md](reference.md)
- Season file map (canonical example): [examples.md](examples.md)
- Product spec context: `PLM_SPEC.md` Phase 5 — Core PLM
