package com.hackathon.demo.application.usecase;

import com.hackathon.demo.domain.entity.Health;
import com.hackathon.demo.domain.repository.TimeProvider;
import com.hackathon.demo.domain.usecase.HealthCheckUseCase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class HealthCheckService implements HealthCheckUseCase {
    private final TimeProvider timeProvider;
    private final String serviceName;

    public HealthCheckService(TimeProvider timeProvider, @Value("${app.service-name}") String serviceName) {
        this.timeProvider = timeProvider;
        this.serviceName = serviceName;
    }

    @Override
    public Health execute() {
        return new Health("UP", serviceName, timeProvider.now());
    }
}
