package com.plantalinda.app.model;

public enum Role {
    // Nivel Organización
    OWNER, // Dueño de la organización, control total
    ADMIN, // Administrador, puede gestionar usuarios y configuración

    // Nivel Operativo
    MANAGER, // Gerente, puede ver reportes y gestionar operaciones
    OPERATOR, // Operador, puede crear bitácoras y diagnósticos
    VIEWER, // Solo lectura, puede ver datos pero no modificar

    // Nivel Sistema (para soporte técnico)
    SUPER_ADMIN // Acceso a todas las organizaciones (soporte)
}
