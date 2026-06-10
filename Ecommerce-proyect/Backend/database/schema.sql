-- Creación de la base de datos (opcional, dependiendo de tu gestor)
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- 1. Tabla de Categorías (Para organizar el catálogo)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- 2. Tabla de Productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL, -- DECIMAL es clave para manejar dinero sin perder precisión
    stock INT NOT NULL DEFAULT 0,
    categoria_id INT,
    imagen_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,    -- Permite ocultar productos sin borrarlos (Soft Delete)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- 3. Tabla de Clientes (Información básica para asociar la compra)
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Ventas / Órdenes
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    total DECIMAL(10, 2) NOT NULL,
    estado_pago VARCHAR(50) DEFAULT 'pendiente', -- Ej: pendiente, aprobado, rechazado
    mp_preference_id VARCHAR(255),               -- Para vincular con el checkout de Mercado Pago
    mp_payment_id VARCHAR(255),                  -- El ID de la transacción una vez aprobada
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- 5. Tabla de Detalle de Ventas (El puente entre la Venta y los Productos)
CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,     -- ¡Fundamental guardar el precio histórico!
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);