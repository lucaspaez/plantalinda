package com.cannabis.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferencesResponse {
    // VPD Ranges
    private Double vpdVegMin;
    private Double vpdVegMax;
    private Double vpdFlowerMin;
    private Double vpdFlowerMax;

    // Temperature Ranges
    private Double tempVegDayMin;
    private Double tempVegDayMax;
    private Double tempVegNightMin;
    private Double tempVegNightMax;
    private Double tempFlowerDayMin;
    private Double tempFlowerDayMax;
    private Double tempFlowerNightMin;
    private Double tempFlowerNightMax;

    // Humidity Ranges
    private Double humidityVegMin;
    private Double humidityVegMax;
    private Double humidityFlowerMin;
    private Double humidityFlowerMax;

    // pH and EC Ranges
    private Double phMin;
    private Double phMax;
    private Double ecVegMin;
    private Double ecVegMax;
    private Double ecFlowerMin;
    private Double ecFlowerMax;
}
