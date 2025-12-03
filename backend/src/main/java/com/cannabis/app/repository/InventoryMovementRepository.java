package com.cannabis.app.repository;

import com.cannabis.app.model.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findByInventoryItemIdOrderByTimestampDesc(Long inventoryItemId);

    List<InventoryMovement> findByUserIdOrderByTimestampDesc(Long userId);

    List<InventoryMovement> findByBatchIdOrderByTimestampDesc(Long batchId);
}
