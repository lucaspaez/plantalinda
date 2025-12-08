#!/bin/bash
# ==============================================================================
# Planta Linda - Instalación de Traefik
# Ejecutar como root después de 01-install-base.sh
# ==============================================================================

set -e

echo "=========================================="
echo "  Planta Linda - Instalación Traefik"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verificar root
if [ "$EUID" -ne 0 ]; then
    log_error "Por favor ejecutar como root (sudo)"
    exit 1
fi

# Variables
TRAEFIK_DIR="/opt/traefik"
DOMAIN="${1:-preprod.plantalinda.com}"
EMAIL="${2:-admin@plantalinda.com}"

log_info "Configurando Traefik para dominio: $DOMAIN"

# ==============================================================================
# 1. Crear red Docker compartida
# ==============================================================================
log_info "Creando red Docker..."
docker network create traefik-network 2>/dev/null || true

# ==============================================================================
# 2. Crear configuración de Traefik
# ==============================================================================
log_info "Creando configuración..."

cat > "$TRAEFIK_DIR/traefik.yml" << EOF
api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: traefik-network

certificatesResolvers:
  letsencrypt:
    acme:
      email: $EMAIL
      storage: /acme.json
      httpChallenge:
        entryPoint: web
EOF

# ==============================================================================
# 3. Crear docker-compose para Traefik
# ==============================================================================
cat > "$TRAEFIK_DIR/docker-compose.yml" << EOF
services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./acme.json:/acme.json
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(\`traefik.$DOMAIN\`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.tls=true"
      - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
      - "traefik.http.routers.dashboard.middlewares=auth"
      - "traefik.http.middlewares.auth.basicauth.users=admin:\$\$apr1\$\$xyz123\$\$password"

networks:
  traefik-network:
    external: true
EOF

# ==============================================================================
# 4. Crear archivo ACME para certificados
# ==============================================================================
touch "$TRAEFIK_DIR/acme.json"
chmod 600 "$TRAEFIK_DIR/acme.json"

# ==============================================================================
# 5. Iniciar Traefik
# ==============================================================================
log_info "Iniciando Traefik..."
cd "$TRAEFIK_DIR"
docker compose up -d

# Verificar
sleep 3
if docker ps | grep -q traefik; then
    log_info "Traefik iniciado correctamente"
else
    log_error "Error al iniciar Traefik"
    docker compose logs
    exit 1
fi

# ==============================================================================
# Resumen
# ==============================================================================
echo ""
echo "=========================================="
echo "  Traefik Instalado"
echo "=========================================="
echo ""
echo "  Dominio: $DOMAIN"
echo "  Red Docker: traefik-network"
echo "  Dashboard: https://traefik.$DOMAIN"
echo ""
echo "  Siguiente paso: ./03-deploy-app.sh"
echo "=========================================="
