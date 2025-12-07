/**
 * Definición de permisos por rol
 * 
 * Roles:
 * - OWNER: Control total de la organización
 * - ADMIN: Puede invitar usuarios y asignar roles
 * - MANAGER: Puede ver reportes y gestionar cultivos (lotes/inventario)
 * - OPERATOR: Puede crear bitácoras diarias y diagnósticos
 * - VIEWER: Solo puede ver datos, sin modificar
 */

export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';

export interface RolePermissions {
    canInviteUsers: boolean;
    canRemoveUsers: boolean;       // Eliminar usuarios del equipo
    canManageRoles: boolean;
    canViewReports: boolean;
    canGenerateReports: boolean;   // Crear/generar reportes
    canManageInventory: boolean;
    canViewBatches: boolean;       // Ver lotes existentes
    canManageBatches: boolean;     // Crear/editar/eliminar lotes
    canCreateDiagnosis: boolean;
    canCreateLogEntries: boolean;  // Crear entradas de bitácora
    canViewTeam: boolean;
    canDeleteData: boolean;
    canModifyData: boolean;
}

const rolePermissions: Record<Role, RolePermissions> = {
    OWNER: {
        canInviteUsers: true,
        canRemoveUsers: true,
        canManageRoles: true,
        canViewReports: true,
        canGenerateReports: true,
        canManageInventory: true,
        canViewBatches: true,
        canManageBatches: true,
        canCreateDiagnosis: true,
        canCreateLogEntries: true,
        canViewTeam: true,
        canDeleteData: true,
        canModifyData: true,
    },
    ADMIN: {
        canInviteUsers: true,
        canRemoveUsers: true,
        canManageRoles: true,
        canViewReports: true,
        canGenerateReports: true,
        canManageInventory: true,
        canViewBatches: true,
        canManageBatches: true,
        canCreateDiagnosis: true,
        canCreateLogEntries: true,
        canViewTeam: true,
        canDeleteData: false,
        canModifyData: true,
    },
    MANAGER: {
        canInviteUsers: false,
        canRemoveUsers: false,
        canManageRoles: false,
        canViewReports: true,
        canGenerateReports: true,
        canManageInventory: true,
        canViewBatches: true,
        canManageBatches: true,
        canCreateDiagnosis: true,
        canCreateLogEntries: true,
        canViewTeam: true,
        canDeleteData: false,
        canModifyData: true,
    },
    OPERATOR: {
        canInviteUsers: false,
        canRemoveUsers: false,
        canManageRoles: false,
        canViewReports: false,
        canGenerateReports: false,
        canManageInventory: false,
        canViewBatches: true,
        canManageBatches: true,       // PUEDE gestionar lotes
        canCreateDiagnosis: true,
        canCreateLogEntries: true,
        canViewTeam: false,
        canDeleteData: false,
        canModifyData: true,
    },
    VIEWER: {
        canInviteUsers: false,
        canRemoveUsers: false,
        canManageRoles: false,
        canViewReports: true,
        canGenerateReports: false,   // Solo ver, no crear
        canManageInventory: false,
        canViewBatches: true,        // Puede ver lotes
        canManageBatches: false,
        canCreateDiagnosis: false,
        canCreateLogEntries: false,
        canViewTeam: true,           // Puede ver, no gestionar
        canDeleteData: false,
        canModifyData: false,
    },
};

/**
 * Obtiene los permisos para un rol específico
 */
export function getPermissions(role: Role): RolePermissions {
    return rolePermissions[role] || rolePermissions.VIEWER;
}

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: Role, permission: keyof RolePermissions): boolean {
    const permissions = getPermissions(role);
    return permissions[permission];
}

/**
 * Obtiene el rol y plan del token JWT
 */
export function getUserRoleAndPlan(): { role: Role; plan: string } {
    if (typeof window === 'undefined') {
        return { role: 'VIEWER', plan: 'FREE' };
    }

    const token = localStorage.getItem('token');
    if (!token) {
        return { role: 'VIEWER', plan: 'FREE' };
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            role: (payload.role as Role) || 'VIEWER',
            plan: payload.plan || 'FREE',
        };
    } catch (e) {
        console.error('Error parsing token:', e);
        return { role: 'VIEWER', plan: 'FREE' };
    }
}

/**
 * Verifica si el usuario actual tiene un permiso
 */
export function currentUserHasPermission(permission: keyof RolePermissions): boolean {
    const { role } = getUserRoleAndPlan();
    return hasPermission(role, permission);
}

/**
 * Verifica si el usuario tiene plan PRO o ENTERPRISE
 */
export function isPremiumPlan(): boolean {
    const { plan } = getUserRoleAndPlan();
    return plan === 'PRO' || plan === 'ENTERPRISE';
}

/**
 * Obtiene una descripción legible del rol
 */
export function getRoleLabel(role: Role): string {
    const labels: Record<Role, string> = {
        OWNER: 'Propietario',
        ADMIN: 'Administrador',
        MANAGER: 'Gerente',
        OPERATOR: 'Operador',
        VIEWER: 'Visualizador',
    };
    return labels[role] || role;
}
