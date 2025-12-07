# Sistema de Roles y Permisos (RBAC)

## Roles Disponibles

| Rol | Descripción |
|-----|-------------|
| **OWNER** | Propietario de la organización. Control total. |
| **ADMIN** | Administrador. Puede gestionar usuarios y roles. |
| **MANAGER** | Gerente. Gestiona cultivos, inventario y reportes. |
| **OPERATOR** | Operador. Trabaja con lotes y diagnósticos. |
| **VIEWER** | Visualizador. Solo lectura. |

---

## Matriz de Permisos

| Permiso | OWNER | ADMIN | MANAGER | OPERATOR | VIEWER |
|---------|:-----:|:-----:|:-------:|:--------:|:------:|
| `canInviteUsers` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `canRemoveUsers` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `canManageRoles` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `canViewReports` | ✅ | ✅ | ✅ | ❌ | ✅ |
| `canGenerateReports` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `canManageInventory` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `canViewBatches` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `canManageBatches` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `canCreateDiagnosis` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `canCreateLogEntries` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `canViewTeam` | ✅ | ✅ | ✅ | ❌ | ✅ |

---

## Acceso por Página

| Página | Plan | Permiso Requerido |
|--------|------|-------------------|
| `/dashboard` | FREE | - |
| `/diagnosis` | FREE | `canCreateDiagnosis` |
| `/batches` | PRO | `canViewBatches` |
| `/batches/new` | PRO | `canManageBatches` |
| `/inventory` | PRO | `canManageInventory` |
| `/reports` | PRO | `canViewReports` |
| `/settings/team` | PRO | `canViewTeam` |

---

## Implementación Frontend

### Verificar permiso del usuario actual:
```typescript
import { currentUserHasPermission } from '@/utils/permissions';

if (currentUserHasPermission('canManageBatches')) {
    // Mostrar botón de crear lote
}
```

### Proteger una página completa:
```tsx
import RoleGuard from '@/components/RoleGuard';

<RoleGuard requiredPermission="canManageInventory" feature="Inventario">
    <InventoryPage />
</RoleGuard>
```

---

## Implementación Backend

Los permisos se validan en el backend comparando el rol del usuario con los permisos requeridos del endpoint. El rol viene en el JWT.

```java
// Verificar permiso en servicio
if (!hasPermission(user.getRole(), "canRemoveUsers")) {
    throw new AccessDeniedException("No tiene permiso");
}
```
