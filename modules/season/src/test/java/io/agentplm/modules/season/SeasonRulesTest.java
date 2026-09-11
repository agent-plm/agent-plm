package io.agentplm.modules.season;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;

class SeasonRulesTest {

    @Test
    void normalizesCodeAndDefaultsStatus() {
        SeasonDraft normalized = SeasonRules.normalize(
                new SeasonDraft(" Fall Winter 2026 ", "  ", " fw26 ", null, 2026, null, null));
        assertEquals("Fall Winter 2026", normalized.name());
        assertEquals("FW26", normalized.code());
        assertEquals(SeasonStatus.DRAFT, normalized.status());
    }

    @Test
    void rejectsInvertedDates() {
        SeasonDraft draft = new SeasonDraft(
                "FW26",
                null,
                "FW26",
                SeasonStatus.ACTIVE,
                2026,
                LocalDate.of(2026, 12, 1),
                LocalDate.of(2026, 1, 1));
        SeasonValidationException error = assertThrows(SeasonValidationException.class, () -> SeasonRules.validate(draft));
        assertEquals("Start date must be on or before end date.", error.getMessage());
    }

    @Test
    void rejectsBlankName() {
        SeasonDraft draft = new SeasonDraft("  ", null, "FW26", SeasonStatus.DRAFT, 2026, null, null);
        assertThrows(SeasonValidationException.class, () -> SeasonRules.validate(draft));
    }
}
