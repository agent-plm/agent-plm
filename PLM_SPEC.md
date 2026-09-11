# AI-Native PLM Platform — Engineering Specification

**Status:** Initial implementation specification  
**Version:** 0.1  
**Purpose:** Starting specification for a coding agent  
**Repository model:** Monorepo + Docker Compose  
**Primary implementation language:** Java  
**Frontend:** Next.js + TypeScript

---

## 1. Product Goal

Build an open-source, AI-native Product Lifecycle Management (PLM) platform.

The platform must work as a complete PLM out of the box while allowing administrators and developers to extend the data model, workflows, semantic model, UI, integrations, and AI capabilities.

Core principle:

> **Opinionated PLM product + extensible platform.**

The system must not require users to design a generic entity platform before they can use PLM.

The initial product should provide common PLM concepts such as:

- Product
- Product Style
- SKU
- Category
- Classification
- Color
- Size
- Season
- Collection
- Line Plan
- Assortment
- Material
- Specification
- Measurement
- Sample
- Development Request
- BOM
- BOM Line
- Supplier
- Vendor
- Factory
- Document
- Attachment
- Image / Asset
- Workflow
- Lifecycle
- Comment
- Audit

Industry-specific concepts should be delivered through extension packages where appropriate.

---

# 2. Non-Goals for v0.1

Do not introduce unnecessary distributed infrastructure.

Do NOT initially require:

- Kubernetes
- Kafka / Redpanda
- Elasticsearch / OpenSearch
- Neo4j
- Dedicated vector database
- Dedicated RDF database
- Dedicated workflow microservice
- Microservice decomposition of Metadata/Semantic/Ontology/Graph
- Multi-tenancy
- Complex distributed event architecture

The architecture must allow these to be introduced later without redesigning the domain model.

---

# 3. High-Level Architecture

```text
                         ┌──────────────────────┐
                         │      Next.js UI      │
                         │   TypeScript + UI    │
                         └──────────┬───────────┘
                                    │
                              REST / MCP
                                    │
                         ┌──────────▼───────────┐
                         │     Quarkus PLM      │
                         │        Kernel        │
                         │                      │
                         │ Entity               │
                         │ Metadata             │
                         │ Relationship         │
                         │ Search               │
                         │ Semantic             │
                         │ Ontology             │
                         │ Graph                 │
                         │ Workflow              │
                         │ Audit                 │
                         │ AI                    │
                         │ MCP                   │
                         │ Extension Runtime     │
                         └──────┬───────┬────────┘
                                │       │
                        ┌───────▼───┐   └───────▼──────┐
                        │PostgreSQL │                  │
                        │19         │               Cerbos
                        │           │               AuthZ
                        │JSONB      │
                        │FTS        │
                        │Vector     │
                        │Graph      │
                        │Queue      │
                        └─────┬─────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
              ┌──▼───┐    ┌───▼──┐    ┌──▼────────┐
              │RustFS │    │Redis │    │  Workers  │
              └──────┘    └──────┘    └───────────┘

                         Authelia
                    Authentication / OIDC
```

---

# 4. Architectural Principle

Use:

> **One logical platform, many capabilities, few deployment units.**

The system should initially be a **modular monolith**.

Modules must have clear boundaries so that a module can later be extracted into a service if required.

Metadata, Semantic, Ontology, Graph, Workflow, AI, etc. are **logical modules**, not separate Docker services in v0.1.

---

# 5. Technology Stack

## Backend

- Java 25
- Quarkus
- RESTEasy Reactive / Quarkus REST
- Hibernate ORM / Panache where appropriate
- PostgreSQL JDBC
- Flyway
- Bean Validation
- OpenTelemetry

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand where client state is required
- Geist font preferred, with Inter fallback

## Infrastructure

- PostgreSQL 19
- pgvector
- PostgreSQL Full Text Search
- PostgreSQL JSONB
- PostgreSQL SQL/PGQ graph capabilities where available
- RustFS / S3-compatible object storage
- Redis or Valkey
- Authelia
- Cerbos
- Nginx for production edge/reverse proxy
- Docker Compose

## Workflow

