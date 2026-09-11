package io.agentplm.api.season;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import io.agentplm.api.ConflictException;
import io.agentplm.api.NotFoundException;
import io.agentplm.api.persistence.AuditEvent;
import io.agentplm.api.persistence.AuditEventRepository;
import io.agentplm.api.persistence.PlmEntity;
import io.agentplm.api.persistence.PlmEntityRepository;
import io.agentplm.api.persistence.SeasonRecord;
import io.agentplm.api.persistence.SeasonRecordRepository;
import io.agentplm.kernel.entity.EntityTypes;
import io.agentplm.modules.season.SeasonDraft;
import io.agentplm.modules.season.SeasonRules;
import io.agentplm.modules.season.SeasonStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class SeasonService {

    @Inject
    PlmEntityRepository entities;

    @Inject
    SeasonRecordRepository seasons;

    @Inject
    AuditEventRepository auditEvents;

    public List<SeasonResponse> list() {
        List<SeasonResponse> result = new ArrayList<>();
        for (SeasonRecord season : seasons.listAllOrdered()) {
            PlmEntity entity = entities.findById(season.id);
            if (entity != null) {
                result.add(toResponse(entity, season));
            }
        }
        return result;
    }

    public SeasonResponse get(UUID id) {
        return toResponse(requireEntity(id), requireSeason(id));
    }

    @Transactional
    public SeasonResponse create(SeasonRequest request) {
        SeasonDraft draft = SeasonRules.normalize(toDraft(request));
        SeasonRules.validate(draft);
        if (seasons.findByCode(draft.code()).isPresent()) {
            throw new ConflictException("Season code already exists: " + draft.code());
        }

        OffsetDateTime now = OffsetDateTime.now();
        UUID id = UUID.randomUUID();

        PlmEntity entity = new PlmEntity();
        entity.id = id;
        entity.entityTypeId = EntityTypes.SEASON;
        entity.name = draft.name();
        entity.description = draft.description();
        entity.status = draft.status().name();
        entity.attributes = new HashMap<>();
        entity.createdAt = now;
        entity.updatedAt = now;
        entities.persist(entity);

        SeasonRecord season = new SeasonRecord();
        season.id = id;
        applySeasonFields(season, draft);
        seasons.persist(season);

        SeasonResponse created = toResponse(entity, season);
        audit("CREATE", id, null, created);
        return created;
    }

    @Transactional
    public SeasonResponse update(UUID id, SeasonRequest request) {
        SeasonDraft draft = SeasonRules.normalize(toDraft(request));
        SeasonRules.validate(draft);

        PlmEntity entity = requireEntity(id);
        SeasonRecord season = requireSeason(id);

        if (request.version() != null && request.version() != entity.version) {
            throw new ConflictException("Season was updated by another request. Reload and try again.");
        }

        seasons.findByCode(draft.code())
                .filter(existing -> !existing.id.equals(id))
                .ifPresent(existing -> {
                    throw new ConflictException("Season code already exists: " + draft.code());
                });

        SeasonResponse before = toResponse(entity, season);
        entity.name = draft.name();
        entity.description = draft.description();
        entity.status = draft.status().name();
        entity.updatedAt = OffsetDateTime.now();
        applySeasonFields(season, draft);

        SeasonResponse after = toResponse(entity, season);
        audit("UPDATE", id, before, after);
        return after;
    }

    @Transactional
    public void archive(UUID id) {
        PlmEntity entity = requireEntity(id);
        SeasonRecord season = requireSeason(id);
        SeasonResponse before = toResponse(entity, season);
        entity.status = SeasonStatus.CLOSED.name();
        entity.updatedAt = OffsetDateTime.now();
        audit("ARCHIVE", id, before, toResponse(entity, season));
    }

    private PlmEntity requireEntity(UUID id) {
        PlmEntity entity = entities.findById(id);
        if (entity == null) {
            throw new NotFoundException("Season not found.");
        }
        return entity;
    }

    private SeasonRecord requireSeason(UUID id) {
        SeasonRecord season = seasons.findById(id);
        if (season == null) {
            throw new NotFoundException("Season not found.");
        }
        return season;
    }

    private static SeasonDraft toDraft(SeasonRequest request) {
        return new SeasonDraft(
                request.name(),
                request.description(),
                request.code(),
                request.status(),
                request.calendarYear(),
                request.startsOn(),
                request.endsOn());
    }

    private static void applySeasonFields(SeasonRecord season, SeasonDraft draft) {
        season.code = draft.code();
        season.calendarYear = draft.calendarYear();
        season.startsOn = draft.startsOn();
        season.endsOn = draft.endsOn();
    }

    private static SeasonResponse toResponse(PlmEntity entity, SeasonRecord season) {
        return new SeasonResponse(
                entity.id,
                entity.name,
                entity.description,
                season.code,
                SeasonStatus.valueOf(entity.status.toUpperCase(Locale.ROOT)),
                season.calendarYear,
                season.startsOn,
                season.endsOn,
                entity.version,
                entity.createdAt,
                entity.updatedAt);
    }

    private void audit(String operation, UUID entityId, SeasonResponse before, SeasonResponse after) {
        AuditEvent event = new AuditEvent();
        event.id = UUID.randomUUID();
        event.occurredAt = OffsetDateTime.now();
        event.operation = operation;
        event.entityId = entityId;
        event.entityType = "Season";
        event.beforeState = snapshot(before);
        event.afterState = snapshot(after);
        event.source = "api";
        auditEvents.persist(event);
    }

    private static Map<String, Object> snapshot(SeasonResponse season) {
        if (season == null) {
            return null;
        }
        Map<String, Object> value = new HashMap<>();
        value.put("id", season.id().toString());
        value.put("name", season.name());
        value.put("code", season.code());
        value.put("status", season.status().name());
        value.put("version", season.version());
        return value;
    }
}
