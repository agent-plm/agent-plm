package io.agentplm.api.persistence;

import java.util.UUID;

import org.hibernate.annotations.Audited;
import org.hibernate.annotations.Temporal;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

/**
 * Base mapped superclass for all PLM JPA entities.
 * <p>
 * Provides time-ordered UUID v7 identifiers ({@link UuidGenerator.Style#VERSION_7}),
 * Hibernate 7.4 temporal history ({@link Temporal}), and audit logging ({@link Audited}).
 * Concrete entities declare {@link Temporal.HistoryTable} and {@link Audited.Table} names.
 */
@MappedSuperclass
@Temporal
@Audited
public abstract class PlmEntity {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    public UUID id;
}