Initial implementation:

- PostgreSQL-backed workflow state machine
- Workflow abstraction must allow future Temporal or Camunda implementation

Do not implement a custom durable workflow engine.

## AI

AI provider must be abstracted behind an internal interface.

Do not allow an LLM to directly execute SQL or mutate the database.

---

# 6. Repository Structure

Use a monorepo.

```text
plm/
├── apps/
│   ├── api/
│   │   └── quarkus/
│   └── web/
│       └── nextjs/
│
├── kernel/
│   ├── entity/
│   ├── metadata/
│   ├── relationship/
│   ├── search/
│   ├── semantic/
│   ├── ontology/
│   ├── graph/
│   ├── workflow/
│   ├── audit/
│   ├── document/
│   ├── authorization/
│   ├── ai/
│   └── extension/
│
├── modules/
│   ├── product/
│   ├── material/
│   ├── supplier/
│   ├── season/
│   ├── collection/
│   ├── sample/
│   ├── bom/
│   └── specification/
│
├── extensions/
│   ├── apparel/
│   ├── footwear/
│   ├── cpg/
│   └── sustainability/
│
├── sdk/
│   ├── java/
│   └── typescript/
│
├── packages/
│   ├── core-schema/
│   ├── semantic-model/
│   └── ui-extension-sdk/
│
├── schemas/
│   ├── core/
│   └── extensions/
│
├── policies/
│   └── cerbos/
│
├── infra/
│   ├── postgres/
│   ├── rustfs/
│   ├── authelia/
│   ├── cerbos/
│   ├── redis/
│   └── nginx/
│
├── migrations/
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Makefile
├── README.md
└── SPEC.md
```

The exact Maven/Gradle multi-module structure is implementation-specific, but module boundaries must remain explicit.

---

# 7. Universal Entity Model

The platform must have a universal entity identity.

All business entities use:

```text
Entity
├── id
├── entity_type
├── name
├── description
├── status
├── attributes
├── created_by
├── created_at
├── updated_by
├── updated_at
└── version
```

Use UUID identifiers.

Recommended PostgreSQL table:

```sql
entity
---------
id UUID PRIMARY KEY
entity_type_id UUID NOT NULL
name TEXT
description TEXT
status TEXT
attributes JSONB NOT NULL DEFAULT '{}'
created_by UUID
created_at TIMESTAMPTZ NOT NULL
updated_by UUID
updated_at TIMESTAMPTZ NOT NULL
version BIGINT NOT NULL DEFAULT 1
```

Core static attributes should remain relational.

Domain-specific attributes should be dynamic JSONB.

Do not use pure EAV as the primary entity storage model.

---

# 8. Entity Types

Entity types define the metadata/schema for entities.

```text
entity_type
-----------
id
name
display_name
description
parent_entity_type_id
status
metadata JSONB
created_by
created_at
updated_by
updated_at
version
```

Entity types support inheritance.

Example:

```text
Product
  ├── Apparel Product
  │      ├── Shirt
  │      └── Jacket
  │
  └── Footwear Product
         ├── Shoe
         └── Boot
```

Effective schema:

```text
effective attributes =
    inherited attributes
    +
    local attributes
```

Inheritance must be deterministic and version-aware.

---

# 9. Dynamic Attributes

Attributes must support:

- add
- remove
- rename
- datatype change
- required/optional
- default value
- enum
- multi-value
- validation
- calculated attributes
- subtype/category applicability
- semantic mapping

Attribute definition:

```text
attribute_definition
--------------------
id
entity_type_id
attribute_key
display_name
description
data_type
is_required
is_multi_value
default_value JSONB
validation_rules JSONB
calculation_definition JSONB
semantic_concept_id
status
created_by
created_at
updated_by
updated_at
version
```

Supported data types should include at least:

```text
STRING
INTEGER
DECIMAL
BOOLEAN
DATE
DATETIME
ENUM
REFERENCE
MULTI_REFERENCE
JSON
```

Additional types can be added later.

---

# 10. Schema Versioning

Schema changes must be versioned.

Required lifecycle:

