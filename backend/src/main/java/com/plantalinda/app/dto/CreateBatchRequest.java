package com.plantalinda.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBatchRequest {
    private String name;
    private String strain;
    private Integer plantCount;
    private LocalDate germinationDate;
    private String notes;
}
