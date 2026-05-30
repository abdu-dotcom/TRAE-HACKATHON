package com.hackathon.demo.application.agent;

public record AgentRecommendation(
        String toolName,
        String whyThisTool,
        int estimatedMinutesSaved,
        String difficulty,
        String promptTemplate
) {
}

