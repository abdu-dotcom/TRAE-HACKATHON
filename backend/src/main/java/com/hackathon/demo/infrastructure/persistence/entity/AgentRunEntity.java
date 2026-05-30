package com.hackathon.demo.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agent_runs")
public class AgentRunEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "check_in_id", nullable = false)
    private CheckInEntity checkIn;

    @Column(nullable = false)
    private String toolChoice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentRunStatus status;

    @Column(nullable = false, length = 90)
    private String difficulty;

    @Column(nullable = false)
    private int estimatedMinutesSaved;

    @Column(nullable = false, length = 2000)
    private String whyThisTool;

    @Column(nullable = true, length = 10000)
    private String draftOutput;

    @Column(nullable = true, length = 10000)
    private String finalOutput;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "agentRun")
    @OrderBy("stepIndex ASC")
    private List<AgentRunStepEntity> steps = new ArrayList<>();

    protected AgentRunEntity() {
    }

    public AgentRunEntity(
            CheckInEntity checkIn,
            String toolChoice,
            AgentRunStatus status,
            String difficulty,
            int estimatedMinutesSaved,
            String whyThisTool,
            Instant createdAt,
            Instant updatedAt
    ) {
        this.checkIn = checkIn;
        this.toolChoice = toolChoice;
        this.status = status;
        this.difficulty = difficulty;
        this.estimatedMinutesSaved = estimatedMinutesSaved;
        this.whyThisTool = whyThisTool;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public CheckInEntity getCheckIn() {
        return checkIn;
    }

    public String getToolChoice() {
        return toolChoice;
    }

    public AgentRunStatus getStatus() {
        return status;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public int getEstimatedMinutesSaved() {
        return estimatedMinutesSaved;
    }

    public String getWhyThisTool() {
        return whyThisTool;
    }

    public String getDraftOutput() {
        return draftOutput;
    }

    public String getFinalOutput() {
        return finalOutput;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public List<AgentRunStepEntity> getSteps() {
        return steps;
    }

    public void setStatus(AgentRunStatus status) {
        this.status = status;
    }

    public void setDraftOutput(String draftOutput) {
        this.draftOutput = draftOutput;
    }

    public void setFinalOutput(String finalOutput) {
        this.finalOutput = finalOutput;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
