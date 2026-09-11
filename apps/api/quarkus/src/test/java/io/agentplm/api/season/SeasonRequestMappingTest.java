package io.agentplm.api.season;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;

import io.agentplm.modules.season.SeasonDraft;
import io.agentplm.modules.season.SeasonRules;
import io.agentplm.modules.season.SeasonStatus;
import io.agentplm.modules.season.SeasonValidationException;

class SeasonRequestMappingTest {

    @Test
    void requestMapsToValidDraft() {
        SeasonRequest request = new SeasonRequest(
                "Fall/Winter 2026",
                "Holiday drop",
                "fw26",
                SeasonStatus.ACTIVE,
                2026,
                LocalDate.of(2026, 7, 1),
                LocalDate.of(2027, 1, 31),
                null);
        SeasonDraft draft = SeasonRules.normalize(new SeasonDraft(
                request.name(),
                request.description(),
                request.code(),
                request.status(),
                request.calendarYear(),
                request.startsOn(),
                request.endsOn()));
        SeasonRules.validate(draft);
        assertEquals("FW26", draft.code());
        assertEquals(SeasonStatus.ACTIVE, draft.status());
    }

    @Test
    void invalidCodeFailsValidation() {
        SeasonDraft draft = new SeasonDraft("Holiday", null, "Fall 26!", SeasonStatus.DRAFT, 2026, null, null);
        assertThrows(SeasonValidationException.class, () -> SeasonRules.validate(draft));
    }
}
