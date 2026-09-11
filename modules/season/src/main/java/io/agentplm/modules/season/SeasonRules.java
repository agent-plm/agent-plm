package io.agentplm.modules.season;

import java.util.Locale;
import java.util.regex.Pattern;

public final class SeasonRules {

    public static final Pattern CODE = Pattern.compile("^[A-Z0-9][A-Z0-9_-]{1,31}$");

    private SeasonRules() {
    }

    public static String normalizeCode(String code) {
        if (code == null) {
            return null;
        }
        return code.trim().toUpperCase(Locale.ROOT);
    }

    public static SeasonDraft normalize(SeasonDraft draft) {
        SeasonStatus status = draft.status() == null ? SeasonStatus.DRAFT : draft.status();
        return new SeasonDraft(
                trimToNull(draft.name()),
                trimToNull(draft.description()),
                normalizeCode(draft.code()),
                status,
                draft.calendarYear(),
                draft.startsOn(),
                draft.endsOn());
    }

    public static void validate(SeasonDraft draft) {
        SeasonDraft normalized = normalize(draft);
        if (normalized.name() == null) {
            throw new SeasonValidationException("Season name is required.");
        }
        if (normalized.code() == null) {
            throw new SeasonValidationException("Season code is required.");
        }
        if (!CODE.matcher(normalized.code()).matches()) {
            throw new SeasonValidationException(
                    "Season code must be 2–32 characters: letters, numbers, underscore, or hyphen.");
        }
        if (normalized.calendarYear() != null
                && (normalized.calendarYear() < 1900 || normalized.calendarYear() > 2200)) {
            throw new SeasonValidationException("Calendar year must be between 1900 and 2200.");
        }
        if (normalized.startsOn() != null
                && normalized.endsOn() != null
                && normalized.startsOn().isAfter(normalized.endsOn())) {
            throw new SeasonValidationException("Start date must be on or before end date.");
        }
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
