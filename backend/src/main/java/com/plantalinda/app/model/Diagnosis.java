package com.plantalinda.app.model;

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
public class Diagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl; // Path or URL to the uploaded image

    private String predictedIssue; // e.g., "Nitrogen Deficiency"

    private Double confidence; // e.g., 0.95

    @Column(length = 1000)
    private String correctiveAction; // The "Single Action"

    // Environmental context (optional)
    private String growthStage; // Vegetativo, Floración, etc.
    private String visualSymptoms; // User-described symptoms
    private Double temperature; // °C
    private Double humidity; // %
    private Double ph;
    private Double ec;

    @Column(length = 500)
    private String userNotes; // Additional notes from user

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Multi-tenancy: Relación con la organización
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
