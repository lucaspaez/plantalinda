#!/bin/bash
# ==============================================================================
# Planta Linda - Smoke Test
# Test rápido post-deploy para verificar que todo funciona
# ==============================================================================

echo "=========================================="
echo "  Planta Linda - Smoke Test"
echo "=========================================="

DOMAIN="${1:-localhost}"
ERRORS=0

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

check() {
    local name=$1
    local url=$2
    
    if curl -sf --max-time 5 "$url" > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} $name"
    else
        echo -e "  ${RED}✗${NC} $name"
        ((ERRORS++))
    fi
}

echo ""
echo "Verificando servicios..."
echo "-------------------------------------------"

check "Frontend" "http://$DOMAIN:3000"
check "Backend Health" "http://$DOMAIN:8081/actuator/health"
check "API Auth" "http://$DOMAIN:8081/api/auth/health"

echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "Estado: ${GREEN}OK - Todos los servicios funcionan${NC}"
    exit 0
else
    echo -e "Estado: ${RED}ERROR - $ERRORS servicios fallaron${NC}"
    exit 1
fi
