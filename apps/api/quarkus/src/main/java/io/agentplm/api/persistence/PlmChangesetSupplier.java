package io.agentplm.api.persistence;

import org.hibernate.audit.spi.ChangelogSupplier;

public class PlmChangesetSupplier extends ChangelogSupplier<Long> {

    public PlmChangesetSupplier() {
        super(PlmChangeset.class, "id", "timestamp", "modifiedEntityNames", null);
    }
}
