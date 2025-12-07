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
@Table(name = "batch")
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String strain; // Cepa (ej: "OG Kush", "White Widow")

    @Column(nullable = false)
    private Integer plantCount; // Cantidad de plantas

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BatchStage currentStage;

    @Column(nullable = false)
    private LocalDate germinationDate; // Fecha de germinación

    private LocalDate harvestDate; // Fecha de cosecha (null hasta que se coseche)

    private Double harvestYield; // Rendimiento en gramos

    private String status; // ACTIVE, HARVESTED, COMPLETED

    @Column(length = 1000)
    private String notes; // Notas generales del lote

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Multi-tenancy: Relación con la organización
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (currentStage == null) {
            currentStage = BatchStage.GERMINATION;
        }
    }
}
