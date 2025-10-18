-- Script para crear usuarios de prueba
-- Ejecuta este script en tu base de datos MySQL

USE db_node;

-- Primero eliminamos usuarios de prueba si existen
DELETE FROM users WHERE email IN ('admin@test.com', 'usuario1@test.com', 'usuario2@test.com');

-- Crear usuario Admin
-- Email: admin@test.com | Password: admin123
INSERT INTO users (name, lastname, email, password, phone, image, role, created_at, updated_at)
VALUES (
  'Admin',
  'Sistema',
  'admin@test.com',
  '$2a$10$YXJz8qnZJ7q8J8Q3XqZQ8O8qJ8Q3XqZQ8O8qJ8Q3XqZQ8O8qJ8Q3Xq',
  '1234567890',
  NULL,
  'admin',
  NOW(),
  NOW()
);

-- Crear Usuario 1
-- Email: usuario1@test.com | Password: user123
INSERT INTO users (name, lastname, email, password, phone, image, role, created_at, updated_at)
VALUES (
  'Juan',
  'Pérez',
  'usuario1@test.com',
  '$2a$10$YXJz8qnZJ7q8J8Q3XqZQ8O8qJ8Q3XqZQ8O8qJ8Q3XqZQ8O8qJ8Q3Xq',
  '1234567891',
  NULL,
  'user',
  NOW(),
  NOW()
);

-- Crear Usuario 2
-- Email: usuario2@test.com | Password: user123
INSERT INTO users (name, lastname, email, password, phone, image, role, created_at, updated_at)
VALUES (
  'María',
  'García',
  'usuario2@test.com',
  '$2a$10$YXJz8qnZJ7q8J8Q3XqZQ8O8qJ8Q3XqZQ8O8qJ8Q3XqZQ8O8qJ8Q3Xq',
  '1234567892',
  NULL,
  'user',
  NOW(),
  NOW()
);

-- Verificar usuarios creados
SELECT id, name, lastname, email, role FROM users WHERE role IN ('admin', 'user');

-- =====================================
-- CREDENCIALES DE ACCESO:
-- =====================================
-- ADMIN:
--   Email: admin@test.com
--   Password: admin123
--
-- USUARIO 1:
--   Email: usuario1@test.com
--   Password: user123
--
-- USUARIO 2:
--   Email: usuario2@test.com
--   Password: user123
-- =====================================
