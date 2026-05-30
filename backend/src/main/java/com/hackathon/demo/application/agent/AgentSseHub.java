package com.hackathon.demo.application.agent;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class AgentSseHub {
    private final Map<Long, List<SseEmitter>> emittersByRunId = new ConcurrentHashMap<>();

    public SseEmitter register(Long agentRunId) {
        SseEmitter emitter = new SseEmitter(0L);
        emittersByRunId.computeIfAbsent(agentRunId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> remove(agentRunId, emitter));
        emitter.onTimeout(() -> remove(agentRunId, emitter));
        emitter.onError((e) -> remove(agentRunId, emitter));

        return emitter;
    }

    public void publish(Long agentRunId, Object payload) {
        List<SseEmitter> emitters = emittersByRunId.get(agentRunId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("agent").data(payload));
            } catch (IOException e) {
                remove(agentRunId, emitter);
            }
        }
    }

    public void complete(Long agentRunId) {
        List<SseEmitter> emitters = emittersByRunId.remove(agentRunId);
        if (emitters == null) {
            return;
        }
        for (SseEmitter emitter : emitters) {
            emitter.complete();
        }
    }

    private void remove(Long agentRunId, SseEmitter emitter) {
        List<SseEmitter> emitters = emittersByRunId.get(agentRunId);
        if (emitters == null) {
            return;
        }
        emitters.remove(emitter);
        if (emitters.isEmpty()) {
            emittersByRunId.remove(agentRunId);
        }
    }
}

