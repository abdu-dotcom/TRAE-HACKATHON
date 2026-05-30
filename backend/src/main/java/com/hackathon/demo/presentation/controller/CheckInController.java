package com.hackathon.demo.presentation.controller;

import com.hackathon.demo.application.agent.AgentService;
import com.hackathon.demo.infrastructure.persistence.entity.DepartmentRole;
import com.hackathon.demo.presentation.model.CreateCheckInRequest;
import com.hackathon.demo.presentation.model.CreateCheckInResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CheckInController {
    private final AgentService agentService;

    public CheckInController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/checkins")
    public CreateCheckInResponse create(@Valid @RequestBody CreateCheckInRequest request) {
        Long id = agentService.createCheckIn(
                "emp_demo",
                DepartmentRole.valueOf(request.role()),
                request.workingOn(),
                request.timeSink(),
                request.toolsTried()
        );
        return new CreateCheckInResponse(id);
    }
}

