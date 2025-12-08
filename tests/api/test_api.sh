#!/bin/bash
# ==============================================================================
# Planta Linda - Tests de API
# Verifica endpoints principales del backend
# ==============================================================================

set -e

echo "=========================================="
echo "  Planta Linda - API Tests"
echo "=========================================="

BASE_URL="${1:-http://localhost:8081}"
PASSED=0
FAILED=0

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected_status=$4
    local data=$5
    local auth=$6

    local curl_opts="-s -o /dev/null -w %{http_code}"
    
    if [ -n "$auth" ]; then
        curl_opts="$curl_opts -H \"Authorization: Bearer $auth\""
    fi
    
    if [ "$method" == "POST" ] && [ -n "$data" ]; then
        curl_opts="$curl_opts -X POST -H \"Content-Type: application/json\" -d '$data'"
    fi

    local status=$(eval curl $curl_opts "$BASE_URL$endpoint")
    
    if [ "$status" == "$expected_status" ]; then
        echo -e "  ${GREEN}✓${NC} $name (HTTP $status)"
        ((PASSED++))
    else
        echo -e "  ${RED}✗${NC} $name (esperaba $expected_status, obtuvo $status)"
        ((FAILED++))
    fi
}

# ==============================================================================
# Tests Públicos (sin autenticación)
# ==============================================================================
echo ""
echo "Endpoints Públicos:"
echo "-------------------------------------------"

test_endpoint "Health Check" "GET" "/actuator/health" "200"
test_endpoint "Auth - Login page" "GET" "/api/auth/health" "200"

# ==============================================================================
# Tests de Autenticación
# ==============================================================================
echo ""
echo "Autenticación:"
echo "-------------------------------------------"

# Registro de usuario de prueba
REGISTER_DATA='{"email":"test_api@test.com","password":"test12345","firstname":"Test","lastname":"API"}'
REGISTER_STATUS=$(curl -s -o /dev/null -w %{http_code} -X POST \
    -H "Content-Type: application/json" \
    -d "$REGISTER_DATA" \
    "$BASE_URL/api/auth/register")

if [ "$REGISTER_STATUS" == "200" ] || [ "$REGISTER_STATUS" == "409" ]; then
    echo -e "  ${GREEN}✓${NC} Register endpoint responde"
    ((PASSED++))
else
    echo -e "  ${RED}✗${NC} Register endpoint (HTTP $REGISTER_STATUS)"
    ((FAILED++))
fi

# Login
LOGIN_DATA='{"email":"test_api@test.com","password":"test12345"}'
LOGIN_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA" \
    "$BASE_URL/api/auth/login")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')

if [ -n "$TOKEN" ]; then
    echo -e "  ${GREEN}✓${NC} Login y JWT Token recibido"
    ((PASSED++))
else
    echo -e "  ${RED}✗${NC} Login - No se recibió token"
    ((FAILED++))
    TOKEN=""
fi

# ==============================================================================
# Tests Protegidos (con autenticación)
# ==============================================================================
if [ -n "$TOKEN" ]; then
    echo ""
    echo "Endpoints Protegidos:"
    echo "-------------------------------------------"
    
    # Batches
    BATCHES_STATUS=$(curl -s -o /dev/null -w %{http_code} \
        -H "Authorization: Bearer $TOKEN" \
        "$BASE_URL/api/batches")
    
    if [ "$BATCHES_STATUS" == "200" ]; then
        echo -e "  ${GREEN}✓${NC} GET /api/batches"
        ((PASSED++))
    else
        echo -e "  ${RED}✗${NC} GET /api/batches (HTTP $BATCHES_STATUS)"
        ((FAILED++))
    fi
    
    # Inventory
    INV_STATUS=$(curl -s -o /dev/null -w %{http_code} \
        -H "Authorization: Bearer $TOKEN" \
        "$BASE_URL/api/inventory")
    
    if [ "$INV_STATUS" == "200" ]; then
        echo -e "  ${GREEN}✓${NC} GET /api/inventory"
        ((PASSED++))
    else
        echo -e "  ${RED}✗${NC} GET /api/inventory (HTTP $INV_STATUS)"
        ((FAILED++))
    fi
    
    # Notifications
    NOTIF_STATUS=$(curl -s -o /dev/null -w %{http_code} \
        -H "Authorization: Bearer $TOKEN" \
        "$BASE_URL/api/notifications")
    
    if [ "$NOTIF_STATUS" == "200" ]; then
        echo -e "  ${GREEN}✓${NC} GET /api/notifications"
        ((PASSED++))
    else
        echo -e "  ${RED}✗${NC} GET /api/notifications (HTTP $NOTIF_STATUS)"
        ((FAILED++))
    fi
fi

# ==============================================================================
# Resumen
# ==============================================================================
echo ""
echo "==========================================" 
echo "  Resultados"
echo "=========================================="
echo ""
TOTAL=$((PASSED + FAILED))
echo "  Pasados: $PASSED / $TOTAL"
echo "  Fallidos: $FAILED / $TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "  Estado: ${GREEN}TODOS LOS TESTS PASARON${NC}"
    exit 0
else
    echo -e "  Estado: ${RED}$FAILED TESTS FALLARON${NC}"
    exit 1
fi
