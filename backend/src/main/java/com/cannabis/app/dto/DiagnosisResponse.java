package com.cannabis.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DiagnosisResponse {
    private Long id;
    private String imageUrl;
    private String predictedIssue;
    private Double confidence;
    private String correctiveAction;
    private LocalDateTime createdAt;
}
