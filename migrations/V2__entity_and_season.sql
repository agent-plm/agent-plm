-- Universal identity (kernel) plus Season as the first core PLM type.
CREATE TABLE entity_type (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    parent_entity_type_id UUID REFERENCES entity_type (id),
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 1
);

INSERT INTO entity_type (id, name, display_name, description)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Season',
    'Season',
    'Retail calendar season used to plan collections and products.'
);

CREATE TABLE entity (
    id UUID PRIMARY KEY,
    entity_type_id UUID NOT NULL REFERENCES entity_type (id),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 1
);

CREATE INDEX entity_type_id_idx ON entity (entity_type_id);
CREATE INDEX entity_status_idx ON entity (status);

CREATE TABLE season (
    id UUID PRIMARY KEY REFERENCES entity (id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    calendar_year INTEGER,
    starts_on DATE,
    ends_on DATE,
    CONSTRAINT season_code_unique UNIQUE (code),
    CONSTRAINT season_dates_chk CHECK (
        starts_on IS NULL OR ends_on IS NULL OR starts_on <= ends_on
    )
);

CREATE TABLE audit_event (
    id UUID PRIMARY KEY,
    actor UUID,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    operation TEXT NOT NULL,
    entity_id UUID,
    entity_type TEXT,
    before_state JSONB,
    after_state JSONB,
    correlation_id TEXT,
    source TEXT,
    reason TEXT
);
