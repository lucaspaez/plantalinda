#!/bin/bash
# ==============================================================================
# Planta Linda - Rollback
# Vuelve a la versión anterior
# ==============================================================================

set -e

echo "=========================================="
echo "  Planta Linda - Rollback"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

APP_DIR="/opt/apps/plantalinda"
BACKUP_DIR="/opt/backups"

cd "$APP_DIR"

# ==============================================================================
# 1. Listar commits disponibles
# ==============================================================================
echo ""
echo "Últimos 5 commits:"
echo "-------------------------------------------"
git log --oneline -5
echo ""

# ==============================================================================
# 2. Seleccionar versión
# ==============================================================================
if [ -z "$1" ]; then
    read -p "Ingresa el hash del commit al que quieres volver (o 'HEAD~1' para el anterior): " TARGET
else
    TARGET=$1
fi

if [ -z "$TARGET" ]; then
    log_error "No se especificó versión"
    exit 1
fi

# ==============================================================================
# 3. Confirmar
# ==============================================================================
echo ""
echo "Se hará rollback a: $TARGET"
git log --oneline -1 $TARGET
echo ""
read -p "¿Continuar? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    log_warn "Rollback cancelado"
    exit 0
fi

# ==============================================================================
# 4. Backup actual antes de rollback
# ==============================================================================
log_info "Creando backup pre-rollback..."
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
CURRENT_COMMIT=$(git rev-parse --short HEAD)

docker compose exec -T postgres pg_dump -U plantalinda plantalinda_db > "$BACKUP_DIR/pre_rollback_${CURRENT_COMMIT}_$BACKUP_DATE.sql" 2>/dev/null || true

# ==============================================================================
# 5. Ejecutar rollback
# ==============================================================================
log_info "Ejecutando git checkout..."
git checkout $TARGET

log_info "Reconstruyendo servicios..."
COMPOSE_FILE="docker-compose.preprod.yml"
[ ! -f "$COMPOSE_FILE" ] && COMPOSE_FILE="docker-compose.prod.yml"

docker compose -f $COMPOSE_FILE down
docker compose -f $COMPOSE_FILE build --no-cache
docker compose -f $COMPOSE_FILE up -d

# ==============================================================================
# 6. Verificar
# ==============================================================================
log_info "Esperando a que servicios inicien..."
sleep 10

if docker compose -f $COMPOSE_FILE ps | grep -q "Up"; then
    log_info "Rollback completado exitosamente"
else
    log_error "Error en rollback. Revisar logs:"
    docker compose -f $COMPOSE_FILE logs --tail=50
fi

# ==============================================================================
# Resumen
# ==============================================================================
echo ""
echo "=========================================="
echo "  Rollback Completado"
echo "=========================================="
echo ""
echo "  Versión anterior: $CURRENT_COMMIT"
echo "  Versión actual: $(git rev-parse --short HEAD)"
echo "  Backup: pre_rollback_${CURRENT_COMMIT}_$BACKUP_DATE.sql"
echo ""
