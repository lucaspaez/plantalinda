-- Script para actualizar un usuario a PRO
-- Ejecutar en PostgreSQL

-- Ver usuarios actuales
SELECT id, email, firstname, lastname, role FROM _user;

-- Actualizar usuario a PRO (cambiar el email por el tuyo)
UPDATE _user 
SET role = 'PRO' 
WHERE email = 'lucaspaez.ar@gmail.com';

-- Verificar cambio
SELECT id, email, firstname, lastname, role FROM _user;
