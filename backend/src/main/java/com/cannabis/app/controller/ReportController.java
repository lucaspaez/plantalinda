package com.cannabis.app.controller;

import com.cannabis.app.model.Report;
import com.cannabis.app.model.ReportType;
import com.cannabis.app.model.User;
import com.cannabis.app.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/generate")
    public ResponseEntity<Report> generateReport(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> request) {
        ReportType type = ReportType.valueOf(request.get("type"));
        // Parsear usando ZonedDateTime para manejar la 'Z' y convertir a LocalDateTime
        LocalDateTime startDate = ZonedDateTime.parse(request.get("startDate")).toLocalDateTime();
        LocalDateTime endDate = ZonedDateTime.parse(request.get("endDate")).toLocalDateTime();

        Report report = reportService.generateReport(user, type, startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping
    public ResponseEntity<List<Report>> getUserReports(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reportService.getUserReports(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReport(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Report report = reportService.getUserReports(user).stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));

        return ResponseEntity.ok(report);
    }
}
