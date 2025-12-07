package com.plantalinda.app.service;

import com.plantalinda.app.dto.DiagnosisResponse;
import com.plantalinda.app.dto.EnhancedDiagnosisRequest;
import com.plantalinda.app.model.Diagnosis;
import com.plantalinda.app.model.User;
import com.plantalinda.app.repository.DiagnosisRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiagnosisService {

    private final DiagnosisRepository repository;
    private final FileStorageService fileStorageService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public DiagnosisResponse analyze(MultipartFile file, User user) {
        return analyzeWithContext(file, null, user);
    }

    public DiagnosisResponse analyzeWithContext(MultipartFile file, EnhancedDiagnosisRequest context, User user) {
        // 1. Store the image
        String imageUrl = fileStorageService.store(file);

        // 2. Call AI Service
        String predictedIssue;
        Double confidence;
        String correctiveAction;

        try {
            log.info("Calling AI service at: {}/analyze", aiServiceUrl);

            // Prepare multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            // Add context if available
            if (context != null) {
                body.add("growth_stage", context.getGrowthStage());
                body.add("visual_symptoms", context.getVisualSymptoms());
                if (context.getTemperature() != null)
                    body.add("temperature", context.getTemperature().toString());
                if (context.getHumidity() != null)
                    body.add("humidity", context.getHumidity().toString());
                if (context.getPh() != null)
                    body.add("ph", context.getPh().toString());
                if (context.getEc() != null)
                    body.add("ec", context.getEc().toString());
                body.add("user_notes", context.getUserNotes());
            }

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Call AI service
            ResponseEntity<String> response = restTemplate.exchange(
                    aiServiceUrl + "/analyze",
                    HttpMethod.POST,
                    requestEntity,
                    String.class);

            // Parse response
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            predictedIssue = jsonResponse.get("predicted_issue").asText();
            confidence = jsonResponse.get("confidence").asDouble();
            correctiveAction = jsonResponse.get("corrective_action").asText();

            log.info("AI analysis successful: {} (confidence: {})", predictedIssue, confidence);

        } catch (Exception e) {
            log.error("Error calling AI service, using fallback: {}", e.getMessage());
            // Fallback to mock response if AI service is unavailable
            predictedIssue = "Nitrogen Deficiency (AI Service Unavailable)";
            confidence = 0.85;
            correctiveAction = "Apply a nitrogen-rich fertilizer. Ensure pH is between 6.0 and 6.5. Note: This is a fallback response.";
        }

        // 3. Save Result with context
        Diagnosis.DiagnosisBuilder builder = Diagnosis.builder()
                .imageUrl(imageUrl)
                .predictedIssue(predictedIssue)
                .confidence(confidence)
                .correctiveAction(correctiveAction)
                .user(user);

        if (context != null) {
            builder.growthStage(context.getGrowthStage())
                    .visualSymptoms(context.getVisualSymptoms())
                    .temperature(context.getTemperature())
                    .humidity(context.getHumidity())
                    .ph(context.getPh())
                    .ec(context.getEc())
                    .userNotes(context.getUserNotes());
        }

        Diagnosis diagnosis = builder.build();
        repository.save(diagnosis);

        return mapToDto(diagnosis);
    }

    public List<DiagnosisResponse> getUserHistory(User user) {
        return repository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private DiagnosisResponse mapToDto(Diagnosis diagnosis) {
        return DiagnosisResponse.builder()
                .id(diagnosis.getId())
                .imageUrl(diagnosis.getImageUrl())
                .predictedIssue(diagnosis.getPredictedIssue())
                .confidence(diagnosis.getConfidence())
                .correctiveAction(diagnosis.getCorrectiveAction())
                .createdAt(diagnosis.getCreatedAt())
                .build();
    }
}
