package com.cannabis.app.dto;

import com.cannabis.app.model.InventoryItemType;
import com.cannabis.app.model.UnitOfMeasure;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemResponse {
    private Long id;
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
    private String batchName;
    private Double unitCost;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isLowStock;
}
