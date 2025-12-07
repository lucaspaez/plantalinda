package com.plantalinda.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VpdCalculationRequest {
    private Double temperature; // °C
    private Double humidity; // %
    private String stage; // "VEGETATIVE" or "FLOWERING"
}
