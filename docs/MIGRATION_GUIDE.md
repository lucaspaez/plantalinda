# 🚀 Guía de Migración Multi-Tenancy

## ⚠️ ANTES DE COMENZAR

### Checklist Pre-Migración

- [ ] **Backup creado** (ejecutar `.\backup-database-docker.ps1`)
- [ ] **Backup verificado** (archivo existe y tiene contenido)
- [ ] **Backend detenido** (no debe estar corriendo)
- [ ] **Frontend detenido** (no debe estar corriendo)
- [ ] **Base de datos corriendo** (Docker container activo)
- [ ] **No hay usuarios activos** en la aplicación

---

## 🎯 Opción 1: Script Automático (Recomendado)

### Paso 1: Ejecutar Script de Migración

```powershell
.\run-migration.ps1
```

Este script:
1. ✅ Verifica que existe el archivo de migración
2. ✅ Verifica que Docker está corriendo
3. ✅ Pide confirmación antes de ejecutar
4. ✅ Copia el SQL al contenedor
5. ✅ Ejecuta la migración
6. ✅ Verifica los resultados
7. ✅ Muestra estadísticas

### Paso 2: Verificar Resultados

El script mostrará:
- Usuarios sin organización (debe ser 0)
- Organizaciones creadas
- Distribución de roles

---

## 🔧 Opción 2: Manual (Paso a Paso)

### Paso 1: Copiar SQL al Contenedor

```powershell
docker cp .\backend\src\main\resources\db\migration\V1__multi_tenancy.sql cannabis_db:/tmp/migration.sql
```

### Paso 2: Ejecutar Migración

```powershell
docker exec -i cannabis_db psql -U postgres -d cannabis_db -f /tmp/migration.sql
```

### Paso 3: Verificar Datos

```powershell
# Usuarios sin organización (debe ser 0)
docker exec -t cannabis_db psql -U postgres -d cannabis_db -c "SELECT COUNT(*) FROM _user WHERE organization_id IS NULL;"

# Organizaciones creadas
docker exec -t cannabis_db psql -U postgres -d cannabis_db -c "SELECT id, name, slug, plan FROM organization;"

# Distribución de roles
docker exec -t cannabis_db psql -U postgres -d cannabis_db -c "SELECT role, COUNT(*) FROM _user GROUP BY role;"
```

---

## 📊 Qué Hace la Migración

### 1. Crear Tabla Organization
```sql
CREATE TABLE organization (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(100) UNIQUE,
    plan VARCHAR(50),
    owner_id BIGINT,
    ...
);
```

### 2. Agregar organization_id a Entidades
- `_user`
- `batch`
- `inventory_item`
- `report`
- `notification`

### 3. Migrar Datos Existentes

**Para cada usuario existente**:
1. Crea una organización
2. Asigna el usuario como owner
3. Establece el plan según el rol:
   - `PRO` o `ADMIN` → Plan PRO
   - `NOVICE` → Plan FREE

### 4. Migrar Roles

| Rol Antiguo | Rol Nuevo |
|-------------|-----------|
| NOVICE | OPERATOR |
| PRO | MANAGER |
| ADMIN (owner) | OWNER |
| ADMIN (no owner) | ADMIN |

---

## ✅ Verificación Post-Migración

### Queries de Verificación

```sql
-- 1. Usuarios sin organización (debe ser 0)
SELECT COUNT(*) FROM _user WHERE organization_id IS NULL;

-- 2. Organizaciones creadas
SELECT 
    o.id,
    o.name,
    o.slug,
    o.plan,
    o.active,
    COUNT(u.id) as user_count
FROM organization o
LEFT JOIN _user u ON u.organization_id = o.id
GROUP BY o.id, o.name, o.slug, o.plan, o.active;

-- 3. Distribución de roles
SELECT role, COUNT(*) as count 
FROM _user 
GROUP BY role 
ORDER BY count DESC;

-- 4. Batches sin organización (debe ser 0)
SELECT COUNT(*) FROM batch WHERE organization_id IS NULL;

-- 5. Verificar que cada usuario tiene su organización
SELECT 
    u.id,
    u.email,
    u.role,
    o.name as organization,
    o.plan
FROM _user u
LEFT JOIN organization o ON u.organization_id = o.id;
```

---

## 🔄 Reiniciar Servicios

### Paso 1: Reconstruir Backend

```powershell
cd backend
docker-compose build backend
docker-compose up -d backend
```

