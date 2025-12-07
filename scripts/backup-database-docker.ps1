# Script de Backup de PostgreSQL usando Docker
# Para cuando la base de datos corre en un contenedor Docker

Write-Host "Docker PostgreSQL Backup" -ForegroundColor Cyan
Write-Host ""

# Configuracion
$CONTAINER_NAME = "plantalinda_db"
$DB_NAME = "plantalinda_db"
$DB_USER = "postgres"
$BACKUP_DIR = ".\backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR\backup_${DB_NAME}_${TIMESTAMP}.sql"

# Crear directorio de backups si no existe
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    Write-Host "Directorio creado: $BACKUP_DIR" -ForegroundColor Green
}

# Verificar si Docker esta corriendo
try {
    docker ps | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker no esta corriendo"
    }
}
catch {
    Write-Host "ERROR: Docker no esta corriendo o no esta instalado" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop e intenta nuevamente" -ForegroundColor Yellow
    exit 1
}

# Verificar si el contenedor existe
$containerExists = docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.Names}}"

if (-not $containerExists) {
    Write-Host "ERROR: Contenedor '$CONTAINER_NAME' no encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Contenedores disponibles:" -ForegroundColor Yellow
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Host ""
    Write-Host "Tip: Modifica la variable CONTAINER_NAME en el script si tu contenedor tiene otro nombre" -ForegroundColor Cyan
    exit 1
}

# Verificar si el contenedor esta corriendo
$containerRunning = docker ps --filter "name=$CONTAINER_NAME" --format "{{.Names}}"

if (-not $containerRunning) {
    Write-Host "Contenedor '$CONTAINER_NAME' existe pero no esta corriendo" -ForegroundColor Yellow
    Write-Host "Iniciando contenedor..." -ForegroundColor Cyan
    docker start $CONTAINER_NAME
    Start-Sleep -Seconds 3
}

Write-Host "Contenedor encontrado y corriendo: $CONTAINER_NAME" -ForegroundColor Green
Write-Host "Creando backup..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar backup
try {
    docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE
    
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item $BACKUP_FILE).Length / 1KB
        Write-Host "Backup creado exitosamente!" -ForegroundColor Green
        Write-Host "Ubicacion: $BACKUP_FILE" -ForegroundColor Cyan
        Write-Host "Tamano: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Tip: Guarda este archivo en un lugar seguro antes de ejecutar la migracion" -ForegroundColor Yellow
    }
    else {
        Write-Host "Error al crear el backup" -ForegroundColor Red
    }
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Comandos utiles:" -ForegroundColor Cyan
Write-Host "  Ver backups:     Get-ChildItem .\backups\" -ForegroundColor White
Write-Host "  Restaurar:       docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < $BACKUP_FILE" -ForegroundColor White
