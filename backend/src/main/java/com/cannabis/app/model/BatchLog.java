package com.cannabis.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "batch_log")
public class BatchLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // Environmental measurements
    private Double ph;
    private Double ec; // Electrical Conductivity
    private Double temperature; // °C
    private Double humidity; // %

    @Column(length = 2000)
    private String notes; // Observaciones del día

    private String photoUrl; // URL de foto del progreso

    @Enumerated(EnumType.STRING)
    private BatchStage stageAtTime; // Etapa en ese momento

    private String type; // MEDICION, RIEGO, PODA, NOTA, ETC

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
