package io.agentplm.api.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SeasonRecordRepository implements PanacheRepositoryBase<SeasonRecord, UUID> {

    public Optional<SeasonRecord> findByCode(String code) {
        return find("code", code).firstResultOptional();
    }

    public List<SeasonRecord> listAllOrdered() {
        return list("order by code");
    }
}
