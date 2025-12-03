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

    @PostMapping
    @PreAuthorize("hasAuthority('PRO') or hasAuthority('ADMIN')")
    public ResponseEntity<BatchResponse> createBatch(
            @RequestBody CreateBatchRequest request,
            @AuthenticationPrincipal User user) {

        // Verify user is PRO or ADMIN
        if (user.getRole() != Role.PRO && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        BatchResponse response = batchService.createBatch(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PRO') or hasAuthority('ADMIN')")
    public ResponseEntity<List<BatchResponse>> getUserBatches(@AuthenticationPrincipal User user) {
        if (user.getRole() != Role.PRO && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<BatchResponse> batches = batchService.getUserBatches(user);
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/{batchId}")
    @PreAuthorize("hasAuthority('PRO') or hasAuthority('ADMIN')")
    public ResponseEntity<BatchResponse> getBatch(
            @PathVariable Long batchId,
            @AuthenticationPrincipal User user) {

        if (user.getRole() != Role.PRO && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        BatchResponse response = batchService.getBatchById(batchId, user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{batchId}/stage")
    @PreAuthorize("hasAuthority('PRO') or hasAuthority('ADMIN')")
    public ResponseEntity<BatchResponse> updateStage(
            @PathVariable Long batchId,
            @RequestParam BatchStage stage,
            @AuthenticationPrincipal User user) {

        if (user.getRole() != Role.PRO && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        BatchResponse response = batchService.updateBatchStage(batchId, stage, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{batchId}")
    @PreAuthorize("hasAuthority('PRO') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteBatch(
            @PathVariable Long batchId,
            @AuthenticationPrincipal User user) {

        if (user.getRole() != Role.PRO && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        batchService.deleteBatch(batchId, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logs")
    @PreAuthorize("hasAuthority('PRO') or hasAuthority('ADMIN')")
    public ResponseEntity<BatchLogResponse> createLog(
            @RequestBody CreateBatchLogRequest request,
            @AuthenticationPrincipal User user) {

        if (user.getRole() != Role.PRO && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        BatchLogResponse response = batchService.createLog(request, user, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{batchId}/logs")
    @PreAuthorize("hasAuthority('PRO') or hasAuthority('ADMIN')")
    public ResponseEntity<List<BatchLogResponse>> getBatchLogs(
            @PathVariable Long batchId,
            @AuthenticationPrincipal User user) {

        if (user.getRole() != Role.PRO && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<BatchLogResponse> logs = batchService.getBatchLogs(batchId, user);
        return ResponseEntity.ok(logs);
    }
}
