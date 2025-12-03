package com.cannabis.app.service;

import com.cannabis.app.dto.VpdCalculationRequest;
import com.cannabis.app.dto.VpdCalculationResponse;
import com.cannabis.app.model.User;
import com.cannabis.app.model.UserPreferences;
import com.cannabis.app.repository.UserPreferencesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VpdService {

    private final UserPreferencesRepository userPreferencesRepository;

    public VpdCalculationResponse calculateVpd(VpdCalculationRequest request, User user) {
        Double temperature = request.getTemperature();
        Double humidity = request.getHumidity();
        String stage = request.getStage();

        // Calculate VPD using the formula
        // SVP = 0.61078 * exp((17.27 * T) / (T + 237.3))
        // AVP = SVP * (RH / 100)
        // VPD = SVP - AVP

        double svp = 0.61078 * Math.exp((17.27 * temperature) / (temperature + 237.3));
        double avp = svp * (humidity / 100.0);
        double vpd = svp - avp;

        // Get user preferences for ranges
        UserPreferences prefs = userPreferencesRepository.findByUserId(user.getId())
                .orElse(null);

        Double minRecommended;
        Double maxRecommended;

        if ("FLOWERING".equalsIgnoreCase(stage)) {
            minRecommended = prefs != null ? prefs.getVpdFlowerMin() : 1.0;
            maxRecommended = prefs != null ? prefs.getVpdFlowerMax() : 1.5;
        } else {
            minRecommended = prefs != null ? prefs.getVpdVegMin() : 0.8;
            maxRecommended = prefs != null ? prefs.getVpdVegMax() : 1.1;
        }

        // Determine status
        String status;
        String message;

        if (vpd < 0.4) {
            status = "DANGER";
            message = "PELIGRO: Alto riesgo de moho y hongos";
        } else if (vpd < minRecommended) {
            status = "LOW";
            message = "VPD bajo - Aumentar temperatura o reducir humedad";
        } else if (vpd > maxRecommended) {
            status = "HIGH";
            message = "VPD alto - Ambiente muy seco, aumentar humedad";
        } else {
            status = "OPTIMAL";
            message = "✅ VPD óptimo para esta etapa";
        }

        return VpdCalculationResponse.builder()
                .vpd(Math.round(vpd * 100.0) / 100.0) // Round to 2 decimals
                .status(status)
                .message(message)
                .minRecommended(minRecommended)
                .maxRecommended(maxRecommended)
                .build();
    }
}
