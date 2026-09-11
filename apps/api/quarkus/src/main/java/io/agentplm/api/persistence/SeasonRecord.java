package io.agentplm.api.persistence;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "season")
public class SeasonRecord {

    @Id
    public UUID id;

    @Column(nullable = false)
    public String code;

    @Column(name = "calendar_year")
    public Integer calendarYear;

    @Column(name = "starts_on")
    public LocalDate startsOn;

    @Column(name = "ends_on")
    public LocalDate endsOn;
}
