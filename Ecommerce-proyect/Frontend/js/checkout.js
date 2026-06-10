// Recuperamos el carrito guardado
const carrito = JSON.parse(localStorage.getItem('carrito-ecommerce')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Serás redirigido a la tienda.");
        window.location.href = "index.html";
        return;
    }
    renderizarResumen();
});

function renderizarResumen() {
    const lista = document.getElementById('lista-checkout');
    const totalElemento = document.getElementById('total-checkout');
    let total = 0;

    lista.innerHTML = '';
    
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        lista.innerHTML += `
            <div class="item-carrito">
                <span>${item.cantidad}x ${item.nombre}</span>
                <span>$${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
            </div>
        `;
    });

    totalElemento.innerText = total.toLocaleString('es-AR');
}

// Interceptamos el envío del formulario
document.getElementById('form-checkout').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue

    const boton = document.querySelector('.btn-pagar');
    boton.innerText = 'Procesando...';
    boton.disabled = true;

    // Recopilamos los datos del cliente y el pedido
    const orden = {
        cliente: {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value
        },
        items: carrito
    };

    console.log("Orden lista para enviar al backend (SQL/Mercado Pago):", orden);

    /* 
    ACÁ IRÁ LA CONEXIÓN CON TU BACKEND (NODE.JS O PYTHON):
    try {
        const respuesta = await fetch('https://tu-api.com/crear-preferencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orden)
        });
        const data = await respuesta.json();
        // Redirigimos al usuario a Mercado Pago
        window.location.href = data.init_point; 
    } catch (error) {
        console.error(error);
    }
    */

    // Simulación temporal para probar el flujo
    setTimeout(() => {
        alert("¡Pedido registrado en consola! Acá el usuario sería redirigido a Mercado Pago.");
        localStorage.removeItem('carrito-ecommerce'); // Vaciamos el carrito
        window.location.href = "index.html";
    }, 2000);
});