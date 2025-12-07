package com.plantalinda.app.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Contexto de tenant (organización) para el thread actual.
 * Permite mantener el ID de la organización durante toda la petición HTTP.
 * 
 * IMPORTANTE: Este contexto se limpia automáticamente después de cada petición
 * para evitar fugas de datos entre requests.
 */
@Slf4j
@Component
public class TenantContext {

    private static final ThreadLocal<Long> currentTenant = new ThreadLocal<>();

    /**
     * Establece el ID de la organización para el thread actual
     */
    public static void setTenantId(Long tenantId) {
        if (tenantId != null) {
            log.debug("Setting tenant context: {}", tenantId);
            currentTenant.set(tenantId);
        } else {
            log.warn("Attempted to set null tenant ID");
        }
    }

    /**
     * Obtiene el ID de la organización del thread actual
     */
    public static Long getTenantId() {
        Long tenantId = currentTenant.get();
        if (tenantId == null) {
            log.warn("No tenant context set for current thread");
        }
        return tenantId;
    }

    /**
     * Verifica si hay un tenant establecido
     */
    public static boolean hasTenant() {
        return currentTenant.get() != null;
    }

    /**
     * Limpia el contexto del tenant
     * CRÍTICO: Debe llamarse al final de cada petición
     */
    public static void clear() {
        Long tenantId = currentTenant.get();
        if (tenantId != null) {
            log.debug("Clearing tenant context: {}", tenantId);
        }
        currentTenant.remove();
    }
}
