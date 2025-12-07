# 🚀 Guía Rápida para Probar el Sistema Multi-Tenant

## ✅ Usuario Disponible

Usa tu usuario existente que ya está configurado:

**Credenciales**:
- **Email**: `lucaspaez.ar@gmail.com`
- **Password**: [tu contraseña actual]
- **Rol**: OWNER
- **Organización**: "Lucas Paez's Organization"
- **Plan**: PRO (10 usuarios, batches ilimitados)

---

## 🎯 Cómo Probar Todas las Funcionalidades

### 1. Iniciar el Frontend

```bash
cd frontend
npm run dev
```

Abrir: `http://localhost:3000`

---

### 2. Login

1. Ir a la página de login
2. Email: `lucaspaez.ar@gmail.com`
3. Password: [tu contraseña]
4. Click "Login"

---

### 3. Ir a Gestión de Equipo

Navegar a: `http://localhost:3000/settings/team`

Deberías ver:
- ✅ Tu nombre en la lista de miembros
- ✅ Rol: OWNER
- ✅ Botón "Invitar Usuario"
- ✅ Estadísticas de la organización

---

### 4. Invitar un Usuario

1. Click en "Invitar Usuario"
2. Llenar el formulario:
   - **Email**: `operador@test.com`
   - **Nombre**: `Pedro`
   - **Apellido**: `López`
   - **Rol**: `OPERATOR`
3. Click "Invitar"
4. Verificar que aparece en la lista

---

### 5. Probar Diferentes Roles

Invita usuarios con diferentes roles para probar:

#### Administrador
- Email: `admin@test.com`
- Rol: `ADMIN`
- **Puede**: Invitar usuarios, asignar roles

#### Gerente
- Email: `gerente@test.com`
- Rol: `MANAGER`
- **Puede**: Ver reportes, gestionar operaciones

#### Operador
- Email: `operador@test.com`
- Rol: `OPERATOR`
- **Puede**: Crear bitácoras, diagnósticos

#### Visualizador
- Email: `viewer@test.com`
- Rol: `VIEWER`
- **Puede**: Solo ver datos

---

### 6. Probar Eliminación

1. Selecciona un usuario (que no seas tú)
2. Click en "Eliminar"
3. Confirmar
4. Verificar que desaparece

---

### 7. Verificar Límites

Tu plan PRO permite:
- ✅ Hasta 10 usuarios
- ✅ Batches ilimitados

Intenta invitar 9 usuarios más y verifica que:
- El contador se actualiza
- Al llegar a 10, el botón "Invitar" se deshabilita
- Aparece mensaje de límite alcanzado

---

## 🧪 Probar con API Directamente

### Obtener Token

```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"lucaspaez.ar@gmail.com","password":"TU_PASSWORD"}'
```

### Listar Miembros

```bash
curl -X GET http://localhost:8081/api/v1/organization/members \
  -H "Authorization: Bearer TU_TOKEN"
```

### Invitar Usuario

```bash
curl -X POST http://localhost:8081/api/v1/organization/members/invite \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@test.com",
    "firstname": "Nuevo",
    "lastname": "Usuario",
    "role": "OPERATOR"
  }'
```

### Ver Estadísticas

```bash
curl -X GET http://localhost:8081/api/v1/organization/stats \
  -H "Authorization: Bearer TU_TOKEN"
```

---

## 📊 Funcionalidades a Probar

### Como OWNER (tu usuario)

- [x] Ver lista de miembros del equipo
- [x] Invitar usuarios con cualquier rol
- [x] Cambiar roles de usuarios
- [x] Eliminar usuarios
- [x] Ver estadísticas de organización
- [x] Ver límites del plan

### Aislamiento de Datos

- [x] Solo ves usuarios de TU organización
- [x] No puedes ver usuarios de otras organizaciones
- [x] No puedes modificar usuarios de otras organizaciones

### Validaciones

- [x] No puedes eliminarte a ti mismo
- [x] No puedes cambiar tu propio rol
- [x] No puedes invitar más usuarios si alcanzas el límite
- [x] No puedes asignar roles que no tienes permiso

---

## 🐛 Si Algo No Funciona

### Frontend no carga datos

1. Verifica que el backend esté corriendo
2. Abre DevTools (F12) → Console
3. Busca errores de red o CORS

### Error 403 en API

1. Verifica que el token JWT sea válido
2. Verifica que tu usuario tenga los permisos correctos
3. Revisa los logs del backend

### Usuario no aparece después de invitar

1. Recarga la página
2. Verifica en la base de datos:
```bash
docker exec -t plantalinda_db psql -U postgres -d plantalinda_db -c "SELECT email, role FROM _user;"
```

---

## ✅ Checklist de Pruebas

- [ ] Login exitoso
- [ ] Ver página de gestión de equipo
- [ ] Ver estadísticas de organización
- [ ] Invitar usuario con rol OPERATOR
- [ ] Invitar usuario con rol MANAGER
- [ ] Invitar usuario con rol ADMIN
- [ ] Ver lista actualizada de miembros
- [ ] Eliminar un usuario
- [ ] Verificar contador de usuarios
- [ ] Intentar invitar más usuarios del límite
- [ ] Ver mensaje de límite alcanzado

---

## 🎊 ¡Listo!

Ahora tienes un sistema multi-tenant completamente funcional con:
- ✅ Gestión de equipos
- ✅ Roles y permisos
- ✅ Aislamiento de datos
- ✅ Límites por plan
- ✅ Interfaz moderna

**¡Prueba todas las funcionalidades y disfruta tu sistema!** 🚀

---

**Nota**: Si necesitas crear más usuarios de prueba, puedes hacerlo directamente desde la interfaz usando tu usuario OWNER.
