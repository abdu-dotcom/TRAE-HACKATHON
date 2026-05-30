package com.hackathon.demo.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "check_ins")
public class CheckInEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DepartmentRole role;

    @Column(nullable = false, length = 2000)
    private String workingOn;

    @Column(nullable = false, length = 2000)
    private String timeSink;

    @Column(nullable = false, length = 2000)
    private String toolsTried;

    @Column(nullable = false)
    private Instant createdAt;

    protected CheckInEntity() {
    }

    public CheckInEntity(
            String employeeId,
            LocalDate date,
            DepartmentRole role,
            String workingOn,
            String timeSink,
            String toolsTried,
            Instant createdAt
    ) {
        this.employeeId = employeeId;
        this.date = date;
        this.role = role;
        this.workingOn = workingOn;
        this.timeSink = timeSink;
        this.toolsTried = toolsTried;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public LocalDate getDate() {
        return date;
    }

    public DepartmentRole getRole() {
        return role;
    }

    public String getWorkingOn() {
        return workingOn;
    }

    public String getTimeSink() {
        return timeSink;
    }

    public String getToolsTried() {
        return toolsTried;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
