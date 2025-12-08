# Guía de Deploy

## Proceso de Deploy

```
1. Backup automático
2. Git pull
3. Docker build
4. Docker up
5. Smoke tests
6. Health check
```

---

## Deploy Normal

```bash
# Desde el servidor
cd /opt/apps/plantalinda
/opt/deploy/03-deploy-app.sh main
```

---

## Deploy de Branch Específico

```bash
/opt/deploy/03-deploy-app.sh feature/mi-feature
```

---

## Rollback

```bash
# Ver commits disponibles
cd /opt/apps/plantalinda
git log --oneline -10

# Rollback a commit específico
/opt/deploy/05-rollback.sh abc1234

# Rollback al commit anterior
/opt/deploy/05-rollback.sh HEAD~1
```

---

## Verificación Post-Deploy

```bash
# Health check
/opt/deploy/04-health-check.sh

# Smoke tests
./scripts/smoke-test.sh localhost

# API tests
./tests/api/test_api.sh
```

---

## Backups

```bash
# Backup manual
/opt/deploy/06-backup-db.sh

# Ver backups existentes
ls -la /opt/backups/

# Restaurar backup
gunzip -c /opt/backups/ARCHIVO.sql.gz | \
  docker compose exec -T postgres psql -U plantalinda plantalinda_db
```
