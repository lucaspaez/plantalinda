package com.plantalinda.app.dto;

import com.plantalinda.app.model.MovementType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInventoryMovementRequest {
    private Long inventoryItemId;
    private MovementType type;
    private Double quantity;
    private String notes;
    private Long batchId;
    private Double cost;
}
