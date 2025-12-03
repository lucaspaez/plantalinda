# Script Helper para Actualizar Páginas con DashboardLayout

## Páginas Actualizadas ✅
- `/dashboard/page.tsx` - Nuevo dashboard principal
- `/diagnosis/page.tsx` - Envuelto con DashboardLayout
- `/tools/page.tsx` - Envuelto con DashboardLayout
- `/login/page.tsx` - Redirige a /dashboard

## Páginas Pendientes 📝

### Batches Module
- `/batches/page.tsx`
- `/batches/[id]/page.tsx`
- `/batches/new/page.tsx`

### Inventory Module
- `/inventory/page.tsx`
- `/inventory/[id]/page.tsx`
- `/inventory/new/page.tsx`

## Patrón de Actualización

Para cada página, seguir estos pasos:

1. **Agregar import:**
```tsx
import DashboardLayout from '@/components/DashboardLayout';
```

2. **Envolver el return:**
```tsx
return (
    <DashboardLayout>
        {/* contenido existente sin el wrapper exterior */}
    </DashboardLayout>
);
```

3. **Remover:**
- Headers redundantes (el título ya está en el DashboardLayout)
- Navegación manual (ya está en el sidebar)
- Wrappers de `min-h-screen` y `p-8` (ya están en el layout)

4. **Mantener:**
- Todo el contenido funcional
- Cards y componentes internos
- Lógica de negocio

## Beneficios del Nuevo Layout

✅ Navegación consistente en todas las páginas
✅ Dark mode global
✅ User menu con logout
✅ Notificaciones centralizadas
✅ Responsive design
✅ Mejor UX/UI