```text
DRAFT
  ↓
VALIDATED
  ↓
PENDING_APPROVAL
  ↓
APPROVED
  ↓
MIGRATING
  ↓
ACTIVE
```

Failure:

```text
MIGRATING
   ↓
FAILED
   ↓
ROLLBACK / REMEDIATION
```

Hard migration is required.

Do not allow a datatype change to leave old and new interpretations mixed indefinitely.

Example:

```text
DECIMAL → INTEGER
```

must:

1. Identify affected records.
2. Validate convertibility.
3. Generate migration plan.
4. Apply migration.
5. Verify data.
6. Activate new schema version.

Schema changes must be auditable.

---

# 11. Relationships

Relationships are first-class.

```text
relationship_type
-----------------
id
name
display_name
source_entity_type_id
target_entity_type_id
cardinality
inverse_relationship_name
attributes_schema JSONB
semantic_concept_id
status
version
```

Instances:

```text
entity_relationship
-------------------
id
relationship_type_id
source_entity_id
target_entity_id
attributes JSONB
status
created_by
created_at
updated_at
```

Relationships may have their own attributes.

Example:

```text
Product
   │
   └── USES ──► Material
                 │
                 ├── quantity
                 ├── unit
                 ├── placement
                 └── percentage
```

This relationship model is also the basis for the knowledge graph.

---

# 12. PostgreSQL Responsibilities

PostgreSQL is the primary system of record.

Use PostgreSQL for:

- transactional PLM data
- metadata
- schema versions
- relationships
- audit
- workflow state
- full-text search
- vector search
- graph representation
- queue/job state

Do not introduce a second database without a concrete requirement.

---

# 13. Vector Search

Use pgvector.

Use embeddings for:

- semantic product search
- document search
- knowledge search
- similar products
- similar materials
- AI retrieval

Embedding records should be associated with universal entity/document identifiers.

The embedding subsystem must be asynchronous.

Example:

```text
Entity changed
    ↓
Postgres transaction
    ↓
Job created
    ↓
Worker
    ↓
Embedding provider
    ↓
pgvector
```

Do not block normal entity writes on embedding generation.

---

# 14. Full Text Search

Use PostgreSQL Full Text Search initially.

Provide a search abstraction:

```text
SearchService
├── keywordSearch()
├── semanticSearch()
├── hybridSearch()
└── suggest()
```

The application must not depend directly on PostgreSQL-specific search APIs outside the search module.

OpenSearch may be introduced later.

---

# 15. Graph

Use PostgreSQL relationships as the operational graph.

Where supported, use PostgreSQL 19 SQL/PGQ capabilities.

Provide a graph abstraction:

```text
GraphService
├── neighbors()
├── traverse()
├── shortestPath()
├── relatedEntities()
└── subgraph()
```

Do not introduce Neo4j initially.

A dedicated graph database may be introduced later if workload or algorithms justify it.

---

# 16. Semantic Layer

Semantic Layer answers:

> What does this business concept mean?

Example:

```text
Attribute:
waterproof_rating

Semantic concept:
WaterResistanceRating

Synonyms:
- waterproofness
- water resistance
- WP rating
```

Semantic concepts should support:

- canonical business term
- description
- synonyms
- aliases
- units
- classifications
- semantic mappings
- relationships
- ontology references

Metadata attributes may reference semantic concepts:

```text
attribute_definition.semantic_concept_id
```

---

# 17. Ontology Layer

Ontology answers:

> How are concepts formally related?

Represent an RDF/OWL-compatible conceptual model without requiring an RDF database initially.

Core model:

```text
Ontology
OntologyClass
OntologyProperty
OntologyRelation
OntologyRestriction
OntologyAnnotation
```

Example:

```text
Product
  └── hasProperty
          └── WaterResistanceRating
                    └── subclass of PerformanceProperty
```

Provide future export/import compatibility with RDF/OWL.

Do not force operational PLM data into RDF triples.

Operational model:

```text
PostgreSQL entity/relationship model
```

Semantic/ontology model:

```text
conceptual semantic model
```

Knowledge graph:

```text
actual entity relationships
```

Keep these concerns distinct.

---

# 18. Knowledge Graph

