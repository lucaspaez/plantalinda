# Arquitectura del Sistema

## Visión General

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  PostgreSQL │
│   Next.js   │     │ Spring Boot │     │   Database  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ AI Service  │
                   │   FastAPI   │
                   └─────────────┘
```

## Componentes

### Frontend (Puerto 3000/3001)
- **Framework**: Next.js 14 con App Router
- **Estilo**: Tailwind CSS
- **Auth**: JWT almacenado en localStorage
- **Estado**: React hooks + Context API

### Backend (Puerto 8080/8081)
- **Framework**: Spring Boot 3.2
- **Auth**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Multi-tenant**: Filtrado por Organization ID

### AI Service (Puerto 5000)
- **Framework**: FastAPI (Python)
- **Modelo**: OpenAI GPT-4 Vision / Google Gemini
- **Función**: Diagnóstico de plantas por imagen

### Base de Datos
- **Motor**: PostgreSQL 15
- **Esquema**: Multi-tenant con `organization_id`

---

## Flujo de Autenticación

```
1. Usuario → POST /api/auth/login
2. Backend valida credenciales
3. Backend genera JWT con: userId, role, organizationId, plan
4. Frontend almacena JWT en localStorage
5. Cada request incluye: Authorization: Bearer {token}
6. Backend valida JWT y extrae tenant context
```

---

## Sistema Multi-Tenant

Cada entidad tiene `organization_id` como FK:
- Users, Batches, Inventory, Diagnoses, Reports

El filtrado se aplica automáticamente:
```java
@Query("SELECT b FROM Batch b WHERE b.organization.id = :orgId")
List<Batch> findByOrganizationId(@Param("orgId") Long orgId);
```

---

## Estructura de Carpetas

```
/
├── backend/
│   ├── src/main/java/com/cannabis/app/
│   │   ├── controller/    # REST endpoints
│   │   ├── service/       # Lógica de negocio
│   │   ├── model/         # Entidades JPA
│   │   ├── repository/    # Acceso a datos
│   │   ├── config/        # Configuración Spring
│   │   └── security/      # JWT, filtros
│   └── src/main/resources/
│       └── application.yml
├── frontend/
│   ├── src/app/           # Páginas (App Router)
│   ├── src/components/    # Componentes React
│   ├── src/services/      # Llamadas API
│   └── src/utils/         # Utilidades, permisos
├── ai-service/
│   └── main.py            # FastAPI server
├── docs/                  # Documentación
├── scripts/               # Scripts de desarrollo
└── docker-compose.yml
```
