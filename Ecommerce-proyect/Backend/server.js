// server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importamos la conexión a la base de datos
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares necesarios
app.use(cors());
app.use(express.json()); // Nos permite leer el JSON (req.body) que mandamos desde el Frontend

// ==========================================
// ENDPOINT 1: Cargar Producto con Variantes (Usado por admin.html)
// ==========================================
app.post('/api/productos', async (req, res) => {
    const { nombre, descripcion, precio, categoria_id, imagen_url, variantes } = req.body;

    // Obtenemos una conexión exclusiva del pool para manejar la transacción de forma segura
    const connection = await pool.getConnection();

    try {
        // Iniciamos la transacción SQL
        await connection.beginTransaction();

        // 1. Insertamos la información base del producto
        const sqlProducto = `
            INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [resultadoProducto] = await connection.query(sqlProducto, [
            nombre, descripcion, precio, categoria_id, imagen_url
        ]);

        // Recuperamos el ID autogenerado del producto que acabamos de crear
        const nuevoProductoId = resultadoProducto.insertId;

        // 2. Si el producto viene con variantes (talles/colores), las guardamos una por una
        if (variantes && variantes.length > 0) {
            const sqlVariante = `
                INSERT INTO variantes_producto (producto_id, talle, color, stock) 
                VALUES (?, ?, ?, ?)
            `;

            // Ejecutamos las inserciones en paralelo vinculándolas al nuevoProductoId
            const promesasVariantes = variantes.map(v => 
                connection.query(sqlVariante, [nuevoProductoId, v.talle, v.color, v.stock])
            );
            await Promise.all(promesasVariantes);
        }

        // Si todo salió bien, confirmamos los cambios de forma permanente en la Base de Datos
        await connection.commit();

        res.status(201).json({
            success: true,
            message: '¡Prenda de ropa y variantes guardadas con éxito!',
            productoId: nuevoProductoId
        });

    } catch (error) {
        // Si ocurre CUALQUIER error, deshacemos todos los cambios para no dejar datos a medias
        await connection.rollback();
        console.error("Error en la transacción de guardado:", error);
        res.status(500).json({ success: false, error: 'Error interno al procesar el alta de la prenda.' });
    } finally {
        // Devolvemos la conexión al pool para que pueda ser reutilizada
        connection.release();
    }
});

// ==========================================
// ENDPOINT 2: Obtener Catálogo Completo (Usado por index.html)
// ==========================================
app.get('/api/productos', async (req, res) => {
    try {
        // Traemos los productos junto a sus variantes haciendo un LEFT JOIN
        const sqlSelect = `
            SELECT p.*, v.id AS id_variante, v.talle, v.color, v.stock 
            FROM productos p
            LEFT JOIN variantes_producto v ON p.id = v.producto_id
            WHERE p.activo = TRUE
        `;
        const [filas] = await pool.query(sqlSelect);

        // Agrupamos el resultado en un formato JSON limpio e idéntico al que espera main.js
        const catalogoRopa = [];

        filas.forEach(fila => {
            let producto = catalogoRopa.find(p => p.id === fila.id);

            // Si es la primera vez que mapeamos este producto, armamos su estructura base
            if (!producto) {
                producto = {
                    id: fila.id,
                    nombre: fila.nombre,
                    descripcion: fila.descripcion,
                    precio: parseFloat(fila.precio),
                    categoria_id: fila.categoria_id,
                    imagen_url: fila.imagen_url,
                    variantes: []
                };
                catalogoRopa.push(producto);
            }

            // Si tiene una variante asociada en esta fila, la empujamos a su array interno
            if (fila.id_variante) {
                producto.variantes.push({
                    id_variante: fila.id_variante,
                    talle: fila.talle,
                    color: fila.color,
                    stock: fila.stock
                });
            }
        });

        res.json(catalogoRopa);

    } catch (error) {
        console.error("Error al consultar el catálogo:", error);
        res.status(500).json({ error: 'Error al obtener los productos del servidor.' });
    }
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de la tienda corriendo en http://localhost:${PORT}`);
});