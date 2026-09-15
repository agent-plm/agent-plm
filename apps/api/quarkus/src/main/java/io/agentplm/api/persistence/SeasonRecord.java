package io.agentplm.api.persistence;

import java.time.LocalDate;

import org.hibernate.annotations.Audited;
import org.hibernate.annotations.Temporal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "season")
@Temporal.HistoryTable(name = "season_history")
@Audited.Table(name = "season_aud")
public class SeasonRecord extends PlmEntity {

    @Column(nullable = false)
    public String code;

    @Column(name = "calendar_year")
    public Integer calendarYear;

    @Column(name = "starts_on")
    public LocalDate startsOn;

    @Column(name = "ends_on")
    public LocalDate endsOn;
}
