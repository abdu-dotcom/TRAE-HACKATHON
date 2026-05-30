package com.hackathon.demo.presentation.model;

import jakarta.validation.constraints.NotBlank;

public record CreateCheckInRequest(
        @NotBlank String role,
        @NotBlank String workingOn,
        @NotBlank String timeSink,
        String toolsTried
) {
}
