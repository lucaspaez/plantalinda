# 🚀 Cannabis Cultivation SaaS - Quick Start Guide

## 📋 Servicios del Sistema

Este proyecto tiene 4 servicios principales:

1. **PostgreSQL** (Puerto 5432) - Base de datos
2. **Spring Boot Backend** (Puerto 8081) - API REST
3. **Next.js Frontend** (Puerto 3000) - Interfaz web
4. **Python AI Service** (Puerto 8000) - Análisis de IA

---

## 🏃 Inicio Rápido

### 1. Iniciar Base de Datos
```bash
docker compose up -d
```

### 2. Iniciar Backend
- Abrir IntelliJ IDEA
- Run `CannabisAppApplication`
- Verificar: http://localhost:8081

### 3. Iniciar Frontend
```bash
cd frontend
npm run dev
```
- Verificar: http://localhost:3000

### 4. Iniciar Servicio de IA
```bash
.\start-ai-service.bat
```
- Verificar: http://localhost:8000

---

## 🔧 Scripts Útiles

### Configuración Inicial
- `.\setup-ai-service.bat` - Instalar dependencias Python

### Operación Diaria
- `.\start-ai-service.bat` - Iniciar servicio de IA
- `.\switch-ai-model.bat` - Cambiar modelo de IA
- `docker compose up -d` - Iniciar base de datos
- `docker compose down` - Detener base de datos

---

## 🧪 Probar el Sistema

1. Ve a http://localhost:3000/register
2. Crea una cuenta
3. Sube una imagen de planta en /diagnosis
4. ¡Ve el análisis de IA!

---

## 📚 Documentación

- `SECURITY.md` - Guía de seguridad
- `AI_MODELS_GUIDE.md` - Cómo cambiar modelos de IA
- `frontend/README.md` - Documentación del frontend
- `ai-service/README.md` - Documentación del servicio IA

---

## 🔐 Credenciales por Defecto (CAMBIAR EN PRODUCCIÓN)

### Base de Datos
- Usuario: `postgres`
- Password: `postgres`
- Database: `cannabis_db`

### JWT Secret
- Ver: `backend/src/main/resources/application.properties`
- ⚠️ CAMBIAR antes de producción

---

## 🛠️ Troubleshooting

### Backend no conecta a DB
```bash
# Verificar que PostgreSQL esté corriendo
docker ps

# Si no está, iniciarlo
docker compose up -d
```

### Frontend no conecta a Backend
- Verificar que Backend esté en puerto 8081
- Verificar CORS en `SecurityConfiguration.java`

### AI Service no carga modelo
- Verificar conexión a internet
- Verificar espacio en disco
- Ver logs en la terminal

### Error de CORS
- Verificar `SecurityConfiguration.java`
- Verificar que frontend esté en puerto 3000

---

## 📊 Estructura del Proyecto

```
cannabis-app/
├── backend/                 # Spring Boot API
│   ├── src/main/java/
│   └── pom.xml
├── frontend/               # Next.js UI
│   ├── src/
│   └── package.json
├── ai-service/            # Python FastAPI
│   ├── main.py
│   ├── config.yaml
│   └── requirements.txt
├── docker-compose.yml     # PostgreSQL
├── SECURITY.md           # Guía de seguridad
└── AI_MODELS_GUIDE.md    # Guía de modelos IA
```

---

## 🎯 Próximos Pasos

1. ✅ Module 1: AI Diagnosis - **COMPLETADO**
2. ⏳ Module 2: Traceability & Batches
3. ⏳ Module 3: Stock Management
4. ⏳ Module 4: Reports & Analytics

---

## 🤝 Soporte

¿Problemas? Revisa:
1. Logs del servicio que falla
2. Documentación en archivos .md
3. Issues conocidos en SECURITY.md

---

**Versión**: 1.0.0 (Desarrollo)
**Última actualización**: 2025-12-01
