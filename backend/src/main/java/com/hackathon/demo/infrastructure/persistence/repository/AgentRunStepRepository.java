package com.hackathon.demo.infrastructure.persistence.repository;

import com.hackathon.demo.infrastructure.persistence.entity.AgentRunStepEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRunStepRepository extends JpaRepository<AgentRunStepEntity, Long> {
    List<AgentRunStepEntity> findAllByAgentRunIdOrderByStepIndexAsc(Long agentRunId);
}

