-- Script para resetear usuarios y crear usuarios de prueba

-- 1. Eliminar todos los batches (para evitar problemas de foreign keys)
DELETE FROM batch;

-- 2. Eliminar todos los usuarios
DELETE FROM _user;

-- 3. Eliminar todas las organizaciones
DELETE FROM organization;

-- 4. Crear organización FREE para usuario demo
INSERT INTO organization (name, slug, plan, owner_id, active, max_users, max_batches, created_at, updated_at)
VALUES (
    'Demo FREE Organization',
    'demo-free-org',
    'FREE',
    NULL,
    TRUE,
    1,
    5,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 5. Crear usuario demo@demo.com (FREE)
-- Contraseña: demo123
INSERT INTO _user (email, firstname, lastname, password, role, organization_id)
VALUES (
    'demo@demo.com',
    'Demo',
    'User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu',
    'OWNER',
    (SELECT id FROM organization WHERE slug = 'demo-free-org')
);

-- 6. Actualizar owner_id de la organización FREE
UPDATE organization
SET owner_id = (SELECT id FROM _user WHERE email = 'demo@demo.com')
WHERE slug = 'demo-free-org';

-- 7. Crear organización PRO para usuario demopro
INSERT INTO organization (name, slug, plan, owner_id, active, max_users, max_batches, created_at, updated_at)
VALUES (
    'Demo PRO Organization',
    'demo-pro-org',
    'PRO',
    NULL,
    TRUE,
    10,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 8. Crear usuario demopro@demo.com (PRO)
-- Contraseña: demo123
INSERT INTO _user (email, firstname, lastname, password, role, organization_id)
VALUES (
    'demopro@demo.com',
    'Demo',
    'PRO',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu',
    'OWNER',
    (SELECT id FROM organization WHERE slug = 'demo-pro-org')
);

-- 9. Actualizar owner_id de la organización PRO
UPDATE organization
SET owner_id = (SELECT id FROM _user WHERE email = 'demopro@demo.com')
WHERE slug = 'demo-pro-org';

-- 10. Verificar usuarios creados
SELECT 
    u.id,
    u.email,
    u.firstname,
    u.lastname,
    u.role,
    o.name as organization,
    o.plan,
    o.max_users,
    o.max_batches
FROM _user u
JOIN organization o ON u.organization_id = o.id
ORDER BY u.id;

-- Resumen
SELECT 'Usuarios creados:' as info;
SELECT COUNT(*) as total_users FROM _user;
SELECT 'Organizaciones creadas:' as info;
SELECT COUNT(*) as total_orgs FROM organization;
