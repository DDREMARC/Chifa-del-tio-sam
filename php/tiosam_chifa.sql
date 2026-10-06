-- BASE DE DATOS DEL PROYECTO: importa este archivo desde phpMyAdmin
-- (pestaña Importar) o con: mysql -u root < php/tiosam_chifa.sql
CREATE DATABASE IF NOT EXISTS tiosam_chifa
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE tiosam_chifa;

-- RESERVAS: registros recibidos desde el formulario de contacto.html.
CREATE TABLE IF NOT EXISTS reservas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(60) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(80) NOT NULL DEFAULT '',
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    personas TINYINT UNSIGNED NOT NULL,
    comentarios TEXT NOT NULL,
    creado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
