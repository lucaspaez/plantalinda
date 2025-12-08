#!/bin/bash
# ==============================================================================
# Planta Linda - Script de Instalación Base
# Ejecutar como root en Debian 12
# ==============================================================================

set -e

echo "=========================================="
echo "  Planta Linda - Instalación Base"
echo "=========================================="

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verificar root
if [ "$EUID" -ne 0 ]; then
    log_error "Por favor ejecutar como root (sudo)"
    exit 1
fi

# ==============================================================================
# 1. Actualizar sistema
# ==============================================================================
log_info "Actualizando sistema..."
apt update && apt upgrade -y

# ==============================================================================
# 2. Instalar dependencias base
# ==============================================================================
log_info "Instalando dependencias base..."
apt install -y \
    git \
    curl \
    wget \
    vim \
    htop \
    ufw \
    gnupg \
    ca-certificates \
    lsb-release \
    apt-transport-https

# ==============================================================================
# 3. Instalar Docker
# ==============================================================================
log_info "Instalando Docker..."

# Eliminar versiones antiguas
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Agregar repositorio Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verificar instalación
docker --version
docker compose version

log_info "Docker instalado correctamente"

# ==============================================================================
# 4. Crear usuario deploy
# ==============================================================================
log_info "Configurando usuario deploy..."

if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    usermod -aG sudo deploy
    log_info "Usuario 'deploy' creado"
else
    log_warn "Usuario 'deploy' ya existe"
fi

# ==============================================================================
# 5. Configurar Firewall
# ==============================================================================
log_info "Configurando firewall..."

ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

echo "y" | ufw enable
ufw status

log_info "Firewall configurado"

# ==============================================================================
# 6. Crear estructura de directorios
# ==============================================================================
log_info "Creando estructura de directorios..."

mkdir -p /opt/traefik
mkdir -p /opt/apps/plantalinda/data/postgres
mkdir -p /opt/apps/plantalinda/data/uploads
mkdir -p /opt/backups

chown -R deploy:deploy /opt/apps
chown -R deploy:deploy /opt/backups

log_info "Directorios creados"

# ==============================================================================
# Resumen
# ==============================================================================
echo ""
echo "=========================================="
echo "  Instalación Base Completada"
echo "=========================================="
echo ""
echo "  Docker: $(docker --version)"
echo "  Usuario deploy: creado"
echo "  Firewall: activo (22, 80, 443)"
echo "  Directorios: /opt/apps, /opt/backups"
echo ""
echo "  Siguiente paso: ./02-install-traefik.sh"
echo "=========================================="
