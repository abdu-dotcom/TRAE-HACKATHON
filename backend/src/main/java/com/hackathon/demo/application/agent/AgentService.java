package com.hackathon.demo.application.agent;

import com.hackathon.demo.infrastructure.persistence.entity.AgentRunEntity;
import com.hackathon.demo.infrastructure.persistence.entity.AgentRunStatus;
import com.hackathon.demo.infrastructure.persistence.entity.AgentRunStepEntity;
import com.hackathon.demo.infrastructure.persistence.entity.AgentRunStepStatus;
import com.hackathon.demo.infrastructure.persistence.entity.CheckInEntity;
import com.hackathon.demo.infrastructure.persistence.entity.DepartmentRole;
import com.hackathon.demo.infrastructure.persistence.repository.AgentRunRepository;
import com.hackathon.demo.infrastructure.persistence.repository.AgentRunStepRepository;
import com.hackathon.demo.infrastructure.persistence.repository.CheckInRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class AgentService {
    private final CheckInRepository checkInRepository;
    private final AgentRunRepository agentRunRepository;
    private final AgentRunStepRepository agentRunStepRepository;
    private final AgentSseHub sseHub;
    private final AgentRecommendationEngine recommendationEngine;

    public AgentService(
            CheckInRepository checkInRepository,
            AgentRunRepository agentRunRepository,
            AgentRunStepRepository agentRunStepRepository,
            AgentSseHub sseHub
    ) {
        this.checkInRepository = checkInRepository;
        this.agentRunRepository = agentRunRepository;
        this.agentRunStepRepository = agentRunStepRepository;
        this.sseHub = sseHub;
        this.recommendationEngine = new AgentRecommendationEngine();
    }

    @Transactional
    public Long createCheckIn(
            String employeeId,
            DepartmentRole role,
            String workingOn,
            String timeSink,
            String toolsTried
    ) {
        CheckInEntity saved = checkInRepository.save(
                new CheckInEntity(
                        employeeId,
                        LocalDate.now(),
                        role,
                        workingOn,
                        timeSink,
                        toolsTried == null ? "" : toolsTried,
                        Instant.now()
                )
        );
        return saved.getId();
    }

    @Transactional
    public Long createAgentRun(Long checkInId, String toolChoiceOverride) {
        CheckInEntity checkIn = checkInRepository.findById(checkInId)
                .orElseThrow(() -> new IllegalArgumentException("checkIn not found"));

        AgentRecommendation recommendation = recommendationEngine.recommend(
                checkIn.getRole(),
                checkIn.getWorkingOn(),
                checkIn.getTimeSink(),
                checkIn.getToolsTried(),
                toolChoiceOverride
        );

        Instant now = Instant.now();
        AgentRunEntity run = agentRunRepository.save(
                new AgentRunEntity(
                        checkIn,
                        recommendation.toolName(),
                        AgentRunStatus.queued,
                        recommendation.difficulty(),
                        recommendation.estimatedMinutesSaved(),
                        recommendation.whyThisTool(),
                        now,
                        now
                )
        );

        createDefaultSteps(run);
        AgentRunSnapshot snapshot = getAgentRun(run.getId()).orElseThrow();
        sseHub.publish(run.getId(), snapshot);
        runAgentAsync(run.getId(), recommendation);
        return run.getId();
    }

    @Transactional(readOnly = true)
    public Optional<AgentRunSnapshot> getAgentRun(Long agentRunId) {
        return agentRunRepository.findById(agentRunId).map((run) -> {
            List<AgentRunStepEntity> steps = agentRunStepRepository.findAllByAgentRunIdOrderByStepIndexAsc(run.getId());
            return mapToSnapshot(run, steps, buildPromptForRun(run));
        });
    }

    @Transactional
    public void finalizeRun(Long agentRunId, String finalOutput) {
        AgentRunEntity run = agentRunRepository.findById(agentRunId)
                .orElseThrow(() -> new IllegalArgumentException("agentRun not found"));
        run.setFinalOutput(finalOutput);
        run.setStatus(AgentRunStatus.finalized);
        run.setUpdatedAt(Instant.now());
        agentRunRepository.save(run);
        AgentRunSnapshot snapshot = getAgentRun(agentRunId).orElseThrow();
        sseHub.publish(agentRunId, snapshot);
    }

    @Transactional
    public Long regenerate(Long agentRunId, String toolChoice) {
        AgentRunEntity existing = agentRunRepository.findById(agentRunId)
                .orElseThrow(() -> new IllegalArgumentException("agentRun not found"));
        return createAgentRun(existing.getCheckIn().getId(), toolChoice);
    }

    @Transactional
    public SseEmitter stream(Long agentRunId) {
        SseEmitter emitter = sseHub.register(agentRunId);
        getAgentRun(agentRunId).ifPresent((snapshot) -> sseHub.publish(agentRunId, snapshot));
        return emitter;
    }

    @Async
    @Transactional
    public void runAgentAsync(Long agentRunId, AgentRecommendation recommendation) {
        try {
            AgentRunEntity run = agentRunRepository.findById(agentRunId)
                    .orElseThrow(() -> new IllegalArgumentException("agentRun not found"));

            run.setStatus(AgentRunStatus.running);
            run.setUpdatedAt(Instant.now());
            agentRunRepository.save(run);
            sseHub.publish(agentRunId, getAgentRun(agentRunId).orElseThrow());

            List<AgentRunStepEntity> steps = agentRunStepRepository.findAllByAgentRunIdOrderByStepIndexAsc(agentRunId);

            step(steps, 0, "Parsed the goal and success criteria.", agentRunId);
            String outline = generateOutline(run.getCheckIn().getRole(), run.getCheckIn().getWorkingOn());
            step(steps, 1, "Created a clear outline to reduce the time sink.", agentRunId);
            String draft = generateDraft(run.getCheckIn().getRole(), run.getCheckIn().getWorkingOn(), run.getCheckIn().getTimeSink(), outline);
            step(steps, 2, "Wrote the first draft deliverable.", agentRunId);
            String qa = generateQaChecklist(run.getCheckIn().getRole(), run.getCheckIn().getTimeSink());
            step(steps, 3, "Added QA checks targeted to your bottleneck.", agentRunId);
            String formatted = formatOutput(outline, draft, qa);
            step(steps, 4, "Final formatting applied.", agentRunId);

            run.setDraftOutput(formatted);
            run.setStatus(AgentRunStatus.done);
            run.setUpdatedAt(Instant.now());
            agentRunRepository.save(run);
            sseHub.publish(agentRunId, getAgentRun(agentRunId).orElseThrow());
            sseHub.complete(agentRunId);
        } catch (Exception e) {
            AgentRunEntity run = agentRunRepository.findById(agentRunId).orElse(null);
            if (run != null) {
                run.setStatus(AgentRunStatus.failed);
                run.setUpdatedAt(Instant.now());
                agentRunRepository.save(run);
                sseHub.publish(agentRunId, getAgentRun(agentRunId).orElseThrow());
                sseHub.complete(agentRunId);
            }
        }
    }

    private void createDefaultSteps(AgentRunEntity run) {
        String[] titles = new String[]{
                "Understand the goal",
                "Create outline",
                "Draft deliverable",
                "QA and improve",
                "Final formatting"
        };

        for (int i = 0; i < titles.length; i++) {
            agentRunStepRepository.save(new AgentRunStepEntity(run, i, titles[i], AgentRunStepStatus.pending));
        }
    }

    private void step(List<AgentRunStepEntity> steps, int index, String summary, Long agentRunId) throws InterruptedException {
        AgentRunStepEntity step = steps.get(index);
        step.setStatus(AgentRunStepStatus.running);
        step.setStartedAt(Instant.now());
        agentRunStepRepository.save(step);
        sseHub.publish(agentRunId, getAgentRun(agentRunId).orElseThrow());

        Thread.sleep(700);

        step.setStatus(AgentRunStepStatus.done);
        step.setFinishedAt(Instant.now());
        step.setSummary(summary);
        agentRunStepRepository.save(step);
        sseHub.publish(agentRunId, getAgentRun(agentRunId).orElseThrow());
    }

    private String buildPromptForRun(AgentRunEntity run) {
        return recommendationEngine.recommend(
                run.getCheckIn().getRole(),
                run.getCheckIn().getWorkingOn(),
                run.getCheckIn().getTimeSink(),
                run.getCheckIn().getToolsTried(),
                run.getToolChoice()
        ).promptTemplate();
    }

    private AgentRunSnapshot mapToSnapshot(AgentRunEntity run, List<AgentRunStepEntity> steps, String prompt) {
        List<AgentRunSnapshot.AgentRunStepSnapshot> snapshots = steps.stream()
                .map((s) -> new AgentRunSnapshot.AgentRunStepSnapshot(
                        s.getStepIndex(),
                        s.getTitle(),
                        s.getStatus().name(),
                        s.getStartedAt(),
                        s.getFinishedAt(),
                        s.getSummary()
                ))
                .toList();

        return new AgentRunSnapshot(
                run.getId(),
                run.getCheckIn().getId(),
                run.getStatus().name(),
                run.getToolChoice(),
                run.getDifficulty(),
                run.getEstimatedMinutesSaved(),
                run.getWhyThisTool(),
                prompt,
                snapshots,
                run.getDraftOutput(),
                run.getFinalOutput(),
                run.getCreatedAt(),
                run.getUpdatedAt()
        );
    }

    private String generateOutline(DepartmentRole role, String workingOn) {
        return switch (role) {
            case Marketing -> "- Objective\n- Audience\n- Key message\n- 3 angles\n- Draft structure\n- CTA";
            case Sales -> "- Customer context\n- Problem framing\n- Proposal structure\n- Value + proof\n- Objections\n- Next steps";
            case Finance -> "- Executive summary\n- Key metrics\n- Variance drivers\n- Risks\n- Recommendations";
            case Developer -> "- Repro steps\n- Root cause hypothesis\n- Fix plan\n- Tests\n- Rollout";
            case Operations -> "- Current workflow\n- Bottleneck\n- Proposed SOP\n- Owners\n- Metrics";
            case HR -> "- Purpose\n- Scope\n- Key points\n- Template sections\n- Compliance notes";
        } + "\n\nWorking on: " + workingOn;
    }

    private String generateDraft(DepartmentRole role, String workingOn, String timeSink, String outline) {
        String header = switch (role) {
            case Marketing -> "Draft (Marketing)\n";
            case Sales -> "Draft (Sales)\n";
            case Finance -> "Draft (Finance)\n";
            case Developer -> "Draft (Engineering)\n";
            case Operations -> "Draft (Operations)\n";
            case HR -> "Draft (HR)\n";
        };

        return header +
                "Task: " + workingOn + "\n" +
                "Focus (time sink): " + timeSink + "\n\n" +
                "Outline reference:\n" + outline + "\n\n" +
                "First draft:\n" +
                "- Start with a 1-paragraph context\n" +
                "- Add the core content in clear sections\n" +
                "- End with concrete next steps\n";
    }

    private String generateQaChecklist(DepartmentRole role, String timeSink) {
        String common = "- Is the output structured and skimmable?\n- Is every section actionable?\n- Remove fluff and repetition.\n";

        String roleSpecific = switch (role) {
            case Marketing -> "- Tone matches brand\n- CTA is clear\n- Claims are specific\n";
            case Sales -> "- Value proposition is concrete\n- One clear CTA question\n- Handles top objection\n";
            case Finance -> "- Numbers and narrative align\n- Assumptions are explicit\n- Risks are called out\n";
            case Developer -> "- Includes repro + fix\n- Includes tests\n- Notes edge cases\n";
            case Operations -> "- SOP steps are unambiguous\n- Owners and SLA defined\n- Metrics to track\n";
            case HR -> "- Language is inclusive\n- Compliant wording\n- Clear evaluation criteria\n";
        };

        return "QA checklist (targeting your bottleneck: " + timeSink + ")\n\n" + common + roleSpecific;
    }

    private String formatOutput(String outline, String draft, String qa) {
        return "Assumptions:\n- None\n\nOutline:\n" + outline + "\n\n" + draft + "\n\n" + qa;
    }
}