The knowledge graph is the instance-level relationship model.

Example:

```text
Trail Runner X1
   ├── uses → Gore-Tex
   ├── belongs_to → FW26
   ├── manufactured_by → Factory A
   ├── has_sample → Sample 102
   └── has_material → Material 201
```

AI should be able to query:

- direct relationships
- multi-hop relationships
- related entities
- relationship attributes
- semantic concepts
- ontology context

---

# 19. Workflow

Do not make Workflow a separate microservice initially.

Implement a workflow module inside Quarkus.

PostgreSQL stores:

```text
workflow_definition
workflow_version
workflow_instance
workflow_task
workflow_transition
workflow_assignment
workflow_history
workflow_variable
```

Initial workflow engine should support:

```text
START
SUBMIT
APPROVE
REJECT
ASSIGN
COMPLETE
CANCEL
ESCALATE
```

The workflow engine must expose an interface:

```java
interface WorkflowEngine {
    WorkflowInstance start(...);
    void transition(...);
    void assign(...);
    void complete(...);
    WorkflowState getState(...);
}
```

Initial implementation:

```text
PostgresWorkflowEngine
```

Future implementations may include:

```text
TemporalWorkflowEngine
CamundaWorkflowEngine
```

Do not build distributed workflow durability features into the initial implementation.

---

# 20. Queue / Jobs

Initially use PostgreSQL-backed jobs.

Use row locking / SKIP LOCKED where appropriate.

Job model:

```text
job
---
id
job_type
status
payload JSONB
priority
scheduled_at
locked_at
worker_id
attempt_count
last_error
created_at
updated_at
```

Use jobs for:

- embeddings
- document processing
- search indexing
- graph projection
- notifications
- integrations
- asynchronous AI tasks

Redis must not be the source of truth for jobs.

Kafka/Redpanda can be introduced later if required.

---

# 21. Object Storage

Use RustFS with an S3-compatible API.

Store:

- documents
- images
- attachments
- technical packs
- PDFs
- large binary assets

PostgreSQL stores metadata and object references.

Example:

```text
document
--------
id
filename
content_type
size
bucket
object_key
checksum
metadata JSONB
```

The application must access objects through an abstraction, not directly through RustFS-specific APIs.

---

# 22. Authentication

Use Authelia for authentication.

Responsibilities:

- login
- OIDC
- SSO
- MFA
- identity/session boundary

Do not put business authorization rules in Authelia.

---

# 23. Authorization

Use Cerbos as the authorization decision point.

Responsibilities:

- resource-level permissions
- action-level permissions
- role/policy evaluation
- contextual authorization

Example:

```text
Can:
  principal = user123
  action = edit_bom
  resource = Product/P123
  context = FW26
```

Cerbos returns:

```text
ALLOW
```

or:

```text
DENY
```

Quarkus owns the application authorization integration.

Authorization must be deny-by-default.

---

# 24. API Architecture

Expose capabilities rather than database CRUD directly.

Preferred capability APIs:

```text
Entity
Metadata
Relationship
Search
Graph
Semantic
Ontology
Workflow
Document
AI
```

Example:

```text
GET /api/entities/{id}
POST /api/entities
PATCH /api/entities/{id}

GET /api/entity-types/{id}
GET /api/entities/{id}/relationships
POST /api/search

GET /api/graph/{id}
GET /api/semantic/concepts/{id}
GET /api/ontology/classes/{id}

POST /api/workflows/{id}/transition
```

The exact URL design may evolve.

The important rule is:

> REST, MCP, UI, SDK and plugins must invoke the same domain capabilities.

Do not create a second implementation for MCP.

---

# 25. MCP

MCP is an interface to PLM capabilities.

Initial read-heavy tools:

```text
search_entities
get_entity
get_entities
get_schema
get_relationships
find_related_entities
query_attributes
get_bom
get_product_context
semantic_search
graph_traverse
get_workflow_state
get_documents
```

Writes should be restricted.

Potential write tools:

```text
create_entity
update_entity
create_relationship
submit_workflow
```

Schema modification tools must be controlled and should normally create proposals rather than immediately mutate production schema.

