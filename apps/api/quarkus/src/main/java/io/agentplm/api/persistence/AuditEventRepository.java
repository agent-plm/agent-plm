package io.agentplm.api.persistence;

import java.util.UUID;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AuditEventRepository implements PanacheRepositoryBase<AuditEvent, UUID> {
}
