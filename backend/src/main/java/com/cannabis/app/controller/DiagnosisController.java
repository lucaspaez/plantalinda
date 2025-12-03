package com.cannabis.app.controller;

import com.cannabis.app.dto.DiagnosisResponse;
import com.cannabis.app.dto.EnhancedDiagnosisRequest;
import com.cannabis.app.model.User;
import com.cannabis.app.service.DiagnosisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/diagnosis")
@RequiredArgsConstructor
public class DiagnosisController {

    private final DiagnosisService service;
    private final ObjectMapper objectMapper;

    @PostMapping("/analyze")
    public ResponseEntity<DiagnosisResponse> analyze(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "context", required = false) String contextJson,
            @AuthenticationPrincipal User user) {

        EnhancedDiagnosisRequest context = null;
        if (contextJson != null && !contextJson.isEmpty()) {
            try {
                context = objectMapper.readValue(contextJson, EnhancedDiagnosisRequest.class);
            } catch (Exception e) {
                // If parsing fails, continue without context
            }
        }

        return ResponseEntity.ok(service.analyzeWithContext(image, context, user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<DiagnosisResponse>> getHistory(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getUserHistory(user));
    }
}
