# 🧪 Tests del Backend - plantalinda Cultivation SaaS

## Cobertura de Tests Implementados

### ✅ Tests Críticos Implementados

#### 1. **AuthenticationServiceTest** (Seguridad Crítica)
- ✅ Registro de usuarios con encriptación de contraseñas
- ✅ Autenticación con credenciales válidas
- ✅ Rechazo de credenciales inválidas
- ✅ Manejo de usuarios no existentes
- ✅ Generación de tokens JWT

**Cobertura**: 5 tests | **Importancia**: CRÍTICA | **Estado**: ✅ PASANDO

#### 2. **FileStorageServiceTest** (Seguridad Crítica)
- ✅ Validación de extensiones permitidas (jpg, png)
- ✅ Validación de tipos MIME
- ✅ Rechazo de archivos maliciosos (.exe, etc.)
- ✅ Prevención de path traversal (../)
- ✅ Sanitización de nombres de archivo
- ✅ Normalización de extensiones a minúsculas
- ✅ Generación de nombres únicos

**Cobertura**: 10 tests | **Importancia**: CRÍTICA | **Estado**: ✅ PASANDO

#### 3. **ReportServiceTest** (Funcionalidad Core)
- ✅ Configuración de usuarios PRO y NOVICE
- ✅ Validación de rangos de fechas
- ✅ Verificación de repositorios mockeados

**Cobertura**: 4 tests básicos | **Importancia**: ALTA | **Estado**: ✅ PASANDO

#### 4. **BatchServiceTest** (Funcionalidad Core)
- ✅ Configuración de usuarios
- ✅ Verificación de repositorios mockeados

**Cobertura**: 2 tests básicos | **Importancia**: ALTA | **Estado**: ✅ PASANDO

---

## 📊 Resumen de Cobertura

| Servicio | Tests | Estado | Prioridad |
|----------|-------|--------|-----------|
| AuthenticationService | 5 | ✅ | CRÍTICA |
| FileStorageService | 10 | ✅ | CRÍTICA |
| ReportService | 4 | ✅ | ALTA |
| BatchService | 2 | ✅ | ALTA |
| **TOTAL** | **21** | **✅** | - |

---

## 🚀 Cómo Ejecutar los Tests

### Opción 1: Desde IntelliJ IDEA (Recomendado)
1. Abre el proyecto en IntelliJ
2. Click derecho en `src/test/java`
3. Selecciona **"Run 'All Tests'"**

### Opción 2: Con Maven (si está instalado)
```bash
cd backend
mvn test
```

### Opción 3: Desde VS Code
1. Instala la extensión **"Java Test Runner"**
2. Abre la vista de Testing (ícono de matraz)
3. Click en **"Run All Tests"**

---

## ✅ Tests Críticos de Seguridad

Los tests más importantes para producción son:

### 🔐 AuthenticationServiceTest
Verifica que:
- Las contraseñas se encripten correctamente antes de guardarlas
- Los tokens JWT se generen solo para usuarios válidos
- Las credenciales inválidas sean rechazadas
- Los usuarios no existentes no puedan autenticarse

### 🛡️ FileStorageServiceTest
Verifica que:
- Solo se acepten archivos de imagen (jpg, png)
- Los tipos MIME sean validados
- Los archivos maliciosos (.exe, .sh, etc.) sean rechazados
- Los intentos de path traversal (../) sean bloqueados
- Los nombres de archivo sean sanitizados
- Cada archivo tenga un nombre único (UUID)

---

## 📈 Próximos Tests Recomendados

### Prioridad Alta
- [ ] **Integration Tests**: Tests end-to-end de flujos completos
- [ ] **Controller Tests**: Tests de endpoints REST con MockMvc
- [ ] **ReportService Tests Completos**: Tests de generación de reportes con datos reales

### Prioridad Media
- [ ] **InventoryServiceTest**: Tests para gestión de inventario
- [ ] **DiagnosisServiceTest**: Tests para el servicio de IA
- [ ] **NotificationServiceTest**: Tests para notificaciones

### Prioridad Baja
- [ ] **Performance Tests**: Tests de carga y rendimiento
- [ ] **Security Tests**: Penetration testing automatizado

---

## 🔍 Análisis de Cobertura

Para generar un reporte de cobertura de código:

```bash
mvn test jacoco:report
```

El reporte se generará en: `target/site/jacoco/index.html`

---

## ✅ Checklist de Testing para Producción

- [x] Tests unitarios para autenticación
- [x] Tests de seguridad (file upload)
- [ ] Tests de integración
- [ ] Tests de carga/performance
- [ ] Tests de seguridad (penetration testing)

---

## 🐛 Reportar Bugs

Si encuentras un test que falla:

1. Verifica que la base de datos de test esté limpia
2. Revisa los logs en `target/surefire-reports/`
3. Ejecuta el test individual para aislar el problema
4. Reporta el issue con el stack trace completo

---

## 📝 Notas Importantes

- Los tests de `ReportService` y `BatchService` son actualmente básicos y se enfocan en la configuración correcta de mocks
- Se recomienda expandir estos tests una vez que la lógica de negocio esté más estable
- Los tests de seguridad (`AuthenticationService` y `FileStorageService`) son completos y críticos para producción

---

**Última actualización**: 2025-12-04
**Tests totales**: 21
**Cobertura de servicios críticos**: ✅ Completa
