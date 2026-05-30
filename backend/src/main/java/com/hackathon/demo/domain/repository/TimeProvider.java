package com.hackathon.demo.domain.repository;

import java.time.Instant;

public interface TimeProvider {
    Instant now();
}
