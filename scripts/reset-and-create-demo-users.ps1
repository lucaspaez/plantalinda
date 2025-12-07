# Script para resetear y crear usuarios demo

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESET Y CREACION DE USUARIOS DEMO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$CONTAINER_NAME = "cannabis_db"
$DB_NAME = "cannabis_db"
$DB_USER = "postgres"
$SQL_FILE = ".\reset-and-create-demo-users.sql"

Write-Host "ADVERTENCIA: Esto eliminara TODOS los usuarios y datos existentes!" -ForegroundColor Yellow
Write-Host ""
$confirmation = Read-Host "Deseas continuar? (si/no)"

if ($confirmation -ne "si") {
    Write-Host "Operacion cancelada" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Copiando script al contenedor..." -ForegroundColor Yellow
docker cp $SQL_FILE ${CONTAINER_NAME}:/tmp/reset-and-create-demo-users.sql

Write-Host "Ejecutando script..." -ForegroundColor Yellow
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -f /tmp/reset-and-create-demo-users.sql

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  USUARIOS CREADOS EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Usuario 1 - FREE Plan:" -ForegroundColor Cyan
Write-Host "  Email:        demo@demo.com" -ForegroundColor White
Write-Host "  Password:     demo123" -ForegroundColor White
Write-Host "  Rol:          OWNER" -ForegroundColor White
Write-Host "  Organizacion: Demo FREE Organization" -ForegroundColor White
Write-Host "  Plan:         FREE (1 usuario, 5 batches)" -ForegroundColor White
Write-Host ""

Write-Host "Usuario 2 - PRO Plan:" -ForegroundColor Cyan
Write-Host "  Email:        demopro@demo.com" -ForegroundColor White
Write-Host "  Password:     demo123" -ForegroundColor White
Write-Host "  Rol:          OWNER" -ForegroundColor White
Write-Host "  Organizacion: Demo PRO Organization" -ForegroundColor White
Write-Host "  Plan:         PRO (10 usuarios, batches ilimitados)" -ForegroundColor White
Write-Host ""

Write-Host "Ahora puedes:" -ForegroundColor Yellow
Write-Host "  1. Login con cualquiera de los dos usuarios" -ForegroundColor White
Write-Host "  2. Ir a /settings/team" -ForegroundColor White
Write-Host "  3. Con demopro@demo.com puedes invitar hasta 9 usuarios mas" -ForegroundColor White
Write-Host ""
