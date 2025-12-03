package com.cannabis.app.controller;

import com.cannabis.app.dto.UserPreferencesResponse;
import com.cannabis.app.dto.VpdCalculationRequest;
import com.cannabis.app.dto.VpdCalculationResponse;
import com.cannabis.app.model.User;
import com.cannabis.app.service.UserPreferencesService;
import com.cannabis.app.service.VpdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tools")
@RequiredArgsConstructor
public class ToolsController {

    private final VpdService vpdService;
    private final UserPreferencesService preferencesService;

    @PostMapping("/vpd/calculate")
    public ResponseEntity<VpdCalculationResponse> calculateVpd(
            @RequestBody VpdCalculationRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(vpdService.calculateVpd(request, user));
    }

    @GetMapping("/preferences")
    public ResponseEntity<UserPreferencesResponse> getPreferences(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(preferencesService.getUserPreferences(user));
    }

    @PutMapping("/preferences")
    public ResponseEntity<UserPreferencesResponse> updatePreferences(
            @RequestBody UserPreferencesResponse request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(preferencesService.updatePreferences(user, request));
    }

    @PostMapping("/preferences/reset")
    public ResponseEntity<UserPreferencesResponse> resetPreferences(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(preferencesService.resetToDefaults(user));
    }
}
