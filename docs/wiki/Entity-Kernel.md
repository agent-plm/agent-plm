# Entity Kernel

Every core PLM type shares the same identity and lifecycle columns in the `entity` table, with type-specific fields in an extension table.

## Two-table pattern

| Table | JPA type | Purpose |
| --- | --- | --- |
| `entity` | `EntityRecord` | Name, status, JSON attributes, audit columns, optimistic lock |
| `{type}` | `{Type}Record` | Business fields (e.g. season `code`, dates) |

Both rows share the same primary key (`id`). The extension table references `entity(id) ON DELETE CASCADE`.

## Base class: `PlmEntity`

All JPA persistence types extend `PlmEntity` (`@MappedSuperclass`):

- **UUID v7** — `@UuidGenerator(style = VERSION_7)` for time-ordered IDs
- **@Temporal** — row history in `{table}_history` (Hibernate 7.4)
- **@Audited** — change log in `{table}_aud` with changeset ids

Concrete entities declare `@Temporal.HistoryTable` and `@Audited.Table` names matching Flyway (`V3__temporal_and_audit_tables.sql`).

## Creating a new entity type

1. Flyway migration — `entity_type` row + extension table
2. Domain module — `{Entity}Draft`, `{Entity}Rules`, tests in `modules/{entity}`
3. API — `EntityRecord` + `{Entity}Record`, service, REST resource
4. UI — Next.js lib, form, list, pages

Season is the reference implementation. See [[How-It-Works]] and the in-repo **create-plm-entity** Cursor skill.

## Entity type IDs

Fixed UUIDs in `kernel/entity/EntityTypes.java` (e.g. `SEASON = 11111111-…`). Migrations must use the same UUID in `INSERT INTO entity_type`.
