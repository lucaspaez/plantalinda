# Script para ejecutar la migracion de multi-tenancy
# Ejecutar desde PowerShell en el directorio del proyecto

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MIGRACION MULTI-TENANCY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuracion
$CONTAINER_NAME = "plantalinda_db"
$DB_NAME = "plantalinda_db"
$DB_USER = "postgres"
$MIGRATION_FILE = ".\backend\src\main\resources\db\migration\V1__multi_tenancy.sql"

# Verificar que existe el archivo de migracion
if (-not (Test-Path $MIGRATION_FILE)) {
    Write-Host "ERROR: Archivo de migracion no encontrado" -ForegroundColor Red
    Write-Host "Buscando en: $MIGRATION_FILE" -ForegroundColor Yellow
    exit 1
}

Write-Host "Archivo de migracion encontrado" -ForegroundColor Green
Write-Host ""

# Verificar Docker
try {
    docker ps | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker no esta corriendo"
    }
}
catch {
    Write-Host "ERROR: Docker no esta corriendo" -ForegroundColor Red
    exit 1
}

# Verificar contenedor
$containerRunning = docker ps --filter "name=$CONTAINER_NAME" --format "{{.Names}}"
if (-not $containerRunning) {
    Write-Host "ERROR: Contenedor '$CONTAINER_NAME' no esta corriendo" -ForegroundColor Red
    Write-Host "Inicia el contenedor con: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host "Contenedor de base de datos corriendo" -ForegroundColor Green
Write-Host ""

# Mostrar advertencia
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  ADVERTENCIA" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Esta migracion realizara los siguientes cambios:" -ForegroundColor White
Write-Host "  1. Crear tabla 'organization'" -ForegroundColor White
Write-Host "  2. Agregar 'organization_id' a todas las entidades" -ForegroundColor White
Write-Host "  3. Migrar datos existentes" -ForegroundColor White
Write-Host "  4. Migrar roles legacy (NOVICE -> OPERATOR, PRO -> MANAGER)" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Red
Write-Host "  - Asegurate de tener un BACKUP de la base de datos" -ForegroundColor Red
Write-Host "  - Esta operacion NO es reversible facilmente" -ForegroundColor Red
Write-Host ""

# Confirmar
$confirmation = Read-Host "Tienes un backup y deseas continuar? (si/no)"
if ($confirmation -ne "si") {
    Write-Host ""
    Write-Host "Migracion cancelada" -ForegroundColor Yellow
    Write-Host "Ejecuta primero: .\backup-database-docker.ps1" -ForegroundColor Cyan
    exit 0
}

Write-Host ""
Write-Host "Ejecutando migracion..." -ForegroundColor Cyan
Write-Host ""

# Copiar archivo SQL al contenedor
Write-Host "[1/3] Copiando archivo de migracion al contenedor..." -ForegroundColor Yellow
docker cp $MIGRATION_FILE ${CONTAINER_NAME}:/tmp/migration.sql

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo copiar el archivo al contenedor" -ForegroundColor Red
    exit 1
}
Write-Host "Archivo copiado exitosamente" -ForegroundColor Green
Write-Host ""

# Ejecutar migracion
Write-Host "[2/3] Ejecutando script de migracion..." -ForegroundColor Yellow
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -f /tmp/migration.sql

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: La migracion fallo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pasos para recuperar:" -ForegroundColor Yellow
    Write-Host "  1. Restaurar desde backup:" -ForegroundColor White
    Write-Host "     docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < backups\backup.sql" -ForegroundColor Cyan
    Write-Host "  2. Revisar logs del error arriba" -ForegroundColor White
    Write-Host "  3. Contactar soporte si es necesario" -ForegroundColor White
    exit 1
}

Write-Host "Migracion ejecutada" -ForegroundColor Green
Write-Host ""

# Verificar datos
Write-Host "[3/3] Verificando datos migrados..." -ForegroundColor Yellow
Write-Host ""

# Verificar usuarios sin organizacion
$usersWithoutOrg = docker exec -t $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM _user WHERE organization_id IS NULL;"
$usersWithoutOrg = $usersWithoutOrg.Trim()

Write-Host "Usuarios sin organizacion: $usersWithoutOrg" -ForegroundColor $(if ($usersWithoutOrg -eq "0") { "Green" } else { "Red" })

# Verificar organizaciones creadas
$orgCount = docker exec -t $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM organization;"
$orgCount = $orgCount.Trim()

Write-Host "Organizaciones creadas: $orgCount" -ForegroundColor Green

# Mostrar distribucion de roles
Write-Host ""
Write-Host "Distribucion de roles:" -ForegroundColor Cyan
docker exec -t $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "SELECT role, COUNT(*) as count FROM _user GROUP BY role ORDER BY count DESC;"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  MIGRACION COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if ($usersWithoutOrg -eq "0") {
    Write-Host "Todos los usuarios tienen organizacion asignada" -ForegroundColor Green
    Write-Host "La migracion fue exitosa" -ForegroundColor Green
}
else {
    Write-Host "ADVERTENCIA: Hay usuarios sin organizacion" -ForegroundColor Yellow
    Write-Host "Revisa los datos manualmente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Reiniciar el backend para que tome los cambios" -ForegroundColor White
Write-Host "  2. Probar el login con usuarios existentes" -ForegroundColor White
Write-Host "  3. Verificar que los datos se muestran correctamente" -ForegroundColor White
Write-Host ""
