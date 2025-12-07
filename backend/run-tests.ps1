# Script para ejecutar tests del backend
# Ejecutar desde el directorio backend

Write-Host "🧪 Ejecutando tests del backend..." -ForegroundColor Cyan

# Verificar si existe mvnw (Maven Wrapper)
if (Test-Path ".\mvnw.cmd") {
    Write-Host "Usando Maven Wrapper..." -ForegroundColor Green
    .\mvnw.cmd test
}
elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "Usando Maven del sistema..." -ForegroundColor Green
    mvn test
}
else {
    Write-Host "❌ ERROR: Maven no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "1. Instalar Maven: https://maven.apache.org/download.cgi" -ForegroundColor White
    Write-Host "2. Usar tu IDE (IntelliJ IDEA, Eclipse, VS Code con Java Extension Pack)" -ForegroundColor White
    Write-Host "3. Ejecutar desde IntelliJ: Click derecho en 'src/test/java' -> Run 'All Tests'" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "✅ Tests completados" -ForegroundColor Green
