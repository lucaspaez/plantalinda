package com.cannabis.app.repository;

import com.cannabis.app.model.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
    List<Diagnosis> findByUserId(Long userId);
}
