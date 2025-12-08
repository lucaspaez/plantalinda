# Guía de Configuración Pre-Producción

## Requisitos del Servidor

- **OS**: Debian 12 (Bookworm)
- **RAM**: Mínimo 4GB (recomendado 8GB)
- **CPU**: 2 cores mínimo
- **Disco**: 50GB SSD
- **Puertos abiertos**: 22, 80, 443

---

## Instalación Paso a Paso

### 1. Preparar Servidor

```bash
# Conectar por SSH como root
ssh root@tu-servidor

# Descargar scripts de deploy
git clone https://github.com/lucaspaez/plantalinda.git /tmp/plantalinda
cp -r /tmp/plantalinda/deploy /opt/

# Ejecutar instalación base
chmod +x /opt/deploy/*.sh
/opt/deploy/01-install-base.sh
```

### 2. Instalar Traefik

```bash
# Configurar dominio y email para SSL
/opt/deploy/02-install-traefik.sh preprod.plantalinda.com admin@plantalinda.com
```

### 3. Deploy de la Aplicación

```bash
# Cambiar a usuario deploy
su - deploy

# Clonar repositorio
cd /opt/apps/plantalinda
git clone https://github.com/lucaspaez/plantalinda.git .

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con valores seguros

# Ejecutar deploy
/opt/deploy/03-deploy-app.sh
```

---

## Variables de Entorno (.env)

```env
# Base de Datos
POSTGRES_DB=plantalinda_db
POSTGRES_USER=plantalinda
POSTGRES_PASSWORD=<password-seguro>

# Backend
JWT_SECRET=<jwt-secret-64-chars>
SPRING_PROFILES_ACTIVE=prod

# Dominio
DOMAIN=preprod.plantalinda.com

# IA (opcional)
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
```

---

## Comandos Útiles

```bash
# Ver logs
docker compose -f docker-compose.preprod.yml logs -f

# Reiniciar servicios
docker compose -f docker-compose.preprod.yml restart

# Health check
/opt/deploy/04-health-check.sh

# Backup manual
/opt/deploy/06-backup-db.sh

# Rollback
/opt/deploy/05-rollback.sh HEAD~1
```

---

## Troubleshooting

### Backend no inicia
```bash
docker compose -f docker-compose.preprod.yml logs backend
```

### Error de conexión a DB
```bash
# Verificar que postgres esté corriendo
docker compose -f docker-compose.preprod.yml ps postgres
```

### SSL no funciona
```bash
# Ver logs de Traefik
docker logs traefik
# Verificar DNS apunta al servidor
dig preprod.plantalinda.com
```
