#!/bin/bash
# ==============================================================================
# Planta Linda - Health Check
# Verifica el estado de todos los servicios
# ==============================================================================

set -e

echo "=========================================="
echo "  Planta Linda - Health Check"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/opt/apps/plantalinda"
DOMAIN="${1:-localhost}"
ERRORS=0

check_service() {
    local name=$1
    local url=$2
    local expected=$3
    
    if curl -sf "$url" 2>/dev/null | grep -q "$expected"; then
        echo -e "  ${GREEN}✓${NC} $name"
        return 0
    else
        echo -e "  ${RED}✗${NC} $name"
        ((ERRORS++))
        return 1
    fi
}

check_container() {
    local name=$1
    
    if docker ps --format '{{.Names}}' | grep -q "$name"; then
        local status=$(docker inspect --format='{{.State.Health.Status}}' "$name" 2>/dev/null || echo "running")
        if [ "$status" == "healthy" ] || [ "$status" == "running" ]; then
            echo -e "  ${GREEN}✓${NC} Container $name"
            return 0
        fi
    fi
    echo -e "  ${RED}✗${NC} Container $name"
    ((ERRORS++))
    return 1
}

echo ""
echo "Containers:"
echo "-------------------------------------------"
check_container "plantalinda-postgres" || true
check_container "plantalinda-backend" || true
check_container "plantalinda-frontend" || true

echo ""
echo "Endpoints:"
echo "-------------------------------------------"
check_service "Backend Health" "http://localhost:8081/actuator/health" "UP" || true
check_service "Frontend" "http://localhost:3000" "Planta" || true
check_service "Database" "http://localhost:8081/api/auth/health" "" || true

echo ""
echo "Recursos:"
echo "-------------------------------------------"
echo "  Memoria:"
free -h | grep Mem | awk '{print "    Total: "$2"  Usada: "$3"  Libre: "$4}'
echo "  Disco:"
df -h /opt | tail -1 | awk '{print "    Total: "$2"  Usada: "$3"  Libre: "$4"  ("$5")"}'
echo "  Docker:"
docker system df --format "    Imágenes: {{.Images}}  Containers: {{.Containers}}  Volúmenes: {{.Volumes}}"

echo ""
echo "-------------------------------------------"
if [ $ERRORS -eq 0 ]; then
    echo -e "Estado: ${GREEN}HEALTHY${NC}"
    exit 0
else
    echo -e "Estado: ${RED}$ERRORS ERRORES${NC}"
    exit 1
fi
