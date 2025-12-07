# Script de Backup de PostgreSQL para Windows
# Ejecutar desde PowerShell en el directorio del proyecto

Write-Host "🔄 Creando backup de la base de datos..." -ForegroundColor Cyan

# Configuración
$DB_NAME = "cannabis_db"
$DB_USER = "postgres"
$DB_HOST = "localhost"
$DB_PORT = "5432"
$BACKUP_DIR = ".\backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR\backup_${DB_NAME}_${TIMESTAMP}.sql"

# Crear directorio de backups si no existe
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    Write-Host "📁 Directorio de backups creado: $BACKUP_DIR" -ForegroundColor Green
}

# Verificar si pg_dump está disponible
$pgDumpPath = $null

# Buscar pg_dump en rutas comunes
$commonPaths = @(
    "C:\Program Files\PostgreSQL\*\bin\pg_dump.exe",
    "C:\Program Files (x86)\PostgreSQL\*\bin\pg_dump.exe",
    "$env:ProgramFiles\PostgreSQL\*\bin\pg_dump.exe"
)

foreach ($path in $commonPaths) {
    $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $pgDumpPath = $found.FullName
        break
    }
}

if (-not $pgDumpPath) {
    Write-Host "❌ ERROR: pg_dump no encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "1. Si tienes Docker con PostgreSQL corriendo:" -ForegroundColor White
    Write-Host "   docker exec -t cannabis_db pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Si tienes PostgreSQL instalado localmente:" -ForegroundColor White
    Write-Host "   Agrega PostgreSQL\bin a tu PATH" -ForegroundColor Cyan
    Write-Host "   O ejecuta desde: C:\Program Files\PostgreSQL\[VERSION]\bin\" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Usar pgAdmin (interfaz gráfica):" -ForegroundColor White
    Write-Host "   - Abre pgAdmin" -ForegroundColor Cyan
    Write-Host "   - Click derecho en 'cannabis_db'" -ForegroundColor Cyan
    Write-Host "   - Backup..." -ForegroundColor Cyan
    Write-Host "   - Selecciona ubicación y formato" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ pg_dump encontrado: $pgDumpPath" -ForegroundColor Green

# Ejecutar backup
Write-Host "⏳ Creando backup..." -ForegroundColor Yellow

try {
    # Configurar variable de entorno para la contraseña (opcional)
    # $env:PGPASSWORD = "tu_password"
    
    & $pgDumpPath -h $DB_HOST -p $DB_PORT -U $DB_USER -F p -f $BACKUP_FILE $DB_NAME
    
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item $BACKUP_FILE).Length / 1KB
        Write-Host ""
        Write-Host "✅ Backup creado exitosamente!" -ForegroundColor Green
        Write-Host "📁 Ubicación: $BACKUP_FILE" -ForegroundColor Cyan
        Write-Host "📊 Tamaño: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "💡 Tip: Guarda este archivo en un lugar seguro antes de ejecutar la migración" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ Error al crear el backup" -ForegroundColor Red
        Write-Host "Verifica que la base de datos esté corriendo y las credenciales sean correctas" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

# Limpiar variable de entorno
# $env:PGPASSWORD = $null
