package com.plantalinda.app.model;

public enum MovementType {
    PURCHASE, // Compra
    DONATION, // Donación recibida
    PRODUCTION, // Producción propia (ej: cosecha)
    USAGE, // Uso/Consumo
    SALE, // Venta
    LOSS, // Pérdida/Desperdicio
    TRANSFER, // Transferencia entre ubicaciones
    ADJUSTMENT // Ajuste de inventario
}
