# Season — Canonical Example

Use Season as the copy source when implementing any new entity. Read these files before generating code.

## Domain Module (`modules/season/`)

| File | Notes |
|------|-------|
| `SeasonStatus.java` | Enum: DRAFT, ACTIVE, CLOSED |
| `SeasonDraft.java` | Record with name, description, code, status, calendarYear, startsOn, endsOn |
| `SeasonValidationException.java` | Simple RuntimeException subclass |
| `SeasonRules.java` | CODE regex, normalizeCode(), validate date range and calendar year |
| `SeasonRulesTest.java` | Tests for valid/invalid drafts |

## Kernel

| File | Notes |
|------|-------|
| `kernel/entity/.../EntityTypes.java` | `SEASON = 11111111-1111-1111-1111-111111111111` |

## Database

| File | Notes |
|------|-------|
| `migrations/V2__entity_and_season.sql` | entity_type INSERT + season table + constraints |
| `apps/api/quarkus/src/main/resources/db/migration/V2__entity_and_season.sql` | Same content (required duplicate) |

Season table columns: `code` (unique), `calendar_year`, `starts_on`, `ends_on`.

## API (`apps/api/quarkus/src/main/java/io/agentplm/api/`)

| File | Notes |
|------|-------|
| `persistence/SeasonRecord.java` | Extension table JPA entity |
| `persistence/SeasonRecordRepository.java` | findByCode(), listAllOrdered() |
| `season/SeasonRequest.java` | Input DTO |
| `season/SeasonResponse.java` | Output DTO |
| `season/SeasonService.java` | Full CRUD + audit + optimistic locking |
| `season/SeasonResource.java` | REST at `/api/seasons` |
| `SeasonValidationExceptionMapper.java` | Maps domain validation → 400 |

Shared (reuse as-is): `ConflictException`, `NotFoundException`, `PlmEntity`, `AuditEvent`.

## Frontend (`apps/web/nextjs/src/`)

| File | Notes |
|------|-------|
| `lib/seasons.ts` | Types + API client |
| `components/SeasonForm.tsx` | Client form with error handling |
| `components/SeasonList.tsx` | Fetches and lists seasons |
| `app/seasons/page.tsx` | List page |
| `app/seasons/new/page.tsx` | Create page |
| `app/seasons/[id]/page.tsx` | Edit + archive |
| `components/AppShell.tsx` | Nav link to `/seasons` |

## Product — Next Entity Sketch

When implementing Product (stub exists at `modules/product/`):

1. Allocate `EntityTypes.PRODUCT = 22222222-2222-2222-2222-222222222222`.
2. Migration `V3__product.sql`: entity_type row + `product` table (e.g. `style_code`, `brand`, `season_id` FK).
3. Status enum might differ (e.g. DRAFT, IN_DEVELOPMENT, RELEASED, DISCONTINUED).
4. REST: `/api/products`, UI: `/products`.
5. Follow the same service/audit/archive pattern as Season.

Adjust fields and validation to PLM_SPEC.md — the **structure** stays identical.
