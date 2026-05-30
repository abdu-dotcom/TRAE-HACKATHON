package com.hackathon.demo.presentation.controller;

import com.hackathon.demo.application.agent.AgentService;
import com.hackathon.demo.presentation.model.AgentRunResponse;
import com.hackathon.demo.presentation.model.CreateAgentRunRequest;
import com.hackathon.demo.presentation.model.CreateAgentRunResponse;
import com.hackathon.demo.presentation.model.FinalizeAgentRunRequest;
import com.hackathon.demo.presentation.model.RegenerateAgentRunRequest;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api")
public class AgentRunController {
    private final AgentService agentService;

    public AgentRunController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/agent-runs")
    public CreateAgentRunResponse create(@Valid @RequestBody CreateAgentRunRequest request) {
        Long id = agentService.createAgentRun(request.checkInId(), request.toolChoice());
        return new CreateAgentRunResponse(id);
    }

    @GetMapping("/agent-runs/{id}")
    public AgentRunResponse get(@PathVariable("id") Long id) {
        return agentService.getAgentRun(id)
                .map(AgentRunResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("agentRun not found"));
    }

    @GetMapping(path = "/agent-runs/{id}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@PathVariable("id") Long id) {
        return agentService.stream(id);
    }

    @PostMapping("/agent-runs/{id}/finalize")
    public void finalize(@PathVariable("id") Long id, @Valid @RequestBody FinalizeAgentRunRequest request) {
        agentService.finalizeRun(id, request.finalOutput());
    }

    @PostMapping("/agent-runs/{id}/regenerate")
    public CreateAgentRunResponse regenerate(@PathVariable("id") Long id, @RequestBody RegenerateAgentRunRequest request) {
        Long newId = agentService.regenerate(id, request == null ? null : request.toolChoice());
        return new CreateAgentRunResponse(newId);
    }
}
