package com.plantalinda.app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "organization")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String slug; // URL-friendly identifier (ej: "mi-empresa")

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanType plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnoreProperties({ "organization", "password", "authorities", "hibernateLazyInitializer", "handler" })
    private User owner;

    @Column(columnDefinition = "TEXT")
    private String settings; // JSON con configuraciones del tenant

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "max_users")
    private Integer maxUsers; // Límite de usuarios según el plan

    @Column(name = "max_batches")
    private Integer maxBatches; // Límite de lotes según el plan

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (active == null) {
            active = true;
        }
        if (plan == null) {
            plan = PlanType.FREE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public boolean canAddUser() {
        return maxUsers == null || maxUsers > 0;
    }

    public boolean canAddBatch() {
        return maxBatches == null || maxBatches > 0;
    }
}
