package com.plantalinda.app.model;

public enum NotificationType {
    INFO, // Información general
    SUCCESS, // Operación exitosa
    WARNING, // Advertencia (ej: stock bajo)
    ERROR, // Error
    BATCH_UPDATE, // Actualización de lote
    INVENTORY_LOW, // Inventario bajo
    DIAGNOSIS // Nuevo diagnóstico
}
