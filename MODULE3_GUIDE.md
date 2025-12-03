# 🚀 Module 3: Inventory & Stock Management - Guía de Uso

## ✅ Implementación Completada

### **Backend:**
- ✅ Entidades: `InventoryItem`, `InventoryMovement`, `InventoryItemType`, `UnitOfMeasure`, `MovementType`
- ✅ Repositorios y servicios completos
- ✅ Endpoints REST con restricción PRO
- ✅ Validación de stock (no permite cantidades negativas)
- ✅ Trazabilidad completa de movimientos

### **Frontend:**
- ✅ Página de lista de inventario (`/inventory`)
- ✅ Formulario de creación con campos dinámicos (`/inventory/new`)
- ✅ Página de detalles con movimientos (`/inventory/[id]`)
- ✅ Alertas de stock bajo
- ✅ Filtros por tipo de item

---

## 📦 Tipos de Items Soportados

1. **SEED** - Semillas
2. **FERTILIZER** - Fertilizantes
3. **SUBSTRATE** - Sustratos
4. **SUPPLEMENT** - Suplementos (CalMag, etc.)
5. **EQUIPMENT** - Equipamiento
6. **PLANT_ACTIVE** - Plantas activas (en cultivo)
7. **HARVEST_WET** - Cosecha húmeda
8. **HARVEST_DRY** - Cosecha seca/curada
9. **FINAL_PRODUCT** - Producto final
10. **OTHER** - Otros

---

## 📊 Tipos de Movimientos

### **Entradas (Aumentan stock):**
- 🛒 **PURCHASE** - Compra
- 🎁 **DONATION** - Donación recibida
- 🌱 **PRODUCTION** - Producción propia (ej: cosecha)

### **Salidas (Disminuyen stock):**
- 📤 **USAGE** - Uso/Consumo
- 💰 **SALE** - Venta
- ❌ **LOSS** - Pérdida/Desperdicio

### **Otros:**
- 🔄 **TRANSFER** - Transferencia entre ubicaciones
- ⚙️ **ADJUSTMENT** - Ajuste de inventario

---

## 🎯 Funcionalidades Principales

### **1. Gestión de Items**
- ✅ Crear items con información completa
- ✅ Ver lista de todos los items
- ✅ Filtrar por tipo
- ✅ Ver items con stock bajo
- ✅ Eliminar items
- ✅ Campos dinámicos según tipo de item

### **2. Movimientos de Inventario**
- ✅ Registrar entradas y salidas
- ✅ Validación automática de stock
- ✅ Cálculo automático de cantidades
- ✅ Historial completo
- ✅ Tracking de costos

### **3. Alertas y Reportes**
- ✅ Alerta visual de stock bajo
- ✅ Cantidad mínima configurable
- ✅ Valor total del inventario
- ✅ Historial de movimientos

---

## 🔧 Cómo Usar

### **Crear un Item de Inventario:**

1. Ve a `http://localhost:3000/inventory`
2. Click en "+ Nuevo Item"
3. Completa la información:
   - **Nombre**: Ej: "Semillas OG Kush"
   - **Tipo**: Selecciona el tipo apropiado
   - **Cantidad Actual**: Stock inicial
   - **Cantidad Mínima**: Para alertas (opcional)
   - **Unidad**: Unidades, gramos, litros, etc.
4. Los campos adicionales aparecen según el tipo:
   - **Semillas/Plantas**: Cepa, Lote asociado
   - **Fertilizantes**: Marca, Proveedor, Vencimiento
   - **Todos**: Costo unitario, Ubicación
5. Click en "Crear Item"

### **Registrar Movimientos:**

1. Entra a un item desde la lista
2. Click en "+ Nuevo Movimiento"
3. Selecciona el tipo de movimiento
4. Ingresa la cantidad
5. Agrega notas y costo (opcional)
6. Click en "Registrar Movimiento"

**Nota**: El sistema automáticamente:
- Suma o resta del stock según el tipo
- Valida que no quede stock negativo
- Registra el historial completo

---

## 📋 Endpoints API

```
POST   /api/v1/inventory/items              - Crear item
GET    /api/v1/inventory/items              - Listar todos
GET    /api/v1/inventory/items/type/{type}  - Filtrar por tipo
GET    /api/v1/inventory/items/low-stock    - Items con stock bajo
GET    /api/v1/inventory/items/{id}         - Ver item
DELETE /api/v1/inventory/items/{id}         - Eliminar item
POST   /api/v1/inventory/movements          - Registrar movimiento
GET    /api/v1/inventory/items/{id}/movements - Ver movimientos
GET    /api/v1/inventory/movements          - Todos los movimientos
```

Todos requieren:
- Header: `Authorization: Bearer {token}`
- Rol: `PRO` o `ADMIN`

---

## 💡 Casos de Uso

### **Caso 1: Compra de Semillas**
1. Crear item tipo "SEED"
2. Nombre: "Semillas White Widow"
3. Cantidad: 10 unidades
4. Cepa: "White Widow"
5. Proveedor: "Seed Bank XYZ"
6. Costo unitario: $5

### **Caso 2: Germinar Semillas → Plantas Activas**
1. Registrar movimiento de USAGE en "Semillas" (-5 unidades)
2. Crear item tipo "PLANT_ACTIVE"
3. Nombre: "Plantas White Widow - Lote 1"
4. Cantidad: 5 unidades
5. Asociar a lote de cultivo
6. Registrar movimiento de PRODUCTION (+5 unidades)

### **Caso 3: Cosecha**
1. Registrar movimiento de USAGE en "Plantas Activas" (-5 plantas)
2. Crear item tipo "HARVEST_WET"
3. Nombre: "Cosecha White Widow - Húmeda"
4. Cantidad: 500 gramos
5. Registrar movimiento de PRODUCTION (+500g)

### **Caso 4: Curado**
1. Registrar movimiento de USAGE en "Cosecha Húmeda" (-500g)
2. Crear item tipo "HARVEST_DRY"
3. Nombre: "Cosecha White Widow - Seca"
4. Cantidad: 400 gramos (pérdida de agua)
5. Registrar movimiento de PRODUCTION (+400g)

---

## 🐛 Troubleshooting

### "Insufficient stock"
- Verificar que la cantidad actual sea suficiente
- Revisar el historial de movimientos
- Usar movimiento tipo ADJUSTMENT para corregir

### "Esta funcionalidad es solo para usuarios PRO"
- Verificar que el usuario esté actualizado a PRO
- Hacer logout y login nuevamente

### Campos no aparecen en el formulario
- Los campos son dinámicos según el tipo de item
- Cambiar el tipo para ver campos diferentes

---

## 🎯 Próximas Mejoras Sugeridas

### **Corto Plazo:**
- [ ] Gráficos de evolución de stock
- [ ] Export a Excel/PDF
- [ ] Códigos de barras/QR
- [ ] Alertas por email de stock bajo

### **Mediano Plazo:**
- [ ] Valorización de inventario (FIFO/LIFO)
- [ ] Reportes de rotación
- [ ] Integración con lotes (auto-update)
- [ ] Predicción de necesidades

### **Largo Plazo:**
- [ ] Múltiples ubicaciones/almacenes
- [ ] Integración con proveedores
- [ ] Sistema de órdenes de compra
- [ ] App móvil para escaneo

---

**¡Module 3 completado!** 🎉

Ahora tienes trazabilidad completa desde semilla hasta producto final.

**Siguiente**: Mejoras a módulos existentes (Opción B)
