#!/bin/bash
# ==============================================================================
# Planta Linda - Deploy de Aplicación
# Ejecutar como usuario deploy
# ==============================================================================

set -e

echo "=========================================="
echo "  Planta Linda - Deploy"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Variables
APP_DIR="/opt/apps/plantalinda"
REPO_URL="https://github.com/lucaspaez/plantalinda.git"
BRANCH="${1:-main}"
DOMAIN="${2:-preprod.plantalinda.com}"

cd "$APP_DIR"

# ==============================================================================
# 1. Backup antes de deploy
# ==============================================================================
log_info "Creando backup pre-deploy..."
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)

if [ -f docker-compose.yml ] && docker compose ps -q postgres 2>/dev/null; then
    docker compose exec -T postgres pg_dump -U plantalinda plantalinda_db > "/opt/backups/pre_deploy_$BACKUP_DATE.sql" 2>/dev/null || true
    log_info "Backup creado: pre_deploy_$BACKUP_DATE.sql"
fi

# ==============================================================================
# 2. Pull código más reciente
# ==============================================================================
log_info "Obteniendo código más reciente (branch: $BRANCH)..."

if [ -d ".git" ]; then
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH
else
    cd /opt/apps
    rm -rf plantalinda
    git clone -b $BRANCH $REPO_URL plantalinda
    cd plantalinda
fi

# ==============================================================================
# 3. Copiar .env si no existe
# ==============================================================================
if [ ! -f .env ]; then
    log_warn "Archivo .env no encontrado. Creando desde template..."
    cat > .env << EOF
# Base de datos
POSTGRES_DB=plantalinda_db
POSTGRES_USER=plantalinda
POSTGRES_PASSWORD=CAMBIAR_PASSWORD_SEGURO

# Backend
JWT_SECRET=CAMBIAR_JWT_SECRET_SEGURO
SPRING_PROFILES_ACTIVE=prod

# Dominio
DOMAIN=$DOMAIN
EOF
    log_warn "IMPORTANTE: Editar .env con valores seguros antes de continuar"
    exit 1
fi

# ==============================================================================
# 4. Build y Deploy
# ==============================================================================
log_info "Construyendo y desplegando..."

# Usar docker-compose.preprod.yml si existe, sino docker-compose.prod.yml
COMPOSE_FILE="docker-compose.preprod.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

log_info "Usando: $COMPOSE_FILE"

# Pull imágenes base
docker compose -f $COMPOSE_FILE pull 2>/dev/null || true

# Build servicios personalizados
docker compose -f $COMPOSE_FILE build --no-cache

# Stop servicios actuales (si existen)
docker compose -f $COMPOSE_FILE down 2>/dev/null || true

# Iniciar servicios
docker compose -f $COMPOSE_FILE up -d

# ==============================================================================
# 5. Esperar a que servicios estén listos
# ==============================================================================
log_info "Esperando a que servicios estén listos..."
sleep 10

# Verificar servicios
SERVICES_OK=true

if ! docker compose -f $COMPOSE_FILE ps | grep -q "Up"; then
    log_error "Algunos servicios no están corriendo"
    docker compose -f $COMPOSE_FILE ps
    SERVICES_OK=false
fi

# ==============================================================================
# 6. Smoke test
# ==============================================================================
log_info "Ejecutando smoke tests..."

# Test backend health
if curl -sf "http://localhost:8081/actuator/health" > /dev/null 2>&1; then
    log_info "✓ Backend health OK"
else
    log_warn "✗ Backend health check falló"
    SERVICES_OK=false
fi

# Test frontend
if curl -sf "http://localhost:3000" > /dev/null 2>&1; then
    log_info "✓ Frontend OK"
else
    log_warn "✗ Frontend check falló"
fi

# ==============================================================================
# Resumen
# ==============================================================================
echo ""
echo "=========================================="
echo "  Deploy Completado"
echo "=========================================="
echo ""
docker compose -f $COMPOSE_FILE ps
echo ""
if [ "$SERVICES_OK" = true ]; then
    echo -e "  Estado: ${GREEN}OK${NC}"
else
    echo -e "  Estado: ${RED}REVISAR LOGS${NC}"
    echo "  Logs: docker compose -f $COMPOSE_FILE logs"
fi
echo ""
echo "  URL: https://$DOMAIN"
echo "=========================================="