### Paso 2: Verificar Logs

```powershell
docker-compose logs -f backend
```

Buscar:
- ✅ "Started CannabisAppApplication"
- ✅ Sin errores de Hibernate
- ✅ Sin errores de conexión a DB

### Paso 3: Probar Login

1. Abre el frontend
2. Intenta hacer login con un usuario existente
3. Verifica que funciona correctamente

---

## 🐛 Troubleshooting

### Error: "relation organization does not exist"

**Causa**: La migración no se ejecutó correctamente

**Solución**:
```powershell
# Verificar si la tabla existe
docker exec -t cannabis_db psql -U postgres -d cannabis_db -c "\dt organization"

# Si no existe, ejecutar migración nuevamente
.\run-migration.ps1
```

---

### Error: "column organization_id does not exist"

**Causa**: La migración se ejecutó parcialmente

**Solución**:
```powershell
# Restaurar desde backup
docker exec -i cannabis_db psql -U postgres -d cannabis_db < backups\backup.sql

# Ejecutar migración nuevamente
.\run-migration.ps1
```

---

### Usuarios sin Organización

**Verificar**:
```sql
SELECT id, email, role FROM _user WHERE organization_id IS NULL;
```

**Solución Manual**:
```sql
-- Crear organización para el usuario
INSERT INTO organization (name, slug, plan, owner_id, active, created_at, updated_at)
VALUES ('Organizacion Usuario', 'org-user-123', 'FREE', [USER_ID], TRUE, NOW(), NOW());

-- Asignar usuario a la organización
UPDATE _user 
SET organization_id = [ORG_ID] 
WHERE id = [USER_ID];
```

---

### Backend No Inicia

**Verificar logs**:
```powershell
docker-compose logs backend
```

**Errores comunes**:

1. **"Table 'organization' doesn't exist"**
   - La migración no se ejecutó
   - Ejecutar `.\run-migration.ps1`

2. **"Column 'organization_id' cannot be null"**
   - Hay datos sin migrar
   - Ejecutar queries de verificación

3. **"Circular reference"**
   - Problema con relaciones User ↔ Organization
   - Verificar que `@ManyToOne` tiene `fetch = FetchType.LAZY`

---

## 🔙 Rollback (Si algo sale mal)

### Opción 1: Restaurar desde Backup

```powershell
# Detener backend
docker-compose stop backend

# Restaurar base de datos
docker exec -i cannabis_db psql -U postgres -d cannabis_db < backups\backup_cannabis_db_[TIMESTAMP].sql

# Reiniciar servicios
docker-compose up -d
```

### Opción 2: Rollback Manual

```sql
-- Eliminar columnas agregadas
ALTER TABLE _user DROP COLUMN IF EXISTS organization_id;
ALTER TABLE batch DROP COLUMN IF EXISTS organization_id;
ALTER TABLE inventory_item DROP COLUMN IF EXISTS organization_id;
ALTER TABLE report DROP COLUMN IF EXISTS organization_id;
ALTER TABLE notification DROP COLUMN IF EXISTS organization_id;

-- Eliminar tabla organization
DROP TABLE IF EXISTS organization;

-- Revertir roles (si es necesario)
UPDATE _user SET role = 'NOVICE' WHERE role = 'OPERATOR';
UPDATE _user SET role = 'PRO' WHERE role = 'MANAGER';
UPDATE _user SET role = 'ADMIN' WHERE role = 'OWNER';
```

---

## 📝 Checklist Post-Migración

- [ ] Migración ejecutada sin errores
- [ ] Usuarios sin organización = 0
- [ ] Organizaciones creadas correctamente
- [ ] Roles migrados correctamente
- [ ] Backend reiniciado sin errores
- [ ] Login funciona correctamente
- [ ] Datos se muestran correctamente
- [ ] No hay errores en logs

---

## 🎯 Próximos Pasos

Una vez que la migración sea exitosa:

1. **Probar funcionalidad básica**:
   - Login
   - Ver batches
   - Crear batch
   - Ver reportes

2. **Verificar aislamiento de datos**:
   - Crear segundo usuario
   - Verificar que no ve datos del primero

3. **Continuar con Fase 3**:
   - Implementar servicios de gestión
   - API de invitación de usuarios
   - Frontend de gestión de equipo

---

**¿Listo para ejecutar la migración?**

```powershell
.\run-migration.ps1
```
