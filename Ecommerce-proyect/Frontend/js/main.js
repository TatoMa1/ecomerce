// Borramos los datos duros y lo dejamos preparado para la base de datos
let productosAPI = []; 

let carrito = JSON.parse(localStorage.getItem('carrito-ecommerce')) || [];

document.addEventListener('DOMContentLoaded', async () => {
    // LLAMADA AL BACKEND: Traemos la ropa guardada por el administrador
    await cargarProductosDesdeBD(); 
    
    renderizarProductos();
    actualizarVistaCarrito();
});

async function cargarProductosDesdeBD() {
    /* CONEXIÓN REAL:*/ 
    try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        productosAPI = await respuesta.json();
    } catch (error) {
        console.error("Error al traer los productos:", error);
    }
    
    
    // Mientras no tengas el backend encendido, dejamos datos de respaldo para que no falle la web:
    if(productosAPI.length === 0) {
        productosAPI = [
            { 
                id: 1, 
                nombre: 'Remera Oversize', 
                precio: 18500.00,
                variantes: [
                    { id_variante: 101, talle: 'M', color: 'Negro', stock: 5 },
                    { id_variante: 102, talle: 'L', color: 'Negro', stock: 2 }
                ]
            }
        ];
    }
}

// ... El resto de tus funciones (renderizarProductos, agregarAlCarrito, etc.) se quedan exactamente igual a como las modificamos antes.