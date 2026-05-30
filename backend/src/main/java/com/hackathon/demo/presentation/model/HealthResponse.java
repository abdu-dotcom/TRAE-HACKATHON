package com.hackathon.demo.presentation.model;

import java.time.Instant;

public record HealthResponse(String status, String service, Instant time) {
}
