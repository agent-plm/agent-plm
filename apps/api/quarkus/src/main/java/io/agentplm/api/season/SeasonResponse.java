package io.agentplm.api.season;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import io.agentplm.modules.season.SeasonStatus;

public record SeasonResponse(
        UUID id,
        String name,
        String description,
        String code,
        SeasonStatus status,
        Integer calendarYear,
        LocalDate startsOn,
        LocalDate endsOn,
        long version,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {
}
