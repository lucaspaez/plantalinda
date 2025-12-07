-- =====================================================
-- Script de Migración V2: Completar Multi-Tenancy
-- Versión: 2.0
-- Fecha: 2025-12-05
-- Descripción: Agrega organization_id a entidades faltantes y activa FKs
-- =====================================================

-- PASO 1: Agregar organization_id a diagnosis si no existe
ALTER TABLE diagnosis 
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

-- PASO 2: Migrar diagnósticos existentes
UPDATE diagnosis d
SET organization_id = u.organization_id
FROM _user u
WHERE d.user_id = u.id
AND d.organization_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_diagnosis_organization ON diagnosis(organization_id);

-- PASO 3: Agregar organization_id a inventory_movement si no existe
ALTER TABLE inventory_movement 
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

-- PASO 4: Migrar movimientos existentes
UPDATE inventory_movement im
SET organization_id = u.organization_id
FROM _user u
WHERE im.user_id = u.id
AND im.organization_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_inventory_movement_organization ON inventory_movement(organization_id);

-- PASO 5: Verificar y actualizar inventory_item
-- (La columna ya debería existir de V1, pero por seguridad)
ALTER TABLE inventory_item 
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

UPDATE inventory_item i
SET organization_id = u.organization_id
FROM _user u
WHERE i.user_id = u.id
AND i.organization_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_inventory_item_organization ON inventory_item(organization_id);

-- =====================================================
-- PASO 6: Activar Foreign Keys
-- =====================================================

-- FK para _user -> organization
ALTER TABLE _user
DROP CONSTRAINT IF EXISTS fk_user_organization;

ALTER TABLE _user
ADD CONSTRAINT fk_user_organization 
FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE SET NULL;

-- FK para batch -> organization
ALTER TABLE batch
DROP CONSTRAINT IF EXISTS fk_batch_organization;

ALTER TABLE batch
ADD CONSTRAINT fk_batch_organization 
FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- FK para inventory_item -> organization
ALTER TABLE inventory_item
DROP CONSTRAINT IF EXISTS fk_inventory_item_organization;

ALTER TABLE inventory_item
ADD CONSTRAINT fk_inventory_item_organization 
FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- FK para diagnosis -> organization
ALTER TABLE diagnosis
DROP CONSTRAINT IF EXISTS fk_diagnosis_organization;

ALTER TABLE diagnosis
ADD CONSTRAINT fk_diagnosis_organization 
FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- FK para inventory_movement -> organization
ALTER TABLE inventory_movement
DROP CONSTRAINT IF EXISTS fk_inventory_movement_organization;

ALTER TABLE inventory_movement
ADD CONSTRAINT fk_inventory_movement_organization 
FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

-- FK para report -> organization (reports table)
ALTER TABLE report
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

UPDATE report r
SET organization_id = u.organization_id
FROM _user u
WHERE r.user_id = u.id
AND r.organization_id IS NULL;

ALTER TABLE report
DROP CONSTRAINT IF EXISTS fk_report_organization;

ALTER TABLE report
ADD CONSTRAINT fk_report_organization 
FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_report_organization ON report(organization_id);

-- FK para notification -> organization
ALTER TABLE notification
ADD COLUMN IF NOT EXISTS organization_id BIGINT;

UPDATE notification n
SET organization_id = u.organization_id
FROM _user u
WHERE n.user_id = u.id
AND n.organization_id IS NULL;

ALTER TABLE notification
DROP CONSTRAINT IF EXISTS fk_notification_organization;

ALTER TABLE notification
ADD CONSTRAINT fk_notification_organization 
FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_notification_organization ON notification(organization_id);

-- =====================================================
-- PASO 7: Verificación de datos
-- =====================================================

-- Verificar que no hay registros huérfanos
SELECT 'inventory_item' as entity, COUNT(*) as orphans 
FROM inventory_item WHERE organization_id IS NULL
UNION ALL
SELECT 'diagnosis', COUNT(*) FROM diagnosis WHERE organization_id IS NULL
UNION ALL
SELECT 'inventory_movement', COUNT(*) FROM inventory_movement WHERE organization_id IS NULL
UNION ALL
SELECT 'report', COUNT(*) FROM report WHERE organization_id IS NULL
UNION ALL
SELECT 'notification', COUNT(*) FROM notification WHERE organization_id IS NULL;

-- =====================================================
-- FIN DEL SCRIPT DE MIGRACIÓN V2
-- =====================================================
