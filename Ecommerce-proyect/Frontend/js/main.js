// Array temporal simulando los datos que luego traeremos de tu SQL vía Fetch
const productosAPI = [
    { id: 1, nombre: 'Bálsamo para Barba Premium', precio: 8500.00 },
    { id: 2, nombre: 'Loción Post-Tatuaje', precio: 12000.00 },
    { id: 3, nombre: 'Máquina de Corte Profesional', precio: 145000.00 },
    { id: 4, nombre: 'Pomada Fijadora Mate', precio: 9200.00 }
];

// Inicializamos el carrito buscando si ya hay algo guardado en el navegador
let carrito = JSON.parse(localStorage.getItem('carrito-ecommerce')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    actualizarVistaCarrito();
});

function renderizarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    productosAPI.forEach(prod => {
        contenedor.innerHTML += `
            <div class="card">
                <h3>${prod.nombre}</h3>
                <p class="precio">$${prod.precio.toLocaleString('es-AR')}</p>
                <button onclick="agregarAlCarrito(${prod.id})">Agregar al Carrito</button>
            </div>
        `;
    });
}

function agregarAlCarrito(idProducto) {
    // Buscamos la info del producto
    const producto = productosAPI.find(p => p.id === idProducto);
    
    // Verificamos si ya está en el carrito
    const itemEnCarrito = carrito.find(item => item.id === idProducto);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarYRenderizar();
}

function guardarYRenderizar() {
    // Guardamos en LocalStorage para que checkout.html pueda leerlo
    localStorage.setItem('carrito-ecommerce', JSON.stringify(carrito));
    actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
    const contenedorCarrito = document.getElementById('items-carrito');
    const contador = document.getElementById('contador-carrito');
    const precioTotal = document.getElementById('precio-total');

    contenedorCarrito.innerHTML = '';
    let total = 0;
    let cantidadItems = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        cantidadItems += item.cantidad;
        contenedorCarrito.innerHTML += `
            <div class="item-carrito">
                <span>${item.cantidad}x ${item.nombre}</span>
                <span>$${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
            </div>
        `;
    });

    contador.innerText = cantidadItems;
    precioTotal.innerText = total.toLocaleString('es-AR');
}