Never expose raw SQL execution as an MCP tool.

---

# 26. AI Architecture

AI should be read-heavy.

Do not build a chatbot-only interface.

AI capabilities:

```text
AI Query Agent
AI Schema Agent
AI Governance Agent
```

## AI Query Agent

Can:

- search
- retrieve entities
- traverse relationships
- inspect schemas
- compare products
- summarize documents
- answer contextual questions

## AI Schema Agent

Can propose:

- new entity types
- new attributes
- renamed attributes
- semantic mappings
- relationship definitions

Schema mutations require validation and appropriate approval.

## AI Governance Agent

Checks:

- duplicate attributes
- semantic conflicts
- invalid types
- naming inconsistencies
- inheritance conflicts
- relationship conflicts
- schema migration impact

---

# 27. UI

Use Next.js + TypeScript.

Visual direction:

- modern SaaS
- restrained typography
- compact sidebar
- subtle borders
- low visual noise
- dense but readable tables
- minimal shadows
- keyboard-friendly
- contextual AI
- command palette
- saved views

Use:

- Tailwind
- shadcn/ui
- Geist
- TanStack Query
- Zustand

The frontend should be metadata-driven.

Do not hardcode every dynamic PLM attribute into React components.

---

# 28. Dynamic Table Requirements

Tables are a first-class UI capability.

Support:

- add/remove columns
- reorder columns
- resize columns
- sort
- filter
- inline edit
- multi-select
- bulk operations
- pagination
- column visibility
- saved views
- export
- keyboard navigation
- natural-language filtering where practical

Table definitions should be metadata-driven.

Example:

```text
View
├── entity_type
├── columns
├── filters
├── sorting
├── grouping
├── visibility
└── permissions
```

---

# 29. Product Detail UI

Product pages should have:

```text
Product Style
Status

Overview
BOM
Materials
Samples
Specifications
Timeline
Relationships
Documents
```

Dynamic sections should be generated from metadata.

Contextual AI should know:

- current entity
- current user
- permissions
- schema
- relationships
- workflow state

Example actions:

```text
What changed recently?
Why is this product delayed?
Show related materials.
Compare with last season.
Show BOM issues.
```

---

# 30. Extension Architecture

The platform must support extensions.

Extension types:

### 1. Configuration

No-code metadata.

### 2. Declarative Schema Package

YAML/JSON metadata package.

### 3. Runtime Plugin

Backend logic.

### 4. SDK Extension

Developer-written integrations and functionality.

Example:

```yaml
id: plm-footwear
name: Footwear PLM Extension
version: 1.0.0

requires:
  plm-core: ">=1.0.0"

contributes:
  schema:
    - footwear-schema.yaml

  backend:
    - footwear-plugin.jar

  ui:
    - footwear-ui

  ai_tools:
    - analyze_footwear_spec
```

Plugin lifecycle:

```text
INSTALL
  ↓
VALIDATE
  ↓
REGISTER SCHEMA
  ↓
RUN MIGRATIONS
  ↓
ENABLE
  ↓
ACTIVE
```

Uninstallation must check dependencies and preserve/archival extension-owned data.

Plugins must not access the database directly.

Plugins interact through stable extension APIs.

---

# 31. Core vs Extensions

Core must be a complete PLM.

Core domain concepts are permanent first-class concepts.

Industry-specific capabilities should generally be extensions.

Examples:

```text
Core
├── Product
├── Material
├── Supplier
├── Season
├── Sample
├── BOM
└── Specification

Apparel Extension
├── Garment Construction
├── Fit
├── Size Grading
└── Tech Pack

Footwear Extension
├── Last
├── Upper
├── Sole
└── Construction

CPG Extension
├── Formula
├── Ingredient
├── Packaging
└── Regulatory

Sustainability Extension
├── Carbon Footprint
├── Certification
└── Compliance
```

Core schema must itself use the same metadata APIs available to extensions.

There must not be a privileged "core-only" schema mechanism.

---

# 32. SDK

Provide stable APIs for:

```text
Entity
Metadata
Relationship
Query
Search
Event
Workflow
Document
Semantic
Ontology
AI Tool
Extension
```

