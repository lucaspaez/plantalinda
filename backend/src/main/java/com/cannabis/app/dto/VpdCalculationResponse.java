package com.cannabis.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VpdCalculationResponse {
    private Double vpd; // kPa
    private String status; // "OPTIMAL", "LOW", "HIGH", "DANGER"
    private String message;
    private Double minRecommended;
    private Double maxRecommended;
}
