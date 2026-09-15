package io.agentplm.api.persistence;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import org.hibernate.annotations.Changelog;
import org.hibernate.audit.TrackingModifiedEntitiesChangelogMapping;

@Entity
@Changelog
@Table(name = "plm_changeset")
public class PlmChangeset extends TrackingModifiedEntitiesChangelogMapping {
}
