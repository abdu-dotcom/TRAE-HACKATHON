package com.hackathon.demo.infrastructure.persistence.repository;

import com.hackathon.demo.infrastructure.persistence.entity.CheckInEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckInRepository extends JpaRepository<CheckInEntity, Long> {
}