Plugins must not know whether storage uses:

- JSONB
- PostgreSQL
- pgvector
- SQL/PGQ
- RustFS
- Redis

Storage is an implementation detail.

---

# 33. Audit

Enterprise auditability is mandatory.

Track:

- entity creation
- entity update
- entity deletion/archive
- relationship changes
- schema changes
- workflow transitions
- permission changes
- extension installation
- extension changes
- AI-proposed changes
- approved/rejected changes

Audit records should include:

```text
actor
timestamp
operation
entity
before
after
correlation_id
source
reason
```

Schema changes must have explicit version history.

---

# 34. Data Integrity Rules

The system must enforce:

1. Every entity has a universal ID.
2. Every entity has an entity type.
3. Dynamic attributes must conform to the effective schema.
4. Required attributes cannot be omitted.
5. Reference attributes must point to valid entities.
6. Relationship endpoints must conform to relationship type.
7. Authorization must be evaluated before protected mutations.
8. Schema changes must be versioned.
9. Workflow transitions must be validated.
10. Audit records must be immutable.
11. AI cannot bypass domain validation.
12. AI cannot bypass authorization.

---

# 35. Database Rules

Do:

- use PostgreSQL transactions
- use constraints where practical
- use indexes deliberately
- use JSONB for dynamic attributes
- use relational columns for core static fields
- use relationship tables for graph structure
- use migrations
- use optimistic versioning

Do not:

- use pure EAV
- use MongoDB just for dynamic attributes
- create one table per dynamic attribute
- store large files in PostgreSQL
- allow arbitrary SQL from AI/MCP
- make Redis authoritative

---

# 36. Deployment

## Development

Docker Compose should start the entire platform.

Expected command:

```bash
make dev
```

Expected services:

```text
postgres
rustfs
redis
authelia
cerbos
api
web
```

Nginx may be optional in local development.

## Production

Target:

```text
Internet / Enterprise Network
        ↓
      Nginx
        ↓
     Next.js
        ↓
     Quarkus
        ↓
 ┌──────┼────────┐
 ▼      ▼        ▼
Postgres RustFS  Redis
        │
      Cerbos
        │
    Authelia
```

Production deployment may later move from Compose to Kubernetes.

---

# 37. Configuration

Use environment variables for:

- database connection
- object storage
- Redis
- OIDC
- Cerbos
- AI provider
- embedding provider
- application URLs
- secrets

Never commit credentials.

Provide:

```text
.env.example
```

---

# 38. Observability

Provide:

- structured logging
- correlation IDs
- request IDs
- metrics
- traces
- health endpoints
- readiness endpoint
- liveness endpoint

Use OpenTelemetry-compatible instrumentation.

Important metrics:

```text
HTTP latency
DB latency
search latency
AI latency
workflow task latency
job queue depth
job failures
embedding failures
authorization denials
```

---

# 39. Testing

Minimum test layers:

```text
Unit tests
Integration tests
API tests
Database migration tests
Authorization tests
Workflow tests
Metadata/schema tests
Extension tests
MCP tool tests
Frontend component tests
```

Critical invariants must have automated tests.

Especially test:

- inherited metadata
- schema migration
- invalid dynamic attributes
- relationship cardinality
- authorization
- workflow transitions
- audit
- AI tool authorization

---

# 40. Initial Implementation Phases

## Phase 1 — Platform Skeleton

Implement:

- monorepo
- Docker Compose
- PostgreSQL
- RustFS
- Redis/Valkey
- Authelia
- Cerbos
- Quarkus
- Next.js
- health checks
- configuration
- Flyway
- basic CI

## Phase 2 — Entity Kernel

Implement:

- Entity
- EntityType
- universal identity
- inheritance
- CRUD
- validation
- audit

## Phase 3 — Metadata

Implement:

- AttributeDefinition
- dynamic JSONB attributes
- effective schema
- schema versioning
- validation
- migration engine

## Phase 4 — Relationships / Graph

Implement:

- RelationshipType
- EntityRelationship
- relationship attributes
- traversal
- graph APIs
- SQL/PGQ integration where appropriate

