package com.cannabis.app.dto;

import com.cannabis.app.model.InventoryItemType;
import com.cannabis.app.model.UnitOfMeasure;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInventoryItemRequest {
    private String name;
    private InventoryItemType type;
    private String description;
    private Double currentQuantity;
    private Double minimumQuantity;
    private UnitOfMeasure unit;
    private String strain;
    private String brand;
    private String supplier;
    private LocalDate expirationDate;
    private Long batchId;
    private Double unitCost;
    private String location;
}
