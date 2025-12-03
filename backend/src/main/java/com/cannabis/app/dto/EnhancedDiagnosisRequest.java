package com.cannabis.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnhancedDiagnosisRequest {
    // Environmental context (optional)
    private String growthStage; // "Vegetativo", "Floración", etc.
    private String visualSymptoms; // User-described symptoms
    private Double temperature;
    private Double humidity;
    private Double ph;
    private Double ec;
    private String userNotes;
}
