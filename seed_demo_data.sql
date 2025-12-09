-- Script de Carga de Datos de Prueba (Demo User) - v2
-- Usuario: demo@pro.com / Pass: password

-- 1. Insert User (User table has no created_at column)
INSERT INTO
    _user (
        firstname,
        lastname,
        email,
        password,
        role,
        active
    )
VALUES (
        'Demo',
        'User',
        'demo@pro.com',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
        'MANAGER',
        true
    )
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Organization
INSERT INTO
    organization (
        name,
        slug,
        plan,
        owner_id,
        active,
        max_users,
        max_batches,
        created_at,
        updated_at
    )
SELECT 'Demo Organization', 'demo-org', 'PRO', id, true, 5, 20, NOW(), NOW()
FROM _user
WHERE
    email = 'demo@pro.com'
    AND NOT EXISTS (
        SELECT 1
        FROM organization
        WHERE
            slug = 'demo-org'
    );

-- 3. Link User to Organization
UPDATE _user
SET
    organization_id = (
        SELECT id
        FROM organization
        WHERE
            slug = 'demo-org'
    )
WHERE
    email = 'demo@pro.com';

-- 4. Insert Batch (Lote de Prueba)
INSERT INTO
    batch (
        name,
        strain,
        plant_count,
        current_stage,
        germination_date,
        status,
        notes,
        created_at,
        user_id,
        organization_id
    )
SELECT 'Lote Demo #1', 'Gorilla Glue', 10, 'VEGETATIVE', CURRENT_DATE - INTERVAL '15 days', 'ACTIVE', 'Cultivo demostrativo.', NOW(), u.id, o.id
FROM _user u, organization o
WHERE
    u.email = 'demo@pro.com'
    AND o.slug = 'demo-org'
    AND NOT EXISTS (
        SELECT 1
        FROM batch
        WHERE
            name = 'Lote Demo #1'
            AND organization_id = o.id
    );

-- 5. Insert Inventory Items
-- 5.1 Fertilizer
INSERT INTO
    inventory_item (
        name,
        type,
        description,
        current_quantity,
        minimum_quantity,
        unit,
        brand,
        supplier,
        unit_cost,
        created_at,
        user_id,
        organization_id
    )
SELECT 'Top Veg', 'FERTILIZER', 'Fertilizante rico en nitrógeno', 1.5, 0.5, 'LITER', 'Top Crop', 'GrowShop Demo', 12500, NOW(), u.id, o.id
FROM _user u, organization o
WHERE
    u.email = 'demo@pro.com'
    AND o.slug = 'demo-org'
    AND NOT EXISTS (
        SELECT 1
        FROM inventory_item
        WHERE
            name = 'Top Veg'
            AND organization_id = o.id
    );

-- 5.2 Seeds
INSERT INTO
    inventory_item (
        name,
        type,
        description,
        current_quantity,
        minimum_quantity,
        unit,
        strain,
        created_at,
        user_id,
        organization_id
    )
SELECT 'Semillas GG#4', 'SEED', 'Pack de semillas', 3, 1, 'UNIT', 'Gorilla Glue', NOW(), u.id, o.id
FROM _user u, organization o
WHERE
    u.email = 'demo@pro.com'
    AND o.slug = 'demo-org'
    AND NOT EXISTS (
        SELECT 1
        FROM inventory_item
        WHERE
            name = 'Semillas GG#4'
            AND organization_id = o.id
    );

-- 5.3 Substrate
INSERT INTO
    inventory_item (
        name,
        type,
        description,
        current_quantity,
        minimum_quantity,
        unit,
        brand,
        created_at,
        user_id,
        organization_id
    )
SELECT 'Sustrato Complete', 'SUBSTRATE', 'Sustrato liviano 50L', 2, 1, 'UNIT', 'GrowMix', NOW(), u.id, o.id
FROM _user u, organization o
WHERE
    u.email = 'demo@pro.com'
    AND o.slug = 'demo-org'
    AND NOT EXISTS (
        SELECT 1
        FROM inventory_item
        WHERE
            name = 'Sustrato Complete'
            AND organization_id = o.id
    );

-- 6. Insert Batch Logs (Bitacora)
INSERT INTO
    batch_log (
        batch_id,
        timestamp,
        ph,
        ec,
        temperature,
        humidity,
        stage_at_time,
        type,
        notes
    )
SELECT b.id, NOW() - INTERVAL '5 days', 6.2, 1.2, 24.5, 55.0, 'VEGETATIVE', 'MEDICION', 'Todo normal, riego con agua sola.'
FROM batch b
    JOIN organization o ON b.organization_id = o.id
WHERE
    b.name = 'Lote Demo #1'
    AND o.slug = 'demo-org'
    AND NOT EXISTS (
        SELECT 1
        FROM batch_log
        WHERE
            batch_id = b.id
            AND type = 'MEDICION'
    );

INSERT INTO
    batch_log (
        batch_id,
        timestamp,
        ph,
        ec,
        temperature,
        humidity,
        stage_at_time,
        type,
        notes
    )
SELECT b.id, NOW() - INTERVAL '2 days', 6.0, 1.4, 25.0, 60.0, 'VEGETATIVE', 'RIEGO', 'Riego con fertilizante Top Veg 2ml/L.'
FROM batch b
    JOIN organization o ON b.organization_id = o.id
WHERE
    b.name = 'Lote Demo #1'
    AND o.slug = 'demo-org'
    AND NOT EXISTS (
        SELECT 1
        FROM batch_log
        WHERE
            batch_id = b.id
            AND type = 'RIEGO'
    );