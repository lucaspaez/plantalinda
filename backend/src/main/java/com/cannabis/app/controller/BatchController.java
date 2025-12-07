package com.cannabis.app.controller;

import com.cannabis.app.dto.*;
import com.cannabis.app.model.BatchStage;
import com.cannabis.app.model.Role;
import com.cannabis.app.model.User;
import com.cannabis.app.service.BatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;
    private final com.cannabis.app.service.PermissionService permissionService;

    @PostMapping
    public ResponseEntity<BatchResponse> createBatch(
            @RequestBody CreateBatchRequest request,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "create batch");

        if (!permissionService.canCreateBatches(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Check plan limits
        long currentBatches = batchService.countUserBatches(user);
        if (!permissionService.canAddBatch(user, currentBatches)) {
            throw new IllegalStateException(
                    "Has alcanzado el límite de lotes de tu plan. Actualiza a PRO para lotes ilimitados.");
        }

        BatchResponse response = batchService.createBatch(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BatchResponse>> getUserBatches(@AuthenticationPrincipal User user) {
        permissionService.requirePermission(user, "view batches");
        List<BatchResponse> batches = batchService.getUserBatches(user);
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/{batchId}")
    public ResponseEntity<BatchResponse> getBatch(
            @PathVariable Long batchId,
            @AuthenticationPrincipal User user) {
        permissionService.requirePermission(user, "view batch");
        BatchResponse response = batchService.getBatchById(batchId, user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{batchId}/stage")
    public ResponseEntity<BatchResponse> updateStage(
            @PathVariable Long batchId,
            @RequestParam BatchStage stage,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "update batch");
        if (!permissionService.canUpdateBatches(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        BatchResponse response = batchService.updateBatchStage(batchId, stage, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{batchId}")
    public ResponseEntity<Void> deleteBatch(
            @PathVariable Long batchId,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "delete batch");
        if (!permissionService.canDeleteBatches(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        batchService.deleteBatch(batchId, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logs")
    public ResponseEntity<BatchLogResponse> createLog(
            @RequestBody CreateBatchLogRequest request,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "create log");
        if (!permissionService.canCreateBatchLogs(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        BatchLogResponse response = batchService.createLog(request, user, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{batchId}/logs")
    public ResponseEntity<List<BatchLogResponse>> getBatchLogs(
            @PathVariable Long batchId,
            @AuthenticationPrincipal User user) {

        permissionService.requirePermission(user, "view logs");
        List<BatchLogResponse> logs = batchService.getBatchLogs(batchId, user);
        return ResponseEntity.ok(logs);
    }
}
