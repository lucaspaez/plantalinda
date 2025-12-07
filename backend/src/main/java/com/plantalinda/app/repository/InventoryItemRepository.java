package com.plantalinda.app.repository;

import com.plantalinda.app.model.InventoryItem;
import com.plantalinda.app.model.InventoryItemType;
import com.plantalinda.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    // Legacy methods (kept for backward compatibility during migration)
    List<InventoryItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<InventoryItem> findByUserIdAndType(Long userId, InventoryItemType type);

    List<InventoryItem> findByUserIdAndBatchId(Long userId, Long batchId);

    List<InventoryItem> findByUser(User user);

    // Multi-tenancy: Organization-based queries (preferred)
    List<InventoryItem> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);

    List<InventoryItem> findByOrganizationIdAndType(Long organizationId, InventoryItemType type);

    long countByOrganizationId(Long organizationId);

    @Query("SELECT i FROM InventoryItem i WHERE i.organization.id = :orgId AND i.minimumQuantity IS NOT NULL AND i.currentQuantity < i.minimumQuantity")
    List<InventoryItem> findLowStockItemsByOrganization(@Param("orgId") Long organizationId);

    // Legacy query (deprecated - use findLowStockItemsByOrganization)
    @Query("SELECT i FROM InventoryItem i WHERE i.user.id = :userId AND i.minimumQuantity IS NOT NULL AND i.currentQuantity < i.minimumQuantity")
    List<InventoryItem> findLowStockItems(@Param("userId") Long userId);
}
