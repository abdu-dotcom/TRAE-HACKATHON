package com.hackathon.demo.domain.entity;

import java.time.Instant;

public record Health(String status, String service, Instant time) {
}
