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
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "agent_run_steps")
public class AgentRunStepEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "agent_run_id", nullable = false)
    private AgentRunEntity agentRun;

    @Column(nullable = false)
    private int stepIndex;

    @Column(nullable = false, length = 256)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentRunStepStatus status;

    @Column(nullable = true)
    private Instant startedAt;

    @Column(nullable = true)
    private Instant finishedAt;

    @Column(nullable = true, length = 2000)
    private String summary;

    protected AgentRunStepEntity() {
    }

    public AgentRunStepEntity(
            AgentRunEntity agentRun,
            int stepIndex,
            String title,
            AgentRunStepStatus status
    ) {
        this.agentRun = agentRun;
        this.stepIndex = stepIndex;
        this.title = title;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public AgentRunEntity getAgentRun() {
        return agentRun;
    }

    public int getStepIndex() {
        return stepIndex;
    }

    public String getTitle() {
        return title;
    }

    public AgentRunStepStatus getStatus() {
        return status;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public Instant getFinishedAt() {
        return finishedAt;
    }

    public String getSummary() {
        return summary;
    }

    public void setStatus(AgentRunStepStatus status) {
        this.status = status;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public void setFinishedAt(Instant finishedAt) {
        this.finishedAt = finishedAt;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
