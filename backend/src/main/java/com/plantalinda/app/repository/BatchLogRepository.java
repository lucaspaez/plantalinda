package com.plantalinda.app.repository;

import com.plantalinda.app.model.Batch;
import com.plantalinda.app.model.BatchLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchLogRepository extends JpaRepository<BatchLog, Long> {
    List<BatchLog> findByBatchIdOrderByTimestampDesc(Long batchId);

    List<BatchLog> findByBatchIdOrderByTimestampAsc(Long batchId);

    List<BatchLog> findByBatchOrderByTimestampDesc(Batch batch);
}
