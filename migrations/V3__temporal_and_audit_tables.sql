-- Hibernate 7.4 @Temporal (HISTORY_TABLE) and @Audited audit log tables.
-- Changelog entity backing @Changelog / PlmChangesetSupplier.

CREATE TABLE plm_changeset (
    id BIGSERIAL PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    modified_entity_names TEXT
);

CREATE TABLE entity_history (
    id UUID NOT NULL,
    entity_type_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL,
    updated_by UUID,
    updated_at TIMESTAMPTZ NOT NULL,
    version BIGINT NOT NULL,
    effective TIMESTAMPTZ NOT NULL,
    superseded TIMESTAMPTZ,
    PRIMARY KEY (id, version)
);

CREATE TABLE entity_aud (
    id UUID NOT NULL,
    entity_type_id UUID,
    name TEXT,
    description TEXT,
    status TEXT,
    attributes JSONB,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ,
    version BIGINT,
    rev BIGINT NOT NULL,
    revtype SMALLINT NOT NULL,
    PRIMARY KEY (id, rev)
);

CREATE TABLE season_history (
    id UUID NOT NULL,
    code TEXT NOT NULL,
    calendar_year INTEGER,
    starts_on DATE,
    ends_on DATE,
    effective TIMESTAMPTZ NOT NULL,
    superseded TIMESTAMPTZ,
    PRIMARY KEY (id, effective)
);

CREATE TABLE season_aud (
    id UUID NOT NULL,
    code TEXT,
    calendar_year INTEGER,
    starts_on DATE,
    ends_on DATE,
    rev BIGINT NOT NULL,
    revtype SMALLINT NOT NULL,
    PRIMARY KEY (id, rev)
);

CREATE TABLE audit_event_history (
    id UUID NOT NULL,
    actor UUID,
    occurred_at TIMESTAMPTZ NOT NULL,
    operation TEXT NOT NULL,
    entity_id UUID,
    entity_type TEXT,
    before_state JSONB,
    after_state JSONB,
    correlation_id TEXT,
    source TEXT,
    reason TEXT,
    effective TIMESTAMPTZ NOT NULL,
    superseded TIMESTAMPTZ,
    PRIMARY KEY (id, effective)
);

CREATE TABLE audit_event_aud (
    id UUID NOT NULL,
    actor UUID,
    occurred_at TIMESTAMPTZ,
    operation TEXT,
    entity_id UUID,
    entity_type TEXT,
    before_state JSONB,
    after_state JSONB,
    correlation_id TEXT,
    source TEXT,
    reason TEXT,
    rev BIGINT NOT NULL,
    revtype SMALLINT NOT NULL,
    PRIMARY KEY (id, rev)
);
