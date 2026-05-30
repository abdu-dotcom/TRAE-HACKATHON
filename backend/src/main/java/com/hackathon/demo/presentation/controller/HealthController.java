package com.hackathon.demo.presentation.controller;

import com.hackathon.demo.domain.entity.Health;
import com.hackathon.demo.domain.usecase.HealthCheckUseCase;
import com.hackathon.demo.presentation.model.HealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    private final HealthCheckUseCase healthCheckUseCase;

    public HealthController(HealthCheckUseCase healthCheckUseCase) {
        this.healthCheckUseCase = healthCheckUseCase;
    }

    @GetMapping("/health")
    public HealthResponse health() {
        Health health = healthCheckUseCase.execute();
        return new HealthResponse(health.status(), health.service(), health.time());
    }
}
