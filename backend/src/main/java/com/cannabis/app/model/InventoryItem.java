package com.cannabis.app.model;

import jakarta.persistence.*;
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
@Entity
@Table(name = "inventory_item")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InventoryItemType type;

    @Column(length = 1000)
    private String description;

    // Cantidad actual en stock
    @Column(nullable = false)
    private Double currentQuantity;

    // Cantidad mínima (para alertas)
    private Double minimumQuantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitOfMeasure unit;

    // Para semillas y plantas
    private String strain; // Cepa/Genética

    // Para insumos
    private String brand; // Marca
    private String supplier; // Proveedor
    private LocalDate expirationDate; // Fecha de vencimiento

    // Relación con lote (si aplica)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private Batch batch;

    // Costo unitario (para reportes)
    private Double unitCost;

    // Ubicación física
    private String location;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isLowStock() {
        return minimumQuantity != null && currentQuantity < minimumQuantity;
    }
}
