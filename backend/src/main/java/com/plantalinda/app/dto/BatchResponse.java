package com.plantalinda.app.dto;

import com.plantalinda.app.model.BatchStage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchResponse {
    private Long id;
    private String name;
    private String strain;
    private Integer plantCount;
    private BatchStage currentStage;
    private LocalDate germinationDate;
    private LocalDate harvestDate;
    private String notes;
    private LocalDateTime createdAt;
    private Integer daysInCurrentStage;
    private Integer totalDays;
}
