package com.cannabis.app.service;

import com.cannabis.app.dto.*;
import com.cannabis.app.model.Batch;
import com.cannabis.app.model.BatchLog;
import com.cannabis.app.model.BatchStage;
import com.cannabis.app.model.User;
import com.cannabis.app.repository.BatchLogRepository;
import com.cannabis.app.repository.BatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepository batchRepository;
    private final BatchLogRepository batchLogRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public BatchResponse createBatch(CreateBatchRequest request, User user) {
        Batch batch = Batch.builder()
                .name(request.getName())
                .strain(request.getStrain())
                .plantCount(request.getPlantCount())
                .germinationDate(request.getGerminationDate())
                .notes(request.getNotes())
                .currentStage(BatchStage.GERMINATION)
                .user(user)
                .organization(user.getOrganization()) // Set organization
                .build();

        batch = batchRepository.save(batch);
        log.info("Created new batch: {} for user: {} in org: {}",
                batch.getName(), user.getEmail(), user.getOrganization().getName());

        return mapToDto(batch);
    }

    public long countUserBatches(User user) {
        if (user.getOrganization() == null)
            return 0;
        return batchRepository.countByOrganizationId(user.getOrganization().getId());
    }

    public List<BatchResponse> getUserBatches(User user) {
        if (user.getOrganization() == null)
            return List.of();
        return batchRepository.findByOrganizationIdOrderByCreatedAtDesc(user.getOrganization().getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BatchResponse getBatchById(Long batchId, User user) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        if (!batch.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to batch");
        }

        return mapToDto(batch);
    }

    @Transactional
    public BatchResponse updateBatchStage(Long batchId, BatchStage newStage, User user) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        if (!batch.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to batch");
        }

        batch.setCurrentStage(newStage);

        // If moving to HARVEST, set harvest date
        if (newStage == BatchStage.HARVEST && batch.getHarvestDate() == null) {
            batch.setHarvestDate(LocalDate.now());
        }

        batch = batchRepository.save(batch);
        log.info("Updated batch {} to stage: {}", batch.getName(), newStage);

        return mapToDto(batch);
    }

    @Transactional
    public BatchLogResponse createLog(CreateBatchLogRequest request, User user, MultipartFile photo) {
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        if (!batch.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to batch");
        }

        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = fileStorageService.store(photo);
        }

        BatchLog log = BatchLog.builder()
                .batch(batch)
                .ph(request.getPh())
                .ec(request.getEc())
                .temperature(request.getTemperature())
                .humidity(request.getHumidity())
                .notes(request.getNotes())
                .photoUrl(photoUrl)
                .stageAtTime(batch.getCurrentStage())
                .build();

        log = batchLogRepository.save(log);
        this.log.info("Created log entry for batch: {}", batch.getName());

        return mapLogToDto(log);
    }

    public List<BatchLogResponse> getBatchLogs(Long batchId, User user) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        if (!batch.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to batch");
        }

        return batchLogRepository.findByBatchIdOrderByTimestampDesc(batchId)
                .stream()
                .map(this::mapLogToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBatch(Long batchId, User user) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        if (!batch.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to batch");
        }

        // Delete all logs first
        batchLogRepository.deleteAll(batchLogRepository.findByBatchIdOrderByTimestampDesc(batchId));

        // Delete batch
        batchRepository.delete(batch);
        log.info("Deleted batch: {}", batch.getName());
    }

    private BatchResponse mapToDto(Batch batch) {
        LocalDate today = LocalDate.now();
        long totalDays = ChronoUnit.DAYS.between(batch.getGerminationDate(), today);

        return BatchResponse.builder()
                .id(batch.getId())
                .name(batch.getName())
                .strain(batch.getStrain())
                .plantCount(batch.getPlantCount())
                .currentStage(batch.getCurrentStage())
                .germinationDate(batch.getGerminationDate())
                .harvestDate(batch.getHarvestDate())
                .notes(batch.getNotes())
                .createdAt(batch.getCreatedAt())
                .totalDays((int) totalDays)
                .build();
    }

    private BatchLogResponse mapLogToDto(BatchLog log) {
        return BatchLogResponse.builder()
                .id(log.getId())
                .batchId(log.getBatch().getId())
                .timestamp(log.getTimestamp())
                .ph(log.getPh())
                .ec(log.getEc())
                .temperature(log.getTemperature())
                .humidity(log.getHumidity())
                .notes(log.getNotes())
                .photoUrl(log.getPhotoUrl())
                .stageAtTime(log.getStageAtTime())
                .build();
    }
}
