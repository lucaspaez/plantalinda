#!/bin/bash
# ==============================================================================
# Planta Linda - Backup de Base de Datos
# ==============================================================================

set -e

echo "=========================================="
echo "  Planta Linda - Backup DB"
echo "=========================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Variables
APP_DIR="/opt/apps/plantalinda"
BACKUP_DIR="/opt/backups"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/plantalinda_db_$DATE.sql"

cd "$APP_DIR"

# ==============================================================================
# 1. Verificar que PostgreSQL está corriendo
# ==============================================================================
if ! docker compose ps postgres | grep -q "Up"; then
    log_error "PostgreSQL no está corriendo"
    exit 1
fi

# ==============================================================================
# 2. Crear backup
# ==============================================================================
log_info "Creando backup..."

docker compose exec -T postgres pg_dump \
    -U plantalinda \
    --format=plain \
    --no-owner \
    --no-acl \
    plantalinda_db > "$BACKUP_FILE"

# Comprimir
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Verificar
SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
log_info "Backup creado: $(basename $BACKUP_FILE) ($SIZE)"

# ==============================================================================
# 3. Limpiar backups antiguos
# ==============================================================================
log_info "Limpiando backups antiguos (>$RETENTION_DAYS días)..."
DELETED=$(find "$BACKUP_DIR" -name "plantalinda_db_*.sql.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
log_info "Eliminados $DELETED backups antiguos"

# ==============================================================================
# 4. Listar backups disponibles
# ==============================================================================
echo ""
echo "Backups disponibles:"
echo "-------------------------------------------"
ls -lh "$BACKUP_DIR"/plantalinda_db_*.sql.gz 2>/dev/null | tail -10 || echo "  Ninguno"
echo ""
echo "Total: $(ls -1 "$BACKUP_DIR"/plantalinda_db_*.sql.gz 2>/dev/null | wc -l) backups"
echo ""

# ==============================================================================
# Restaurar (instrucciones)
# ==============================================================================
echo "Para restaurar un backup:"
echo "  gunzip -c BACKUP_FILE.sql.gz | docker compose exec -T postgres psql -U plantalinda plantalinda_db"
echo ""
