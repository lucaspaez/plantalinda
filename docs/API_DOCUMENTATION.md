# 📡 API de Gestión de Organizaciones y Equipos

## Base URL
```
/api/v1/organization
```

## Autenticación
Todos los endpoints requieren autenticación JWT.
El token debe enviarse en el header: `Authorization: Bearer {token}`

---

## 📊 Endpoints de Organización

### 1. Obtener Información de la Organización
```http
GET /api/v1/organization
```

**Respuesta**:
```json
{
  "id": 1,
  "name": "Lucas Paez's Organization",
  "slug": "org-1-lucaspaez",
  "plan": "PRO",
  "active": true,
  "maxUsers": 10,
  "maxBatches": null,
  "createdAt": "2025-12-04T10:00:00",
  "updatedAt": "2025-12-04T10:00:00"
}
```

---

### 2. Obtener Estadísticas
```http
GET /api/v1/organization/stats
```

**Respuesta**:
```json
{
  "organizationId": 1,
  "organizationName": "Lucas Paez's Organization",
  "plan": "PRO",
  "active": true,
  "userCount": 5,
  "maxUsers": 10,
  "canAddUsers": true,
  "maxBatches": null
}
```

---

### 3. Obtener Información del Plan
```http
GET /api/v1/organization/plan
```

**Respuesta**:
```json
{
  "currentPlan": "PRO",
  "maxUsers": 10,
  "maxBatches": null,
  "canUpgrade": true
}
```

---

## 👥 Endpoints de Gestión de Equipo

### 4. Listar Miembros del Equipo
```http
GET /api/v1/organization/members
```

**Permisos**: Todos los usuarios

**Respuesta**:
```json
{
  "totalMembers": 3,
  "maxMembers": 10,
  "canAddMore": true,
  "members": [
    {
      "id": 1,
      "email": "owner@example.com",
      "firstname": "Juan",
      "lastname": "Pérez",
      "role": "OWNER",
      "organizationId": 1,
      "organizationName": "Mi Cultivo"
    },
    {
      "id": 2,
      "email": "manager@example.com",
      "firstname": "María",
      "lastname": "González",
      "role": "MANAGER",
      "organizationId": 1,
      "organizationName": "Mi Cultivo"
    },
    {
      "id": 3,
      "email": "operator@example.com",
      "firstname": "Pedro",
      "lastname": "López",
      "role": "OPERATOR",
      "organizationId": 1,
      "organizationName": "Mi Cultivo"
    }
  ]
}
```

---

### 5. Invitar Usuario
```http
POST /api/v1/organization/members/invite
```

**Permisos**: OWNER, ADMIN

**Request Body**:
```json
{
  "email": "nuevo@example.com",
  "firstname": "Ana",
  "lastname": "Martínez",
  "role": "OPERATOR"
}
```

**Respuesta**:
```json
{
  "userId": 4,
  "email": "nuevo@example.com",
  "message": "Usuario invitado exitosamente. Se ha enviado un email con las credenciales."
}
```

**Errores**:
- `400`: Email ya registrado
- `403`: Sin permisos para invitar
- `403`: No puedes asignar ese rol
- `409`: Límite de usuarios alcanzado

---

### 6. Obtener Usuario Específico
```http
GET /api/v1/organization/members/{userId}
```

**Permisos**: Todos los usuarios (solo de su organización)

**Respuesta**:
```json
{
  "id": 2,
  "email": "manager@example.com",
  "firstname": "María",
  "lastname": "González",
  "role": "MANAGER",
  "organizationId": 1,
  "organizationName": "Mi Cultivo"
}
```

---

### 7. Actualizar Rol de Usuario
```http
PUT /api/v1/organization/members/{userId}/role
```

**Permisos**: OWNER, ADMIN

**Request Body**:
```json
{
  "newRole": "MANAGER"
}
```

