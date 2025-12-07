package com.plantalinda.app.dto;

import com.plantalinda.app.model.MovementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryMovementResponse {
    private Long id;
    private Long inventoryItemId;
    private String inventoryItemName;
    private MovementType type;
    private Double quantity;
    private Double previousQuantity;
    private Double newQuantity;
    private String notes;
    private Long batchId;
    private String batchName;
    private Double cost;
    private LocalDateTime timestamp;
}
