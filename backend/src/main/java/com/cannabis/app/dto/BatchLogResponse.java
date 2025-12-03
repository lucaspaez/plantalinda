package com.cannabis.app.dto;

import com.cannabis.app.model.BatchStage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchLogResponse {
    private Long id;
    private Long batchId;
    private LocalDateTime timestamp;
    private Double ph;
    private Double ec;
    private Double temperature;
    private Double humidity;
    private String notes;
    private String photoUrl;
    private BatchStage stageAtTime;
}