**Respuesta**:
```json
{
  "id": 3,
  "email": "operator@example.com",
  "firstname": "Pedro",
  "lastname": "López",
  "role": "MANAGER",
  "organizationId": 1,
  "organizationName": "Mi Cultivo"
}
```

**Restricciones**:
- No se puede cambiar el rol del OWNER
- Solo se pueden modificar usuarios de la misma organización
- El rol asignado debe estar permitido según tu rol

---

### 8. Eliminar Usuario
```http
DELETE /api/v1/organization/members/{userId}
```

**Permisos**: OWNER, ADMIN

**Respuesta**:
```json
{
  "message": "Usuario eliminado exitosamente",
  "userId": "3"
}
```

**Restricciones**:
- No se puede eliminar al OWNER
- No te puedes eliminar a ti mismo
- Solo se pueden eliminar usuarios de la misma organización

---

## 🔒 Matriz de Permisos

| Acción | OWNER | ADMIN | MANAGER | OPERATOR | VIEWER |
|--------|-------|-------|---------|----------|--------|
| Ver organización | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver estadísticas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver miembros | ✅ | ✅ | ✅ | ✅ | ✅ |
| Invitar usuarios | ✅ | ✅ | ❌ | ❌ | ❌ |
| Asignar roles | ✅ | ✅* | ❌ | ❌ | ❌ |
| Eliminar usuarios | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cambiar plan | ✅ | ❌ | ❌ | ❌ | ❌ |

*ADMIN puede asignar solo roles operativos (MANAGER, OPERATOR, VIEWER)

---

## 📝 Roles Disponibles

### OWNER
- Dueño de la organización
- Control total
- Puede asignar cualquier rol (excepto SUPER_ADMIN)
- No se puede eliminar ni cambiar su rol

### ADMIN
- Administrador
- Puede gestionar usuarios
- Puede asignar roles operativos
- Puede configurar la organización

### MANAGER
- Gerente
- Puede ver reportes
- Puede gestionar operaciones
- No puede gestionar usuarios

### OPERATOR
- Operador
- Puede crear bitácoras y diagnósticos
- Puede gestionar inventario
- No puede ver reportes financieros

### VIEWER
- Solo lectura
- Puede ver datos
- No puede modificar nada

### SUPER_ADMIN
- Soporte técnico
- Acceso a todas las organizaciones
- Solo para administradores del sistema

---

## 🧪 Ejemplos de Uso

### Ejemplo 1: Invitar un Operador

```bash
curl -X POST http://localhost:8081/api/v1/organization/members/invite \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operador@cultivo.com",
    "firstname": "Carlos",
    "lastname": "Ruiz",
    "role": "OPERATOR"
  }'
```

### Ejemplo 2: Cambiar Rol a Manager

```bash
curl -X PUT http://localhost:8081/api/v1/organization/members/5/role \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "newRole": "MANAGER"
  }'
```

### Ejemplo 3: Listar Equipo

```bash
curl -X GET http://localhost:8081/api/v1/organization/members \
  -H "Authorization: Bearer {token}"
```

---

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Límite alcanzado o email duplicado |
| 500 | Internal Server Error |

---

## 🔐 Seguridad

- ✅ Todos los endpoints requieren autenticación JWT
- ✅ Validación de permisos por rol
- ✅ Aislamiento de datos por organización
- ✅ No se pueden ver/modificar usuarios de otras organizaciones
- ✅ Logging de todas las operaciones sensibles

---

## 📊 Límites por Plan

### FREE
- Máximo 1 usuario
- Máximo 5 batches
- Funcionalidades básicas

### PRO
- Máximo 10 usuarios
- Batches ilimitados
- Reportes avanzados
- Múltiples colaboradores

### ENTERPRISE
- Usuarios ilimitados
- Batches ilimitados
- Soporte prioritario
- Funcionalidades personalizadas

---

**Documentación actualizada**: 2025-12-04
**Versión API**: v1
