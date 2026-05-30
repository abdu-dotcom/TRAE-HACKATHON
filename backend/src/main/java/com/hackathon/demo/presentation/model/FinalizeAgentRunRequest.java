package com.hackathon.demo.presentation.model;

import jakarta.validation.constraints.NotBlank;

public record FinalizeAgentRunRequest(@NotBlank String finalOutput) {
}
