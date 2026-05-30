package com.hackathon.demo.presentation.model;

import com.hackathon.demo.application.agent.AgentRunSnapshot;
import java.time.Instant;
import java.util.List;

public record AgentRunResponse(
        Long agentRunId,
        Long checkInId,
        String status,
        String toolChoice,
        String difficulty,
        int estimatedMinutesSaved,
        String whyThisTool,
        String promptTemplate,
        List<AgentRunStepResponse> steps,
        String draftOutput,
        String finalOutput,
        Instant createdAt,
        Instant updatedAt
) {
    public static AgentRunResponse from(AgentRunSnapshot snapshot) {
        List<AgentRunStepResponse> steps = snapshot.steps() == null
                ? List.of()
                : snapshot.steps().stream().map(AgentRunStepResponse::from).toList();
        return new AgentRunResponse(
                snapshot.agentRunId(),
                snapshot.checkInId(),
                snapshot.status(),
                snapshot.toolChoice(),
                snapshot.difficulty(),
                snapshot.estimatedMinutesSaved(),
                snapshot.whyThisTool(),
                snapshot.promptTemplate(),
                steps,
                snapshot.draftOutput(),
                snapshot.finalOutput(),
                snapshot.createdAt(),
                snapshot.updatedAt()
        );
    }

    public record AgentRunStepResponse(
            int stepIndex,
            String title,
            String status,
            Instant startedAt,
            Instant finishedAt,
            String summary
    ) {
        public static AgentRunStepResponse from(AgentRunSnapshot.AgentRunStepSnapshot snapshot) {
            return new AgentRunStepResponse(
                    snapshot.stepIndex(),
                    snapshot.title(),
                    snapshot.status(),
                    snapshot.startedAt(),
                    snapshot.finishedAt(),
                    snapshot.summary()
            );
        }
    }
}
