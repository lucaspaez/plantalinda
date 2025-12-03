# 🚀 Module 2: Traceability & Batches - Guía de Uso

## ✅ Implementación Completada

### **Backend:**
- ✅ Entidades: `Batch`, `BatchLog`, `BatchStage`
- ✅ Repositorios y servicios
- ✅ Endpoints REST con restricción PRO
- ✅ Seguridad implementada

### **Frontend:**
- ✅ Página de lista de lotes (`/batches`)
- ✅ Formulario de creación (`/batches/new`)
- ✅ Página de detalles con bitácora (`/batches/[id]`)
- ✅ Navegación desde diagnóstico

---

## 🔧 Cómo Probar

### Paso 1: Actualizar Usuario a PRO

**Opción A - SQL directo (Recomendado):**

1. Conectarse a PostgreSQL:
```bash
docker exec -it cannabis_db psql -U postgres -d cannabis_db
```

2. Ejecutar:
```sql
-- Ver usuarios
SELECT id, email, role FROM _user;

-- Actualizar a PRO (cambiar el email)
UPDATE _user SET role = 'PRO' WHERE email = 'tu-email@gmail.com';

-- Verificar
SELECT id, email, role FROM _user;

-- Salir
\q
```

**Opción B - Usar archivo SQL:**
```bash
docker exec -i cannabis_db psql -U postgres -d cannabis_db < upgrade-to-pro.sql
```

### Paso 2: Reiniciar Backend

- Reiniciar en IntelliJ para que tome los cambios

### Paso 3: Probar en el Frontend

1. **Ir a** `http://localhost:3000/diagnosis`
2. **Click en** "🌱 Gestión de Lotes (PRO) →"
3. **Crear un lote:**
   - Nombre: "Lote Verano 2024"
   - Cepa: "OG Kush"
   - Plantas: 10
   - Fecha: Hoy
4. **Ver detalles** del lote
5. **Agregar entradas** en la bitácora:
   - pH: 6.5
   - EC: 1.5
   - Temp: 24°C
   - Humedad: 60%
   - Notas: "Primer riego"

---

## 📊 Funcionalidades Disponibles

### **Gestión de Lotes:**
- ✅ Crear lotes con información completa
- ✅ Ver lista de todos los lotes
- ✅ Cambiar etapa del cultivo (Germinación → Cosecha)
- ✅ Eliminar lotes
- ✅ Cálculo automático de días desde germinación

### **Bitácora Digital:**
- ✅ Registrar mediciones diarias (pH, EC, temp, humedad)
- ✅ Agregar notas de observaciones
- ✅ Ver historial completo ordenado por fecha
- ✅ Tracking de etapa en cada entrada

### **Etapas del Cultivo:**
1. **Germinación** - Primeros días
2. **Plántula** - Primeras hojas verdaderas
3. **Vegetativo** - Crecimiento de follaje
4. **Floración** - Producción de flores
5. **Cosecha** - Corte de plantas
6. **Curado** - Secado y curado

---

## 🎯 Próximas Mejoras Sugeridas

### **Corto Plazo:**
- [ ] Gráficos de evolución (pH, EC, temp)
- [ ] Alertas automáticas (pH fuera de rango)
- [ ] Export de bitácora a PDF/Excel
- [ ] Upload de fotos en bitácora

### **Mediano Plazo:**
- [ ] Stock management (cosecha → inventario)
- [ ] Reportes de rendimiento
- [ ] Comparación entre lotes
- [ ] Calendario de tareas

### **Largo Plazo:**
- [ ] Integración con sensores IoT
- [ ] Predicción de cosecha con IA
- [ ] Marketplace de cepas
- [ ] App móvil

---

## 🐛 Troubleshooting

### "Esta funcionalidad es solo para usuarios PRO"
- Verificar que el usuario esté actualizado a PRO en la base de datos
- Hacer logout y login nuevamente
- Verificar que el token JWT tenga el rol correcto

### "Error al cargar lotes"
- Verificar que el backend esté corriendo en puerto 8081
- Verificar logs del backend
- Verificar que el usuario esté autenticado

### "Error al crear lote"
- Verificar que todos los campos requeridos estén llenos
- Verificar que la fecha de germinación no sea futura
- Verificar logs del backend

---

## 📝 Endpoints API

```
GET    /api/v1/batches              - Listar lotes
POST   /api/v1/batches              - Crear lote
GET    /api/v1/batches/{id}         - Ver lote
PUT    /api/v1/batches/{id}/stage   - Cambiar etapa
DELETE /api/v1/batches/{id}         - Eliminar lote
POST   /api/v1/batches/logs         - Crear log
GET    /api/v1/batches/{id}/logs    - Ver logs
```

Todos requieren:
- Header: `Authorization: Bearer {token}`
- Rol: `PRO` o `ADMIN`

---

**¡Module 2 completado!** 🎉

¿Siguiente paso? Module 3: Stock Management o mejoras a Module 2.
