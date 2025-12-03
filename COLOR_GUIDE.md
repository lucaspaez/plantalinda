# 🎨 GUÍA COMPLETA - CAMBIO DE PALETA DE COLORES

## 📋 Índice
1. [Cambio Rápido de Colores](#cambio-rápido)
2. [Cambio Avanzado](#cambio-avanzado)
3. [Paletas Predefinidas](#paletas-predefinidas)
4. [Herramientas Recomendadas](#herramientas)

---

## 🚀 Cambio Rápido de Colores

### **Opción 1: Usar Paletas Predefinidas**

Abre `frontend/src/app/globals.css` y reemplaza los valores de `--primary`:

```css
/* VERDE (Actual - Cultivadores) */
--primary: 142.1 76.2% 36.3%;

/* AZUL (Tecnología) */
--primary: 217 91% 60%;

/* PÚRPURA (Premium) */
--primary: 262 83% 58%;

/* NARANJA (Energía) */
--primary: 25 95% 53%;

/* TEAL (Moderno) */
--primary: 173 80% 40%;

/* ROSA (Creativo) */
--primary: 330 81% 60%;
```

**Recuerda cambiar en AMBOS modos** (`:root` y `.dark`)

---

## 🎨 Cambio Avanzado

### **Paso 1: Generar Escala de Colores**

Usa https://uicolors.app/create para generar una escala completa:

1. Ingresa tu color base (ej: #22c55e)
2. Copia los valores HSL generados
3. Pega en `globals.css`

### **Paso 2: Actualizar Variables CSS**

Edita `frontend/src/app/globals.css`:

```css
:root {
  /* Modo Claro */
  --primary: [TU_COLOR_H] [TU_COLOR_S]% [TU_COLOR_L]%;
  --accent: [TU_ACENTO_H] [TU_ACENTO_S]% [TU_ACENTO_L]%;
}

.dark {
  /* Modo Oscuro - Generalmente más brillante */
  --primary: [TU_COLOR_H] [TU_COLOR_S]% [TU_COLOR_L + 10]%;
  --accent: [TU_ACENTO_H] [TU_ACENTO_S]% [TU_ACENTO_L + 10]%;
}
```

### **Paso 3: Actualizar Configuración Tailwind (Opcional)**

Edita `frontend/src/config/colors.js`:

```javascript
brand: {
  50: '#...',   // Muy claro
  100: '#...',
  // ... hasta
  900: '#...',  // Muy oscuro
}
```

### **Paso 4: Reiniciar Servidor**

```bash
cd frontend
# Ctrl+C para detener
npm run dev
```

---

## 🎨 Paletas Predefinidas Completas

### **1. VERDE (Actual - Cultivadores)**
```css
/* Modo Claro */
--primary: 142.1 76.2% 36.3%;
--accent: 142.1 76.2% 45%;

/* Modo Oscuro */
--primary: 142.1 70.6% 45.3%;
--accent: 142.1 70.6% 50%;
```

**Uso**: Cultivadores, naturaleza, sostenibilidad

---

### **2. AZUL (Tecnología)**
```css
/* Modo Claro */
--primary: 217 91% 60%;
--accent: 199 89% 48%;

/* Modo Oscuro */
--primary: 217 91% 65%;
--accent: 199 89% 55%;
```

**Uso**: Tech, profesional, confianza

---

### **3. PÚRPURA (Premium)**
```css
/* Modo Claro */
--primary: 262 83% 58%;
--accent: 280 89% 60%;

/* Modo Oscuro */
--primary: 262 83% 65%;
--accent: 280 89% 65%;
```

**Uso**: Lujo, creatividad, innovación

---

### **4. NARANJA (Energía)**
```css
/* Modo Claro */
--primary: 25 95% 53%;
--accent: 38 92% 50%;

/* Modo Oscuro */
--primary: 25 95% 60%;
--accent: 38 92% 58%;
```

**Uso**: Energía, entusiasmo, acción

---

### **5. TEAL (Moderno)**
```css
/* Modo Claro */
--primary: 173 80% 40%;
--accent: 186 94% 43%;

/* Modo Oscuro */
--primary: 173 80% 50%;
--accent: 186 94% 50%;
```

**Uso**: Moderno, fresco, equilibrio

---

### **6. ROSA (Creativo)**
```css
/* Modo Claro */
--primary: 330 81% 60%;
--accent: 340 82% 52%;

/* Modo Oscuro */
--primary: 330 81% 65%;
--accent: 340 82% 60%;
```

**Uso**: Creativo, amigable, diferente

---

## 🛠️ Herramientas Recomendadas

### **Generadores de Paletas**:
1. **UI Colors** - https://uicolors.app/create
   - Genera escalas completas de colores
   - Exporta en HSL, RGB, HEX

2. **Coolors** - https://coolors.co
   - Genera paletas completas
   - Explora combinaciones

3. **Adobe Color** - https://color.adobe.com
   - Rueda de colores profesional
   - Reglas de armonía

4. **Paletton** - https://paletton.com
   - Esquemas de color complementarios
   - Vista previa en UI

### **Convertidores**:
1. **HEX to HSL** - https://www.w3schools.com/colors/colors_converter.asp
2. **RGB to HSL** - https://rgbtohsl.com

---

## 📝 Checklist de Cambio de Paleta

- [ ] Decidir nueva paleta (usar herramientas)
- [ ] Actualizar `globals.css` (`:root` y `.dark`)
- [ ] Actualizar `colors.js` (opcional)
- [ ] Reiniciar servidor de desarrollo
- [ ] Probar en modo claro
- [ ] Probar en modo oscuro
- [ ] Verificar contraste de textos
- [ ] Verificar botones y enlaces
- [ ] Verificar badges y estados
- [ ] Revisar gradientes

---

## 🎯 Archivos a Modificar

### **Esenciales** (Cambio básico):
1. `frontend/src/app/globals.css` - Variables CSS principales

### **Opcionales** (Cambio avanzado):
1. `frontend/src/config/colors.js` - Configuración Tailwind
2. `frontend/tailwind.config.js` - Si usas colores personalizados

---

## 💡 Tips y Mejores Prácticas

### **1. Contraste de Texto**
- Modo claro: Usar colores 600-700 para texto sobre blanco
- Modo oscuro: Usar colores 300-400 para texto sobre negro
- Verificar con: https://webaim.org/resources/contrastchecker/

### **2. Consistencia**
- Usar mismo color primario en toda la app
- Mantener jerarquía visual
- No usar más de 3 colores principales

### **3. Accesibilidad**
- Ratio de contraste mínimo: 4.5:1 para texto normal
- Ratio de contraste mínimo: 3:1 para texto grande
- Probar con lectores de pantalla

### **4. Modo Oscuro**
- Colores generalmente 10-15% más brillantes que modo claro
- Evitar blancos puros (#fff) - usar grises claros
- Evitar negros puros (#000) - usar grises oscuros

---

## 🔄 Ejemplo Completo de Cambio

### **De Verde a Azul**:

**1. Abrir `globals.css`**

**2. Buscar**:
```css
--primary: 142.1 76.2% 36.3%;
```

**3. Reemplazar con**:
```css
--primary: 217 91% 60%;
```

**4. Buscar en `.dark`**:
```css
--primary: 142.1 70.6% 45.3%;
```

**5. Reemplazar con**:
```css
--primary: 217 91% 65%;
```

**6. Guardar y reiniciar**:
```bash
npm run dev
```

**¡Listo!** Tu app ahora usa azul como color principal.

---

## 📞 Soporte

Si necesitas ayuda con colores:
1. Revisa esta guía
2. Usa las herramientas recomendadas
3. Prueba las paletas predefinidas
4. Solicita cambios específicos

**Tiempo estimado de cambio**: 5-10 minutos
**Archivos a modificar**: 1-2
**Reinicio requerido**: Sí

---

**Última actualización**: 2024
**Versión**: 1.0
