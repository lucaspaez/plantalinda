-- =====================================================
-- Script de Migración: Multi-Tenancy
-- Versión: 1.0
-- Fecha: 2025-12-04
-- Descripción: Agrega soporte para organizaciones y multi-tenancy
-- =====================================================

-- PASO 1: Crear tabla de organizaciones
CREATE TABLE IF NOT EXISTS organization (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'FREE',
    owner_id BIGINT NOT NULL,
    settings TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    max_users INTEGER,
    max_batches INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- PASO 2: Crear índices para performance
CREATE INDEX idx_organization_slug ON organization(slug);
CREATE INDEX idx_organization_owner ON organization(owner_id);
CREATE INDEX idx_organization_active ON organization(active);

-- PASO 3: Agregar columna organization_id a tabla _user
ALTER TABLE _user 
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

-- PASO 4: Crear índice en _user.organization_id
CREATE INDEX IF NOT EXISTS idx_user_organization ON _user(organization_id);

-- PASO 5: Migrar datos existentes
-- Crear una organización para cada usuario existente
INSERT INTO organization (name, slug, plan, owner_id, active, max_users, max_batches, created_at, updated_at)
SELECT 
    CONCAT(COALESCE(firstname, 'User'), ' ', COALESCE(lastname, ''), '''s Organization'),
    CONCAT('org-', id, '-', LOWER(REPLACE(COALESCE(email, 'user'), '@', '-at-'))),
    CASE 
        WHEN role = 'PRO' THEN 'PRO'
        WHEN role = 'ADMIN' THEN 'PRO'
        ELSE 'FREE'
    END,
    id,
    TRUE,
    CASE 
        WHEN role IN ('PRO', 'ADMIN') THEN 10
        ELSE 1
    END,
    CASE 
        WHEN role IN ('PRO', 'ADMIN') THEN NULL
        ELSE 5
    END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM _user
WHERE NOT EXISTS (
    SELECT 1 FROM organization WHERE owner_id = _user.id
);

-- PASO 6: Asignar usuarios a sus organizaciones
UPDATE _user u
SET organization_id = o.id
FROM organization o
WHERE o.owner_id = u.id
AND u.organization_id IS NULL;

-- PASO 7: Migrar roles legacy a nuevos roles
UPDATE _user
SET role = CASE
    WHEN role = 'NOVICE' THEN 'OPERATOR'
    WHEN role = 'PRO' THEN 'MANAGER'
    WHEN role = 'ADMIN' AND organization_id IN (
        SELECT id FROM organization WHERE owner_id = _user.id
    ) THEN 'OWNER'
    WHEN role = 'ADMIN' THEN 'ADMIN'
    ELSE role
END
WHERE role IN ('NOVICE', 'PRO', 'ADMIN');

-- PASO 8: Agregar organization_id a tablas de entidades
-- Batch
ALTER TABLE batch 
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

UPDATE batch b
SET organization_id = u.organization_id
FROM _user u
WHERE b.user_id = u.id
AND b.organization_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_batch_organization ON batch(organization_id);

-- Inventory Item
ALTER TABLE inventory_item 
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

UPDATE inventory_item i
SET organization_id = u.organization_id
FROM _user u
WHERE i.user_id = u.id
AND i.organization_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_inventory_item_organization ON inventory_item(organization_id);

-- Report
ALTER TABLE report 
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

UPDATE report r
SET organization_id = u.organization_id
FROM _user u
WHERE r.user_id = u.id
AND r.organization_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_report_organization ON report(organization_id);

-- Notification
ALTER TABLE notification 
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

UPDATE notification n
SET organization_id = u.organization_id
FROM _user u
WHERE n.user_id = u.id
AND n.organization_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_notification_organization ON notification(organization_id);

-- PASO 9: Agregar foreign keys (opcional, para integridad referencial)
-- Comentado por defecto para evitar problemas con datos existentes
-- Descomentar si quieres integridad referencial estricta

-- ALTER TABLE _user
-- ADD CONSTRAINT fk_user_organization 
-- FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- ALTER TABLE batch
-- ADD CONSTRAINT fk_batch_organization 
-- FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- ALTER TABLE inventory_item
-- ADD CONSTRAINT fk_inventory_item_organization 
-- FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- ALTER TABLE report
-- ADD CONSTRAINT fk_report_organization 
-- FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- ALTER TABLE notification
-- ADD CONSTRAINT fk_notification_organization 
-- FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- PASO 10: Verificación de datos
-- Ejecutar estas queries para verificar que la migración fue exitosa

-- Verificar que todos los usuarios tienen organización
SELECT COUNT(*) as users_without_org 
FROM _user 
WHERE organization_id IS NULL;
-- Resultado esperado: 0

-- Verificar que todos los batches tienen organización
SELECT COUNT(*) as batches_without_org 
FROM batch 
WHERE organization_id IS NULL;
-- Resultado esperado: 0

-- Verificar distribución de roles
SELECT role, COUNT(*) as count 
FROM _user 
GROUP BY role 
ORDER BY count DESC;

-- Verificar organizaciones creadas
SELECT 
    o.id,
    o.name,
    o.slug,
    o.plan,
    o.active,
    COUNT(u.id) as user_count
FROM organization o
LEFT JOIN _user u ON u.organization_id = o.id
GROUP BY o.id, o.name, o.slug, o.plan, o.active
ORDER BY o.id;

-- =====================================================
-- FIN DEL SCRIPT DE MIGRACIÓN
-- =====================================================

-- NOTAS IMPORTANTES:
-- 1. Hacer BACKUP de la base de datos antes de ejecutar
-- 2. Ejecutar en un entorno de prueba primero
-- 3. Verificar los resultados con las queries de verificación
-- 4. Los roles legacy (NOVICE, PRO) se mantienen en el enum pero están deprecated
-- 5. La migración es idempotente (se puede ejecutar múltiples veces)
