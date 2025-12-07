# Script para registrar usuarios usando el endpoint de registro del backend

Write-Host "Registrando usuarios demo usando la API..." -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:8081/api/v1/auth"

# Primero, eliminar usuarios demo existentes de la BD
Write-Host "Limpiando usuarios demo existentes..." -ForegroundColor Yellow
docker exec -t cannabis_db psql -U postgres -d cannabis_db -c "DELETE FROM _user WHERE email IN ('demo@demo.com', 'demopro@demo.com', 'demo@pro.com');"
docker exec -t cannabis_db psql -U postgres -d cannabis_db -c "DELETE FROM organization WHERE slug IN ('demo-free-org', 'demo-pro-org');"

Write-Host ""

# Registrar demo@demo.com
Write-Host "1. Registrando demo@demo.com..." -ForegroundColor Yellow

$registerBody1 = @{
    firstname = "Demo"
    lastname  = "User"
    email     = "demo@demo.com"
    password  = "demo123"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$API_URL/register" -Method Post -Body $registerBody1 -ContentType "application/json"
    Write-Host "   Usuario registrado exitosamente!" -ForegroundColor Green
    Write-Host "   Token recibido" -ForegroundColor Gray
    
    # Actualizar a plan FREE y crear organización
    $userId1 = docker exec -t cannabis_db psql -U postgres -d cannabis_db -t -c "SELECT id FROM _user WHERE email = 'demo@demo.com';"
    $userId1 = $userId1.Trim()
    
    docker exec -t cannabis_db psql -U postgres -d cannabis_db -c @"
    INSERT INTO organization (name, slug, plan, owner_id, active, max_users, max_batches, created_at, updated_at)
    VALUES ('Demo FREE Organization', 'demo-free-org', 'FREE', $userId1, TRUE, 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    
    UPDATE _user SET organization_id = (SELECT id FROM organization WHERE slug = 'demo-free-org') WHERE email = 'demo@demo.com';
"@
    
}
catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Registrar demopro@demo.com
Write-Host "2. Registrando demopro@demo.com..." -ForegroundColor Yellow

$registerBody2 = @{
    firstname = "Demo"
    lastname  = "PRO"
    email     = "demopro@demo.com"
    password  = "demo123"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$API_URL/register" -Method Post -Body $registerBody2 -ContentType "application/json"
    Write-Host "   Usuario registrado exitosamente!" -ForegroundColor Green
    Write-Host "   Token recibido" -ForegroundColor Gray
    
    # Actualizar a plan PRO y crear organización
    $userId2 = docker exec -t cannabis_db psql -U postgres -d cannabis_db -t -c "SELECT id FROM _user WHERE email = 'demopro@demo.com';"
    $userId2 = $userId2.Trim()
    
    docker exec -t cannabis_db psql -U postgres -d cannabis_db -c @"
    INSERT INTO organization (name, slug, plan, owner_id, active, max_users, max_batches, created_at, updated_at)
    VALUES ('Demo PRO Organization', 'demo-pro-org', 'PRO', $userId2, TRUE, 10, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    
    UPDATE _user SET organization_id = (SELECT id FROM organization WHERE slug = 'demo-pro-org'), role = 'OWNER' WHERE email = 'demopro@demo.com';
"@
    
}
catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Verificando usuarios creados..." -ForegroundColor Yellow
docker exec -t cannabis_db psql -U postgres -d cannabis_db -c "SELECT u.email, u.firstname, u.role, o.name as organization, o.plan FROM _user u LEFT JOIN organization o ON u.organization_id = o.id WHERE u.email LIKE '%demo%';"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  USUARIOS CREADOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Usuario 1:" -ForegroundColor Cyan
Write-Host "  Email: demo@demo.com" -ForegroundColor White
Write-Host "  Password: demo123" -ForegroundColor White
Write-Host "  Plan: FREE" -ForegroundColor White
Write-Host ""
Write-Host "Usuario 2:" -ForegroundColor Cyan
Write-Host "  Email: demopro@demo.com" -ForegroundColor White
Write-Host "  Password: demo123" -ForegroundColor White
Write-Host "  Plan: PRO" -ForegroundColor White
Write-Host ""
Write-Host "Ahora puedes hacer login en el frontend!" -ForegroundColor Yellow
Write-Host ""
