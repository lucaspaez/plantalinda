package com.cannabis.app.repository;

import com.cannabis.app.model.Batch;
import com.cannabis.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByUserId(Long userId);

    List<Batch> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Batch> findByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);
}
