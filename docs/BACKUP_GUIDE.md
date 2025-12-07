# 💾 Guía de Backup de Base de Datos

## 🎯 Opciones de Backup

### Opción 1: Script de PowerShell (Recomendado para Windows)

**Ejecutar desde PowerShell en el directorio del proyecto**:

```powershell
.\backup-database.ps1
```

Este script:
- ✅ Busca automáticamente `pg_dump`
- ✅ Crea directorio `backups/` si no existe
- ✅ Genera backup con timestamp
- ✅ Muestra tamaño del archivo
- ✅ Maneja errores automáticamente

**Ubicación del backup**: `.\backups\backup_plantalinda_db_YYYYMMDD_HHMMSS.sql`

---

### Opción 2: Docker (Si usas Docker Compose)

**Si tu base de datos corre en Docker**:

```powershell
# Ver contenedores corriendo
docker ps

# Backup desde contenedor de PostgreSQL
docker exec -t plantalinda_db pg_dump -U postgres plantalinda_db > backups\backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql
```

O usar el script específico para Docker:

```powershell
.\backup-database-docker.ps1
```

---

### Opción 3: pgAdmin (Interfaz Gráfica)

**Pasos**:

1. Abre **pgAdmin**
2. Conecta a tu servidor PostgreSQL
3. Navega a: `Servers` → `PostgreSQL` → `Databases` → `plantalinda_db`
4. Click derecho en `plantalinda_db`
5. Selecciona **"Backup..."**
6. Configuración:
   - **Filename**: `D:\backups\backup_plantalinda_db.sql`
   - **Format**: Plain (SQL)
   - **Encoding**: UTF8
7. Click **"Backup"**

---

### Opción 4: Línea de Comandos Manual

**Si tienes PostgreSQL instalado localmente**:

```powershell
# Navegar al directorio de PostgreSQL
cd "C:\Program Files\PostgreSQL\16\bin"

# Ejecutar pg_dump
.\pg_dump.exe -h localhost -p 5432 -U postgres -F p -f "D:\backups\backup_plantalinda_db.sql" plantalinda_db
```

**Nota**: Reemplaza `16` con tu versión de PostgreSQL

---

## 🔄 Restaurar Backup

### Desde PowerShell/CMD:

```powershell
# Si tienes pg_dump en PATH
psql -U postgres -d plantalinda_db < backups\backup_plantalinda_db_20251204_114500.sql

# Si no está en PATH
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres -d plantalinda_db < "D:\backups\backup_plantalinda_db_20251204_114500.sql"
```

### Desde Docker:

```powershell
# Copiar backup al contenedor
docker cp backups\backup.sql plantalinda_db:/tmp/backup.sql

# Restaurar
docker exec -i plantalinda_db psql -U postgres -d plantalinda_db < /tmp/backup.sql
```

### Desde pgAdmin:

1. Click derecho en `plantalinda_db`
2. Selecciona **"Restore..."**
3. Selecciona el archivo de backup
4. Click **"Restore"**

---

## ⚠️ Antes de Ejecutar la Migración

### Checklist:

- [ ] **Backup creado** y guardado en lugar seguro
- [ ] **Verificar tamaño del backup** (debe ser > 0 KB)
- [ ] **Probar restauración** en base de datos de prueba (opcional pero recomendado)
- [ ] **Detener aplicación** (backend y frontend)
- [ ] **Verificar que no hay usuarios activos** en la base de datos

---

## 🧪 Probar Backup (Recomendado)

### Crear base de datos de prueba:

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear DB de prueba
CREATE DATABASE plantalinda_db_test;

-- Salir
\q
```

### Restaurar backup en DB de prueba:

```powershell
psql -U postgres -d plantalinda_db_test < backups\backup_plantalinda_db_20251204_114500.sql
```

### Verificar datos:

```sql
psql -U postgres -d plantalinda_db_test

-- Verificar tablas
\dt

-- Verificar usuarios
SELECT COUNT(*) FROM _user;

-- Salir
\q
```

Si todo está bien, puedes proceder con la migración en la DB real.

---

## 📊 Verificar Backup

### Verificar que el archivo existe y tiene contenido:

```powershell
# Ver archivos de backup
Get-ChildItem .\backups\

# Ver tamaño del último backup
Get-ChildItem .\backups\ | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Format-List Name, Length, LastWriteTime

# Ver primeras líneas del backup
Get-Content .\backups\backup_plantalinda_db_*.sql -Head 20
```

**El backup debe contener**:
- Comandos SQL (`CREATE TABLE`, `INSERT`, etc.)
- Tamaño > 0 KB (típicamente varios KB o MB)
- Fecha reciente

---

## 🔒 Seguridad del Backup

### Buenas prácticas:

1. **Encriptar backups sensibles**:
```powershell
# Comprimir y proteger con contraseña (requiere 7-Zip)
7z a -p -mhe=on backups\backup_encrypted.7z backups\backup_plantalinda_db_*.sql
```

2. **Guardar en múltiples ubicaciones**:
   - Disco local
   - Disco externo
   - Cloud (Google Drive, Dropbox, etc.)

3. **Nombrar con timestamp**:
   - Formato: `backup_plantalinda_db_YYYYMMDD_HHMMSS.sql`
   - Facilita identificar versiones

4. **Retención**:
   - Mantener últimos 7 backups diarios
   - Mantener 1 backup mensual por 6 meses

---

## 🚨 Troubleshooting

### Error: "pg_dump no encontrado"

**Solución 1**: Agregar PostgreSQL a PATH
```powershell
# Agregar temporalmente
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"

# Verificar
pg_dump --version
```

**Solución 2**: Usar Docker
```powershell
.\backup-database-docker.ps1
```

**Solución 3**: Usar pgAdmin (interfaz gráfica)

---

### Error: "password authentication failed"

**Solución**: Configurar variable de entorno
```powershell
$env:PGPASSWORD = "tu_password_postgres"
.\backup-database.ps1
$env:PGPASSWORD = $null  # Limpiar después
```

---

### Error: "database does not exist"

**Verificar nombre de la base de datos**:
```powershell
# Listar bases de datos
psql -U postgres -c "\l"

# O con Docker
docker exec plantalinda_db psql -U postgres -c "\l"
```

---

## 📝 Automatizar Backups (Opcional)

### Crear tarea programada en Windows:

1. Abrir **Task Scheduler**
2. Crear tarea básica
3. Trigger: Diario a las 2:00 AM
4. Acción: Ejecutar `backup-database.ps1`
5. Guardar

---

## ✅ Checklist Final

Antes de ejecutar la migración multi-tenant:

- [ ] Backup creado exitosamente
- [ ] Tamaño del backup verificado (> 0 KB)
- [ ] Backup guardado en lugar seguro
- [ ] (Opcional) Backup probado en DB de prueba
- [ ] Aplicación detenida
- [ ] Listo para ejecutar migración

---

**¿Listo para continuar con la migración?**

Una vez que tengas el backup, podemos proceder con:
1. Ejecutar el script de migración SQL
2. Verificar los datos
3. Continuar con la Fase 2 (Seguridad)
