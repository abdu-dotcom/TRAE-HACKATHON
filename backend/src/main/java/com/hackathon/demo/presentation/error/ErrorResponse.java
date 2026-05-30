package com.hackathon.demo.presentation.error;

import java.time.Instant;

public record ErrorResponse(int status, String error, String message, String path, Instant time) {
}
