package io.agentplm.api.persistence;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.Audited;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Temporal;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = "entity")
@Temporal.HistoryTable(name = "entity_history")
@Audited.Table(name = "entity_aud")
public class EntityRecord extends PlmEntity {

    @Column(name = "entity_type_id", nullable = false)
    public UUID entityTypeId;

    @Column(nullable = false)
    public String name;

    public String description;

    @Column(nullable = false)
    public String status;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    public Map<String, Object> attributes = new HashMap<>();

    @Column(name = "created_by")
    public UUID createdBy;

    @Column(name = "created_at", nullable = false)
    public OffsetDateTime createdAt;

    @Column(name = "updated_by")
    public UUID updatedBy;

    @Column(name = "updated_at", nullable = false)
    public OffsetDateTime updatedAt;

    @Version
    public long version;
}
