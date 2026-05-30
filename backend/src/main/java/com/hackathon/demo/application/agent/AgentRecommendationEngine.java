package com.hackathon.demo.application.agent;

import com.hackathon.demo.infrastructure.persistence.entity.DepartmentRole;
import java.util.Locale;

public class AgentRecommendationEngine {
    public AgentRecommendation recommend(
            DepartmentRole role,
            String workingOn,
            String timeSink,
            String toolsTried,
            String toolOverride
    ) {
        String combined = (workingOn + " | " + timeSink + " | " + toolsTried).toLowerCase(Locale.ROOT);

        String defaultTool = switch (role) {
            case Marketing -> chooseMarketingTool(combined);
            case Sales -> chooseSalesTool(combined);
            case Finance -> chooseFinanceTool(combined);
            case Developer -> chooseDeveloperTool(combined);
            case Operations -> chooseOperationsTool(combined);
            case HR -> chooseHrTool(combined);
        };

        String tool = (toolOverride == null || toolOverride.isBlank()) ? defaultTool : toolOverride.trim();
        String difficulty = inferDifficulty(combined);
        int minutes = inferMinutesSaved(difficulty, combined);
        String why = buildWhy(role, tool, workingOn, timeSink, toolsTried);
        String prompt = buildPrompt(role, tool, workingOn, timeSink, toolsTried);

        return new AgentRecommendation(tool, why, minutes, difficulty, prompt);
    }

    private String chooseMarketingTool(String combined) {
        if (hasAny(combined, "campaign", "plan", "strategy", "positioning", "research")) return "Perplexity";
        return "Claude";
    }

    private String chooseSalesTool(String combined) {
        if (hasAny(combined, "lead", "prospect", "research", "account")) return "Perplexity";
        return "Claude";
    }

    private String chooseFinanceTool(String combined) {
        return "Claude";
    }

    private String chooseDeveloperTool(String combined) {
        if (hasAny(combined, "code review", "review", "pull request", "pr")) return "GitHub Copilot";
        return "Claude";
    }

    private String chooseOperationsTool(String combined) {
        return "Claude";
    }

    private String chooseHrTool(String combined) {
        return "Claude";
    }

    private boolean hasAny(String haystack, String... needles) {
        for (String n : needles) {
            if (haystack.contains(n)) return true;
        }
        return false;
    }

    private String inferDifficulty(String combined) {
        if (hasAny(combined, "debug", "forecast", "variance", "policy", "performance review", "proposal")) {
            return "Medium";
        }
        return "Easy";
    }

    private int inferMinutesSaved(String difficulty, String combined) {
        int base = difficulty.equals("Medium") ? 60 : 35;
        if (hasAny(combined, "deck", "presentation", "proposal", "policy")) base += 10;
        if (hasAny(combined, "email", "follow up", "follow-up")) base -= 5;
        return Math.max(20, Math.min(90, base));
    }

    private String buildWhy(
            DepartmentRole role,
            String tool,
            String workingOn,
            String timeSink,
            String toolsTried
    ) {
        String roleHint = switch (role) {
            case Marketing -> "marketing deliverables";
            case Sales -> "sales messaging and persuasion";
            case Finance -> "finance analysis and narrative";
            case Developer -> "engineering tasks";
            case Operations -> "ops workflows";
            case HR -> "people ops docs";
        };

        String toolsClause = (toolsTried == null || toolsTried.isBlank())
                ? "You didn't mention prior tools, so we're starting with the most efficient default."
                : "Since you already tried \"" + toolsTried + "\", this focuses on the exact bottleneck instead of generic suggestions.";

        return tool + " fits this because your goal is \"" + workingOn + "\" and the slow part is \"" + timeSink + "\". " +
                "It’s strong at " + roleHint + " and can produce a first usable draft fast. " + toolsClause;
    }

    private String buildPrompt(
            DepartmentRole role,
            String tool,
            String workingOn,
            String timeSink,
            String toolsTried
    ) {
        String roleLine = switch (role) {
            case Marketing -> "Act as a senior marketing strategist + copywriter.";
            case Sales -> "Act as a senior sales strategist and proposal writer.";
            case Finance -> "Act as a finance analyst who writes executive-ready narratives.";
            case Developer -> "Act as a senior engineer pair-programmer.";
            case Operations -> "Act as an operations lead focused on efficiency and clear SOPs.";
            case HR -> "Act as an HR lead writing clear, compliant people documents.";
        };

        return roleLine + "\n\n" +
                "Context:\n" +
                "- Task: " + workingOn + "\n" +
                "- Biggest time sink: " + timeSink + "\n" +
                "- Tools tried: " + (toolsTried == null || toolsTried.isBlank() ? "None" : toolsTried) + "\n\n" +
                "Deliverable:\n" +
                "1) A structured outline\n" +
                "2) A first draft\n" +
                "3) A QA checklist that specifically reduces the time sink\n\n" +
                "Constraints:\n" +
                "- Keep it concise and directly usable today\n" +
                "- Use plain language and avoid fluff\n" +
                "- If assumptions are needed, list them at the top\n\n" +
                "Output format:\n" +
                "- Assumptions (bullets)\n" +
                "- Outline (bullets)\n" +
                "- Draft (text)\n" +
                "- QA checklist (checkbox list)\n\n" +
                "Tool context: generate output optimized for " + tool + ".";
    }
}

