$backendPath = "d:\Desarrollo\Proyecto Necesidad de Cultivadores de plantalinda Medicinal\backend"
$frontendPath = "d:\Desarrollo\Proyecto Necesidad de Cultivadores de plantalinda Medicinal\frontend"

Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; mvn spring-boot:run"

Write-Host "Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "Servers are starting in new windows." -ForegroundColor Yellow
Write-Host "Backend will be at: http://localhost:8081"
Write-Host "Frontend will be at: http://localhost:3000"
