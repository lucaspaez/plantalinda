package com.cannabis.app.service;

import com.cannabis.app.dto.*;
import com.cannabis.app.model.*;
import com.cannabis.app.repository.BatchRepository;
import com.cannabis.app.repository.InventoryItemRepository;
import com.cannabis.app.repository.InventoryMovementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryMovementRepository inventoryMovementRepository;
    private final BatchRepository batchRepository;

    @Transactional
    public InventoryItemResponse createItem(CreateInventoryItemRequest request, User user) {
        Batch batch = null;
        if (request.getBatchId() != null) {
            batch = batchRepository.findById(request.getBatchId())
                    .orElseThrow(() -> new RuntimeException("Batch not found"));

            if (!batch.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized access to batch");
            }
        }

        InventoryItem item = InventoryItem.builder()
                .name(request.getName())
                .type(request.getType())
                .description(request.getDescription())
                .currentQuantity(request.getCurrentQuantity())
                .minimumQuantity(request.getMinimumQuantity())
                .unit(request.getUnit())
                .strain(request.getStrain())
                .brand(request.getBrand())
                .supplier(request.getSupplier())
                .expirationDate(request.getExpirationDate())
                .batch(batch)
                .unitCost(request.getUnitCost())
                .location(request.getLocation())
                .user(user)
                .organization(user.getOrganization()) // Multi-tenancy: Set organization
                .build();

        item = inventoryItemRepository.save(item);

        // Crear movimiento inicial
        createMovement(item, MovementType.PURCHASE, request.getCurrentQuantity(),
                "Inventario inicial", null,
                request.getUnitCost() != null ? request.getUnitCost() * request.getCurrentQuantity() : null, user);

        log.info("Created inventory item: {} for user: {}", item.getName(), user.getEmail());
        return mapToDto(item);
    }

    /**
     * Get all inventory items for the user's organization.
     * Multi-tenancy: Returns items visible to all users in the same organization.
     */
    public List<InventoryItemResponse> getUserInventory(User user) {
        if (user.getOrganization() == null) {
            return List.of();
        }
        return inventoryItemRepository.findByOrganizationIdOrderByCreatedAtDesc(user.getOrganization().getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<InventoryItemResponse> getInventoryByType(User user, InventoryItemType type) {
        if (user.getOrganization() == null) {
            return List.of();
        }
        return inventoryItemRepository.findByOrganizationIdAndType(user.getOrganization().getId(), type)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<InventoryItemResponse> getLowStockItems(User user) {
        if (user.getOrganization() == null) {
            return List.of();
        }
        return inventoryItemRepository.findLowStockItemsByOrganization(user.getOrganization().getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public InventoryItemResponse getItemById(Long itemId, User user) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Multi-tenancy: Check organization access, not just user
        if (user.getOrganization() == null ||
                item.getOrganization() == null ||
                !item.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new RuntimeException("Unauthorized access to item");
        }

        return mapToDto(item);
    }

    @Transactional
    public InventoryMovementResponse recordMovement(CreateInventoryMovementRequest request, User user) {
        InventoryItem item = inventoryItemRepository.findById(request.getInventoryItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Multi-tenancy: Check organization access
        if (user.getOrganization() == null ||
                item.getOrganization() == null ||
                !item.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new RuntimeException("Unauthorized access to item");
        }

        Batch batch = null;
        if (request.getBatchId() != null) {
            batch = batchRepository.findById(request.getBatchId())
                    .orElseThrow(() -> new RuntimeException("Batch not found"));
        }

        // Calcular nueva cantidad
        Double quantity = request.getQuantity();
        if (isOutgoingMovement(request.getType())) {
            quantity = -Math.abs(quantity); // Asegurar que sea negativo
        } else {
            quantity = Math.abs(quantity); // Asegurar que sea positivo
        }

        Double previousQuantity = item.getCurrentQuantity();
        Double newQuantity = previousQuantity + quantity;

        if (newQuantity < 0) {
            throw new RuntimeException(
                    "Insufficient stock. Current: " + previousQuantity + ", Requested: " + Math.abs(quantity));
        }

        // Actualizar cantidad del item
        item.setCurrentQuantity(newQuantity);
        inventoryItemRepository.save(item);

        // Crear movimiento
        InventoryMovement movement = createMovement(item, request.getType(), quantity,
                request.getNotes(), batch, request.getCost(), user);

        log.info("Recorded movement: {} {} for item: {}", quantity, item.getUnit(), item.getName());
        return mapMovementToDto(movement);
    }

    public List<InventoryMovementResponse> getItemMovements(Long itemId, User user) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Multi-tenancy: Check organization access
        if (user.getOrganization() == null ||
                item.getOrganization() == null ||
                !item.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new RuntimeException("Unauthorized access to item");
        }

        return inventoryMovementRepository.findByInventoryItemIdOrderByTimestampDesc(itemId)
                .stream()
                .map(this::mapMovementToDto)
                .collect(Collectors.toList());
    }

    public List<InventoryMovementResponse> getAllMovements(User user) {
        return inventoryMovementRepository.findByUserIdOrderByTimestampDesc(user.getId())
                .stream()
                .map(this::mapMovementToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteItem(Long itemId, User user) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Multi-tenancy: Check organization access
        if (user.getOrganization() == null ||
                item.getOrganization() == null ||
                !item.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new RuntimeException("Unauthorized access to item");
        }

        // Eliminar movimientos asociados
        inventoryMovementRepository.deleteAll(
                inventoryMovementRepository.findByInventoryItemIdOrderByTimestampDesc(itemId));

        // Eliminar item
        inventoryItemRepository.delete(item);
        log.info("Deleted inventory item: {}", item.getName());
    }

    private InventoryMovement createMovement(InventoryItem item, MovementType type, Double quantity,
            String notes, Batch batch, Double cost, User user) {
        Double previousQuantity = item.getCurrentQuantity() - quantity;

        InventoryMovement movement = InventoryMovement.builder()
                .inventoryItem(item)
                .type(type)
                .quantity(quantity)
                .previousQuantity(previousQuantity)
                .newQuantity(item.getCurrentQuantity())
                .notes(notes)
                .batch(batch)
                .cost(cost)
                .user(user)
                .build();

        return inventoryMovementRepository.save(movement);
    }

    private boolean isOutgoingMovement(MovementType type) {
        return type == MovementType.USAGE ||
                type == MovementType.SALE ||
                type == MovementType.LOSS;
    }

    private InventoryItemResponse mapToDto(InventoryItem item) {
        boolean isLowStock = item.getMinimumQuantity() != null &&
                item.getCurrentQuantity() < item.getMinimumQuantity();

        return InventoryItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .type(item.getType())
                .description(item.getDescription())
                .currentQuantity(item.getCurrentQuantity())
                .minimumQuantity(item.getMinimumQuantity())
                .unit(item.getUnit())
                .strain(item.getStrain())
                .brand(item.getBrand())
                .supplier(item.getSupplier())
                .expirationDate(item.getExpirationDate())
                .batchId(item.getBatch() != null ? item.getBatch().getId() : null)
                .batchName(item.getBatch() != null ? item.getBatch().getName() : null)
                .unitCost(item.getUnitCost())
                .location(item.getLocation())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .isLowStock(isLowStock)
                .build();
    }

    private InventoryMovementResponse mapMovementToDto(InventoryMovement movement) {
        return InventoryMovementResponse.builder()
                .id(movement.getId())
                .inventoryItemId(movement.getInventoryItem().getId())
                .inventoryItemName(movement.getInventoryItem().getName())
                .type(movement.getType())
                .quantity(movement.getQuantity())
                .previousQuantity(movement.getPreviousQuantity())
                .newQuantity(movement.getNewQuantity())
                .notes(movement.getNotes())
                .batchId(movement.getBatch() != null ? movement.getBatch().getId() : null)
                .batchName(movement.getBatch() != null ? movement.getBatch().getName() : null)
                .cost(movement.getCost())
                .timestamp(movement.getTimestamp())
                .build();
    }
}
