package io.agentplm.modules.season;

import java.time.LocalDate;

public record SeasonDraft(
        String name,
        String description,
        String code,
        SeasonStatus status,
        Integer calendarYear,
        LocalDate startsOn,
        LocalDate endsOn) {
}
