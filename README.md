# 🌱 Planta Linda

Sistema de gestión integral para cultivadores de plantalinda medicinal con diagnóstico por IA, trazabilidad de lotes, y gestión de inventario.

## 🚀 Inicio Rápido

```bash
# 1. Base de datos
docker compose up -d

# 2. Backend (IntelliJ o terminal)
cd backend && ./mvnw spring-boot:run

# 3. Frontend
cd frontend && npm run dev

# 4. Servicio IA (opcional)
./scripts/start-ai-service.bat
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8081
- AI Service: http://localhost:8000

---

## 📁 Estructura del Proyecto

```
├── backend/          # Spring Boot API (Java 17)
├── frontend/         # Next.js 14 (React/TypeScript)
├── ai-service/       # FastAPI (Python) - Diagnóstico IA
├── docs/             # Documentación técnica
├── scripts/          # Scripts de desarrollo y operación
├── nginx/            # Configuración proxy reverso
└── docker-compose.yml
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/README.md](./docs/README.md) | Índice de documentación |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arquitectura del sistema |
| [docs/RBAC.md](./docs/RBAC.md) | Roles y permisos |
| [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) | Endpoints REST |
| [docs/SECURITY.md](./docs/SECURITY.md) | Configuración de seguridad |
| [docs/DEPLOYMENT_SUMMARY.md](./docs/DEPLOYMENT_SUMMARY.md) | Guía de despliegue |

---

## 🔧 Scripts Útiles

| Script | Descripción |
|--------|-------------|
| `scripts/start-dev.ps1` | Iniciar entorno de desarrollo |
| `scripts/backup-database.ps1` | Crear backup de la DB |
| `scripts/run-migration.ps1` | Ejecutar migraciones |
| `scripts/register-demo-users.ps1` | Crear usuarios demo |

---

## 🔐 Credenciales (Development)

```
# Base de Datos
Host: localhost:5432
Database: plantalinda_db
User: postgres
Password: postgres

# Usuario Demo (después de ejecutar register-demo-users.ps1)
Email: demo@test.com
Password: demo1234
```

---

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.2, Spring Security, JWT, Hibernate
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Database**: PostgreSQL 15
- **AI**: FastAPI, OpenAI GPT-4 Vision / Google Gemini
- **Infra**: Docker, Nginx

---

## 📊 Funcionalidades

- ✅ Diagnóstico de plantas por IA (foto → análisis)
- ✅ Gestión de lotes y bitácora diaria
- ✅ Control de inventario y stock
- ✅ Reportes REPROCANN
- ✅ Multi-tenant (organizaciones separadas)
- ✅ Sistema de roles (OWNER, ADMIN, MANAGER, OPERATOR, VIEWER)
- ✅ Planes FREE/PRO con límites diferenciados

---

**Versión**: 2.0.0  
**Última actualización**: 2025-12-07
