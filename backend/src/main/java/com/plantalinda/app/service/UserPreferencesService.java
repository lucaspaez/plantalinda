package com.plantalinda.app.service;

import com.plantalinda.app.dto.UserPreferencesResponse;
import com.plantalinda.app.model.User;
import com.plantalinda.app.model.UserPreferences;
import com.plantalinda.app.repository.UserPreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserPreferencesService {

    private final UserPreferencesRepository userPreferencesRepository;

    public UserPreferencesResponse getUserPreferences(User user) {
        UserPreferences prefs = userPreferencesRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultPreferences(user));

        return mapToDto(prefs);
    }

    @Transactional
    public UserPreferencesResponse updatePreferences(User user, UserPreferencesResponse request) {
        UserPreferences prefs = userPreferencesRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultPreferences(user));

        // Update all fields
        prefs.setVpdVegMin(request.getVpdVegMin());
        prefs.setVpdVegMax(request.getVpdVegMax());
        prefs.setVpdFlowerMin(request.getVpdFlowerMin());
        prefs.setVpdFlowerMax(request.getVpdFlowerMax());

        prefs.setTempVegDayMin(request.getTempVegDayMin());
        prefs.setTempVegDayMax(request.getTempVegDayMax());
        prefs.setTempVegNightMin(request.getTempVegNightMin());
        prefs.setTempVegNightMax(request.getTempVegNightMax());
        prefs.setTempFlowerDayMin(request.getTempFlowerDayMin());
        prefs.setTempFlowerDayMax(request.getTempFlowerDayMax());
        prefs.setTempFlowerNightMin(request.getTempFlowerNightMin());
        prefs.setTempFlowerNightMax(request.getTempFlowerNightMax());

        prefs.setHumidityVegMin(request.getHumidityVegMin());
        prefs.setHumidityVegMax(request.getHumidityVegMax());
        prefs.setHumidityFlowerMin(request.getHumidityFlowerMin());
        prefs.setHumidityFlowerMax(request.getHumidityFlowerMax());

        prefs.setPhMin(request.getPhMin());
        prefs.setPhMax(request.getPhMax());
        prefs.setEcVegMin(request.getEcVegMin());
        prefs.setEcVegMax(request.getEcVegMax());
        prefs.setEcFlowerMin(request.getEcFlowerMin());
        prefs.setEcFlowerMax(request.getEcFlowerMax());

        prefs = userPreferencesRepository.save(prefs);
        log.info("Updated preferences for user: {}", user.getEmail());

        return mapToDto(prefs);
    }

    @Transactional
    public UserPreferencesResponse resetToDefaults(User user) {
        UserPreferences prefs = userPreferencesRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultPreferences(user));

        prefs.resetToDefaults();
        prefs = userPreferencesRepository.save(prefs);
        log.info("Reset preferences to defaults for user: {}", user.getEmail());

        return mapToDto(prefs);
    }

    private UserPreferences createDefaultPreferences(User user) {
        UserPreferences prefs = UserPreferences.builder()
                .user(user)
                .build();
        return userPreferencesRepository.save(prefs);
    }

    private UserPreferencesResponse mapToDto(UserPreferences prefs) {
        return UserPreferencesResponse.builder()
                .vpdVegMin(prefs.getVpdVegMin())
                .vpdVegMax(prefs.getVpdVegMax())
                .vpdFlowerMin(prefs.getVpdFlowerMin())
                .vpdFlowerMax(prefs.getVpdFlowerMax())
                .tempVegDayMin(prefs.getTempVegDayMin())
                .tempVegDayMax(prefs.getTempVegDayMax())
                .tempVegNightMin(prefs.getTempVegNightMin())
                .tempVegNightMax(prefs.getTempVegNightMax())
                .tempFlowerDayMin(prefs.getTempFlowerDayMin())
                .tempFlowerDayMax(prefs.getTempFlowerDayMax())
                .tempFlowerNightMin(prefs.getTempFlowerNightMin())
                .tempFlowerNightMax(prefs.getTempFlowerNightMax())
                .humidityVegMin(prefs.getHumidityVegMin())
                .humidityVegMax(prefs.getHumidityVegMax())
                .humidityFlowerMin(prefs.getHumidityFlowerMin())
                .humidityFlowerMax(prefs.getHumidityFlowerMax())
                .phMin(prefs.getPhMin())
                .phMax(prefs.getPhMax())
                .ecVegMin(prefs.getEcVegMin())
                .ecVegMax(prefs.getEcVegMax())
                .ecFlowerMin(prefs.getEcFlowerMin())
                .ecFlowerMax(prefs.getEcFlowerMax())
                .build();
    }
}
