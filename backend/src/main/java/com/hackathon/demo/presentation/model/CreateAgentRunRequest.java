package com.hackathon.demo.presentation.model;

import jakarta.validation.constraints.NotNull;

public record CreateAgentRunRequest(
        @NotNull Long checkInId,
        String toolChoice
) {
}
