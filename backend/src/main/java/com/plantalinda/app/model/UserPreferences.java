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
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Rangos VPD personalizados (JSON o campos individuales)
    // Vegetativo
    private Double vpdVegMin;
    private Double vpdVegMax;

    // Floración
    private Double vpdFlowerMin;
    private Double vpdFlowerMax;

    // Rangos de Temperatura personalizados
    private Double tempVegDayMin;
    private Double tempVegDayMax;
    private Double tempVegNightMin;
    private Double tempVegNightMax;

    private Double tempFlowerDayMin;
    private Double tempFlowerDayMax;
    private Double tempFlowerNightMin;
    private Double tempFlowerNightMax;

    // Rangos de Humedad personalizados
    private Double humidityVegMin;
    private Double humidityVegMax;
    private Double humidityFlowerMin;
    private Double humidityFlowerMax;

    // Rangos de pH personalizados
    private Double phMin;
    private Double phMax;

    // Rangos de EC personalizados
    private Double ecVegMin;
    private Double ecVegMax;
    private Double ecFlowerMin;
    private Double ecFlowerMax;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        setDefaultValues();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private void setDefaultValues() {
        // Valores profesionales por defecto
        if (vpdVegMin == null)
            vpdVegMin = 0.8;
        if (vpdVegMax == null)
            vpdVegMax = 1.1;
        if (vpdFlowerMin == null)
            vpdFlowerMin = 1.0;
        if (vpdFlowerMax == null)
            vpdFlowerMax = 1.5;

        if (tempVegDayMin == null)
            tempVegDayMin = 22.0;
        if (tempVegDayMax == null)
            tempVegDayMax = 28.0;
        if (tempVegNightMin == null)
            tempVegNightMin = 18.0;
        if (tempVegNightMax == null)
            tempVegNightMax = 22.0;

        if (tempFlowerDayMin == null)
            tempFlowerDayMin = 20.0;
        if (tempFlowerDayMax == null)
            tempFlowerDayMax = 26.0;
        if (tempFlowerNightMin == null)
            tempFlowerNightMin = 18.0;
        if (tempFlowerNightMax == null)
            tempFlowerNightMax = 22.0;

        if (humidityVegMin == null)
            humidityVegMin = 55.0;
        if (humidityVegMax == null)
            humidityVegMax = 70.0;
        if (humidityFlowerMin == null)
            humidityFlowerMin = 40.0;
        if (humidityFlowerMax == null)
            humidityFlowerMax = 50.0;

        if (phMin == null)
            phMin = 5.8;
        if (phMax == null)
            phMax = 6.2;

        if (ecVegMin == null)
            ecVegMin = 0.8;
        if (ecVegMax == null)
            ecVegMax = 1.5;
        if (ecFlowerMin == null)
            ecFlowerMin = 1.2;
        if (ecFlowerMax == null)
            ecFlowerMax = 2.0;
    }

    public void resetToDefaults() {
        vpdVegMin = 0.8;
        vpdVegMax = 1.1;
        vpdFlowerMin = 1.0;
        vpdFlowerMax = 1.5;

        tempVegDayMin = 22.0;
        tempVegDayMax = 28.0;
        tempVegNightMin = 18.0;
        tempVegNightMax = 22.0;

        tempFlowerDayMin = 20.0;
        tempFlowerDayMax = 26.0;
        tempFlowerNightMin = 18.0;
        tempFlowerNightMax = 22.0;

        humidityVegMin = 55.0;
        humidityVegMax = 70.0;
        humidityFlowerMin = 40.0;
        humidityFlowerMax = 50.0;

        phMin = 5.8;
        phMax = 6.2;

        ecVegMin = 0.8;
        ecVegMax = 1.5;
        ecFlowerMin = 1.2;
        ecFlowerMax = 2.0;
    }
}
