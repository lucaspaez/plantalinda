package com.plantalinda.app.service;

import com.plantalinda.app.model.*;
import com.plantalinda.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final BatchRepository batchRepository;
    private final InventoryItemRepository inventoryItemRepository;

    private final BatchLogRepository batchLogRepository;

    private final PermissionService permissionService;

    @Transactional
    public Report generateReport(User user, ReportType type, LocalDateTime startDate, LocalDateTime endDate) {
        // Verificar permisos para generar reportes
        if (!permissionService.canGenerateReports(user)) {
            throw new RuntimeException("No tiene permisos para generar reportes");
        }

        Report report = Report.builder()
                .user(user)
                .type(type)
                .startDate(startDate)
                .endDate(endDate)
                .status("PENDING")
                .build();

        try {
            String content = generateReportContent(user, type, startDate, endDate);
            report.setContent(content);
            report.setStatus("COMPLETED");
        } catch (Exception e) {
            report.setStatus("FAILED");
            report.setContent("Error: " + e.getMessage());
        }

        return reportRepository.save(report);
    }

    private String generateReportContent(User user, ReportType type, LocalDateTime startDate, LocalDateTime endDate) {
        return switch (type) {
            case REPROCANN_MONTHLY -> generateReprocannReport(user, startDate, endDate);
            case INVENTORY_SUMMARY -> generateInventorySummary(user);
            case BATCH_PRODUCTION -> generateBatchProductionReport(user, startDate, endDate);
            case TRACEABILITY -> generateTraceabilityReport(user, startDate, endDate);
            default -> "{}";
        };
    }

    private String generateReprocannReport(User user, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> data = new HashMap<>();

        // Obtener todos los lotes del período
        List<Batch> batches = batchRepository.findByUserAndCreatedAtBetween(user, startDate, endDate);

        data.put("period", Map.of(
                "start", startDate.toString(),
                "end", endDate.toString()));

        data.put("summary", Map.of(
                "totalBatches", batches.size(),
                "activeBatches", batches.stream().filter(b -> "ACTIVE".equals(b.getStatus())).count(),
                "harvestedBatches", batches.stream().filter(b -> "HARVESTED".equals(b.getStatus())).count()));

        // Producción total
        double totalProduction = batches.stream()
                .filter(b -> b.getHarvestYield() != null)
                .mapToDouble(Batch::getHarvestYield)
                .sum();

        data.put("production", Map.of(
                "totalYield", totalProduction,
                "unit", "g",
                "averagePerBatch", batches.isEmpty() ? 0 : totalProduction / batches.size()));

        // Inventario actual
        List<InventoryItem> inventory = inventoryItemRepository.findByUser(user);
        data.put("inventory", Map.of(
                "totalItems", inventory.size(),
                "lowStockItems", inventory.stream().filter(InventoryItem::isLowStock).count()));

        return convertToJson(data);
    }

    private String generateInventorySummary(User user) {
        List<InventoryItem> items = inventoryItemRepository.findByUser(user);

        Map<String, Object> data = new HashMap<>();
        data.put("totalItems", items.size());
        data.put("lowStockCount", items.stream().filter(InventoryItem::isLowStock).count());

        // Agrupar por tipo
        Map<String, Long> byType = new HashMap<>();
        items.forEach(item -> {
            String type = item.getType().toString();
            byType.put(type, byType.getOrDefault(type, 0L) + 1);
        });
        data.put("itemsByType", byType);

        return convertToJson(data);
    }

    private String generateBatchProductionReport(User user, LocalDateTime startDate, LocalDateTime endDate) {
        List<Batch> batches = batchRepository.findByUserAndCreatedAtBetween(user, startDate, endDate);

        Map<String, Object> data = new HashMap<>();
        data.put("totalBatches", batches.size());
        data.put("batches", batches.stream().map(batch -> Map.of(
                "id", batch.getId(),
                "name", batch.getName(),
                "strain", batch.getStrain() != null ? batch.getStrain() : "N/A",
                "status", batch.getStatus(),
                "plantCount", batch.getPlantCount(),
                "harvestYield", batch.getHarvestYield() != null ? batch.getHarvestYield() : 0)).toList());

        return convertToJson(data);
    }

    private String generateTraceabilityReport(User user, LocalDateTime startDate, LocalDateTime endDate) {
        List<Batch> batches = batchRepository.findByUserAndCreatedAtBetween(user, startDate, endDate);

        Map<String, Object> data = new HashMap<>();
        data.put("batches", batches.stream().map(batch -> {
            List<BatchLog> logs = batchLogRepository.findByBatchOrderByTimestampDesc(batch);

            return Map.of(
                    "batchId", batch.getId(),
                    "batchName", batch.getName(),
                    "totalLogs", logs.size(),
                    "timeline", logs.stream().map(log -> Map.of(
                            "date", log.getTimestamp().toString(),
                            "type", log.getType() != null ? log.getType() : "LOG",
                            "notes", log.getNotes() != null ? log.getNotes() : "")).toList());
        }).toList());

        return convertToJson(data);
    }

    public List<Report> getUserReports(User user) {
        return reportRepository.findByUserOrderByCreatedAtDesc(user);
    }

    private String convertToJson(Map<String, Object> data) {
        // Implementación simple de conversión a JSON
        // En producción, usar ObjectMapper de Jackson
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(data);
        } catch (Exception e) {
            return "{}";
        }
    }
}