## Phase 5 — Core PLM

Implement:

- Product
- Style
- SKU
- Material
- Supplier
- Season
- Collection
- Sample
- BOM
- Specification
- Document

All should use the same Entity/Metadata/Relationship kernel.

## Phase 6 — Search

Implement:

- PostgreSQL FTS
- pgvector
- hybrid search abstraction
- async embedding jobs

## Phase 7 — Semantic / Ontology

Implement:

- SemanticConcept
- SemanticMapping
- OntologyClass
- OntologyProperty
- ontology relationships
- RDF/OWL export model

## Phase 8 — Workflow

Implement:

- workflow definition
- workflow version
- workflow instance
- tasks
- transitions
- assignments
- history
- PostgreSQL-backed engine

Keep `WorkflowEngine` abstract.

## Phase 9 — AI / MCP

Implement:

- PLM capability APIs
- MCP server
- read-heavy AI tools
- contextual AI
- schema proposal agent
- governance agent

## Phase 10 — UI

Implement:

- application shell
- sidebar
- command palette
- entity lists
- dynamic tables
- product detail
- relationship views
- schema designer
- workflow UI
- contextual AI

## Phase 11 — Extensions

Implement:

- extension manifest
- schema packages
- plugin registry
- extension lifecycle
- SDK
- first example extension

---

# 41. Coding-Agent Rules

The coding agent must follow these rules.

### Rule 1

Do not prematurely introduce microservices.

### Rule 2

Do not introduce a new database when PostgreSQL can reasonably provide the capability.

### Rule 3

Keep domain logic independent from infrastructure.

### Rule 4

No direct database access from plugins.

### Rule 5

No direct SQL generation/execution by LLMs.

### Rule 6

All mutations go through domain services.

### Rule 7

All protected operations pass authorization.

### Rule 8

All important mutations generate audit information.

### Rule 9

Schema changes are explicit, versioned, validated and migratable.

### Rule 10

REST and MCP must share the same domain capability layer.

### Rule 11

Dynamic UI must consume metadata rather than hardcoded domain fields.

### Rule 12

Prefer a simple implementation that can later be replaced behind an interface.

---

# 42. Definition of Done for v0.1

The platform is considered minimally viable when a developer can:

1. Start the entire stack with Docker Compose.
2. Log in through Authelia.
3. Create a Product.
4. Create a custom Product attribute.
5. Validate that attribute.
6. Create a Product subtype.
7. Inherit attributes from a parent entity type.
8. Create relationships between entities.
9. Search products using full-text search.
10. Perform vector/semantic search.
11. Traverse product relationships.
12. Upload a document to RustFS.
13. Start a workflow.
14. Assign and transition workflow tasks.
15. View audit history.
16. Ask the AI about a product.
17. Ask the AI to traverse relationships.
18. Access the same capabilities through MCP.
19. Create a saved table view.
20. Add/remove/reorder table columns.
21. Install a declarative extension package.
22. Add extension-defined entity types and attributes.
23. Enforce Cerbos authorization.
24. Run automated tests.

---

# 43. Architectural Decision Summary

The following decisions are intentional:

```text
PostgreSQL       = source of truth
JSONB            = dynamic attributes
pgvector         = vector search
Postgres FTS     = full-text search
SQL/PGQ          = graph capability
Postgres jobs    = initial queue
RustFS            = object storage
Redis/Valkey     = cache/transient state
Quarkus          = PLM Kernel
Next.js          = UI
Authelia         = authentication
Cerbos           = authorization
Workflow module  = initial state machine
Temporal/Camunda = future optional workflow engine
MCP              = AI capability interface
RDF/OWL          = ontology interoperability model
Extensions       = industry-specific customization
Docker Compose   = developer appliance
```

The system should be designed so that any future infrastructure replacement happens behind a stable interface.

---

# 44. Guiding Principle

The platform should feel like a modern SaaS application to an end user, a configurable enterprise platform to an administrator, and an extensible operating platform to a developer.

The core architectural principle is:

> **Generic infrastructure, opinionated domain semantics, metadata-driven UI, AI-native capabilities, and stable extension boundaries.**
