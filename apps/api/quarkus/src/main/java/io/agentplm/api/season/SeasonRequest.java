package io.agentplm.api.season;

import java.time.LocalDate;

import io.agentplm.modules.season.SeasonStatus;
import jakarta.validation.constraints.NotBlank;

public record SeasonRequest(
        @NotBlank String name,
        String description,
        @NotBlank String code,
        SeasonStatus status,
        Integer calendarYear,
        LocalDate startsOn,
        LocalDate endsOn,
        Long version) {
}
