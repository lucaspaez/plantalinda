package com.cannabis.app.service;

import com.cannabis.app.model.Role;
import com.cannabis.app.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Servicio para validar permisos de usuarios según su rol.
 * 
 * Matriz de permisos:
 * - OWNER: Control total de la organización
 * - ADMIN: Gestión de usuarios y configuración
 * - MANAGER: Ver reportes y gestionar operaciones
 * - OPERATOR: Crear bitácoras y diagnósticos
 * - VIEWER: Solo lectura
 * - SUPER_ADMIN: Acceso a todas las organizaciones (soporte)
 */
@Slf4j
@Service
public class PermissionService {

    // ==================== GESTIÓN DE ORGANIZACIÓN ====================

    public boolean canManageOrganization(User user) {
        return user.getRole() == Role.OWNER || user.getRole() == Role.SUPER_ADMIN;
    }

    public boolean canUpdateOrganizationSettings(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    // ==================== GESTIÓN DE USUARIOS ====================

    public boolean canInviteUsers(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    public boolean canAssignRoles(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    public boolean canRemoveUsers(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    public boolean canAssignRole(User assigner, Role targetRole) {
        // OWNER puede asignar cualquier rol excepto SUPER_ADMIN
        if (assigner.getRole() == Role.OWNER) {
            return targetRole != Role.SUPER_ADMIN;
        }

        // ADMIN puede asignar roles operativos
        if (assigner.getRole() == Role.ADMIN) {
            return targetRole == Role.MANAGER ||
                    targetRole == Role.OPERATOR ||
                    targetRole == Role.VIEWER;
        }

        // SUPER_ADMIN puede asignar cualquier rol
        if (assigner.getRole() == Role.SUPER_ADMIN) {
            return true;
        }

        return false;
    }

    // ==================== REPORTES ====================

    public boolean canGenerateReports(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.MANAGER ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    public boolean canViewReports(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.MANAGER ||
                user.getRole() == Role.VIEWER ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    public boolean canViewFinancialReports(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    // ==================== OPERACIONES ====================

    public boolean canCreateBatches(User user) {
        return user.getRole() != Role.VIEWER;
    }

    public boolean canUpdateBatches(User user) {
        return user.getRole() != Role.VIEWER;
    }

    public boolean canDeleteBatches(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.MANAGER ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    public boolean canCreateDiagnosis(User user) {
        return user.getRole() != Role.VIEWER;
    }

    public boolean canManageInventory(User user) {
        return user.getRole() != Role.VIEWER;
    }

    // ==================== BITÁCORAS ====================

    // ==================== BITÁCORAS ====================

    public boolean canCreateBatchLogs(User user) {
        return user.getRole() != Role.VIEWER;
    }

    public boolean canViewBatchLogs(User user) {
        return true; // Todos pueden ver bitácoras
    }

    // ==================== LIMITES DEL PLAN ====================

    public boolean canAccessProFeatures(User user) {
        if (user.getOrganization() == null)
            return false;
        return user.getOrganization().getPlan() == com.cannabis.app.model.PlanType.PRO ||
                user.getOrganization().getPlan() == com.cannabis.app.model.PlanType.ENTERPRISE;
    }

    public boolean canAddBatch(User user, long currentBatches) {
        if (canAccessProFeatures(user)) {
            return true; // PRO/ENTERPRISE have unlimited batches
        }
        // FREE plan limit
        return currentBatches < 5;
    }

    // ==================== VALIDACIONES GENERALES ====================

    public void requirePermission(User user, String action) {
        if (user == null) {
            throw new SecurityException("Usuario no autenticado");
        }

        if (user.getOrganization() == null && user.getRole() != Role.SUPER_ADMIN) {
            throw new SecurityException("Usuario no pertenece a ninguna organización");
        }
    }

    public void requireRole(User user, Role... allowedRoles) {
        requirePermission(user, "access");

        for (Role role : allowedRoles) {
            if (user.getRole() == role) {
                return;
            }
        }

        throw new SecurityException("Permiso denegado. Rol requerido: " +
                String.join(" o ", java.util.Arrays.stream(allowedRoles)
                        .map(Enum::name)
                        .toArray(String[]::new)));
    }

    public boolean isOwnerOrAdmin(User user) {
        return user.getRole() == Role.OWNER ||
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.SUPER_ADMIN;
    }

    public boolean isSuperAdmin(User user) {
        return user.getRole() == Role.SUPER_ADMIN;
    }

    // ==================== LOGGING ====================

    public void logPermissionCheck(User user, String action, boolean granted) {
        if (granted) {
            log.debug("Permission GRANTED - User: {}, Role: {}, Action: {}",
                    user.getEmail(), user.getRole(), action);
        } else {
            log.warn("Permission DENIED - User: {}, Role: {}, Action: {}",
                    user.getEmail(), user.getRole(), action);
        }
    }
}
