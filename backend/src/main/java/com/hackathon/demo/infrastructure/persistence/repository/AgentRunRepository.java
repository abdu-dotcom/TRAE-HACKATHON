package com.hackathon.demo.infrastructure.persistence.repository;

import com.hackathon.demo.infrastructure.persistence.entity.AgentRunEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRunRepository extends JpaRepository<AgentRunEntity, Long> {
}

