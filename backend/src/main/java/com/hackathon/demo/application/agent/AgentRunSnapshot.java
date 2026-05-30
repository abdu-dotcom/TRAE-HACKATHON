package com.hackathon.demo.application.agent;

import java.time.Instant;
import java.util.List;

public record AgentRunSnapshot(
        Long agentRunId,
        Long checkInId,
        String status,
        String toolChoice,
        String difficulty,
        int estimatedMinutesSaved,
        String whyThisTool,
        String promptTemplate,
        List<AgentRunStepSnapshot> steps,
        String draftOutput,
        String finalOutput,
        Instant createdAt,
        Instant updatedAt
) {
    public record AgentRunStepSnapshot(
            int stepIndex,
            String title,
            String status,
            Instant startedAt,
            Instant finishedAt,
            String summary
    ) {
    }
}

