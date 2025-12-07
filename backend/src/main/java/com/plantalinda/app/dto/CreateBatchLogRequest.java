package com.plantalinda.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBatchLogRequest {
    private Long batchId;
    private Double ph;
    private Double ec;
    private Double temperature;
    private Double humidity;
    private String notes;
}
