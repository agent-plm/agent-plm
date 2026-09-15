package io.agentplm.api.persistence;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.Audited;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Temporal;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_event")
@Temporal.HistoryTable(name = "audit_event_history")
@Audited.Table(name = "audit_event_aud")
public class AuditEvent extends PlmEntity {

    public UUID actor;

    @Column(name = "occurred_at", nullable = false)
    public OffsetDateTime occurredAt;

    @Column(nullable = false)
    public String operation;

    @Column(name = "entity_id")
    public UUID entityId;

    @Column(name = "entity_type")
    public String entityType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "before_state")
    public Map<String, Object> beforeState;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "after_state")
    public Map<String, Object> afterState;

    @Column(name = "correlation_id")
    public String correlationId;

    public String source;

    public String reason;
}
