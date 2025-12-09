package com.plantalinda.app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reports")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({ "organization", "password", "hibernateLazyInitializer", "handler" })
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(columnDefinition = "TEXT")
    private String content; // JSON content

    @Column(nullable = false)
    private String status; // PENDING, COMPLETED, FAILED

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private String filePath; // Path to generated PDF/CSV
}
