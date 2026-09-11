# PLM Entity Reference

## Naming Map

Substitute `{Entity}`, `{entity}`, `{entities}` throughout:

| Concept | Pattern | Season example |
|---------|---------|----------------|
| PascalCase name | `{Entity}` | `Season` |
| camelCase variable | `{entity}` | `season` |
| snake_case SQL | `{entity_snake}` | `season` |
| plural REST/UI | `{entities}` | `seasons` |
| Module artifact | `plm-module-{entity}` | `plm-module-season` |
| Domain package | `io.agentplm.modules.{entity}` | `io.agentplm.modules.season` |
| API package | `io.agentplm.api.{entity}` | `io.agentplm.api.season` |

## Entity Type UUID Allocation

Add to `kernel/entity/src/main/java/io/agentplm/kernel/entity/EntityTypes.java`:

```java
public static final UUID SEASON = UUID.fromString("11111111-1111-1111-1111-111111111111");
public static final UUID PRODUCT = UUID.fromString("22222222-2222-2222-2222-222222222222");
// Material = 33333333-..., Supplier = 44444444-..., etc.
```

Use the same UUID in the Flyway `INSERT INTO entity_type`.

## Migration Template

File: `migrations/V{N}__{entity_snake}.sql` (duplicate to `apps/api/quarkus/src/main/resources/db/migration/`)

```sql
-- Add {Entity} entity type (skip INSERT if entity_type row already planned elsewhere)
INSERT INTO entity_type (id, name, display_name, description)
VALUES (
    '{UUID}',
    '{Entity}',
    '{Entity}',
    '{One-line description from PLM_SPEC}'
);

CREATE TABLE {entity_snake} (
    id UUID PRIMARY KEY REFERENCES entity (id) ON DELETE CASCADE,
    -- type-specific columns
    CONSTRAINT {entity_snake}_{field}_unique UNIQUE ({unique_field})
    -- optional CHECK constraints
);
```

V2 already created `entity`, `entity_type`, and `audit_event`. Later migrations only add type rows + extension tables.

## Domain Module Template

### `{Entity}Draft.java`

```java
public record {Entity}Draft(
        String name,
        String description,
        // type-specific fields
        {Entity}Status status) {}
```

### `{Entity}Rules.java`

```java
public final class {Entity}Rules {
    public static {Entity}Draft normalize({Entity}Draft draft) { /* trim, defaults */ }
    public static void validate({Entity}Draft draft) { /* throw {Entity}ValidationException */ }
}
```

### `{Entity}ValidationException.java`

```java
public class {Entity}ValidationException extends RuntimeException {
    public {Entity}ValidationException(String message) { super(message); }
}
```

## API Templates

### `{Entity}Record.java`

```java
@Entity
@Table(name = "{entity_snake}")
public class {Entity}Record {
    @Id
    public UUID id;
    // columns matching migration
}
```

### `{Entity}RecordRepository.java`

```java
@ApplicationScoped
public class {Entity}RecordRepository implements PanacheRepositoryBase<{Entity}Record, UUID> {
    public Optional<{Entity}Record> findBy{UniqueField}({Type} {uniqueField}) {
        return find("{uniqueField}", {uniqueField}).firstResultOptional();
    }
    public List<{Entity}Record> listAllOrdered() {
        return list("order by {sortField}");
    }
}
```

### `{Entity}Request.java` / `{Entity}Response.java`

Request: validation annotations + optional `Long version`.
Response: all fields + `UUID id`, `Long version`, `OffsetDateTime createdAt/updatedAt`.

### `{Entity}Resource.java`

```java
@Path("/api/{entities}")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class {Entity}Resource {
    @GET public List<{Entity}Response> list() { ... }
    @GET @Path("/{id}") public {Entity}Response get(@PathParam("id") UUID id) { ... }
    @POST public Response create(@Valid {Entity}Request request) { ... }  // 201
    @PUT @Path("/{id}") public {Entity}Response update(...) { ... }
    @DELETE @Path("/{id}") public Response archive(...) { ... }  // 204
}
```

### Audit snapshot

Keep snapshots small — id, name, key business fields, status, version:

```java
private void audit(String operation, UUID entityId, {Entity}Response before, {Entity}Response after) {
    AuditEvent event = new AuditEvent();
    event.id = UUID.randomUUID();
    event.occurredAt = OffsetDateTime.now();
    event.operation = operation;
    event.entityId = entityId;
    event.entityType = "{Entity}";
    event.beforeState = snapshot(before);
    event.afterState = snapshot(after);
    event.source = "api";
    auditEvents.persist(event);
}
```

## Frontend Templates

### `lib/{entities}.ts`

```typescript
export type {Entity}Status = "DRAFT" | "ACTIVE" | "CLOSED"; // adjust per entity

export type {Entity} = {
  id: string;
  name: string;
  // ...
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type {Entity}Input = { /* editable fields */ version?: number };

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
// request<T>(), list{Entities}(), get{Entity}(), create{Entity}(), update{Entity}(), archive{Entity}()
```

### Page routes

```
app/{entities}/page.tsx          → list
app/{entities}/new/page.tsx      → create (SeasonForm + create{Entity})
app/{entities}/[id]/page.tsx     → edit (load server-side, SeasonForm + update{Entity}, archive button)
```

## Maven Checklist

1. `modules/{entity}/pom.xml` — parent `plm-modules`, artifact `plm-module-{entity}`
2. `modules/pom.xml` — `<module>{entity}</module>` if new
3. `apps/api/quarkus/pom.xml` — dependency on `plm-module-{entity}`

## Shared Infrastructure (do not recreate)

| Component | Location |
|-----------|----------|
| Universal entity row | `api.persistence.PlmEntity` |
| Audit log | `api.persistence.AuditEvent` |
| 404 mapper | `api.NotFoundExceptionMapper` |
| 409 mapper | `api.ConflictExceptionMapper` |
| App shell | `components/AppShell.tsx` |
