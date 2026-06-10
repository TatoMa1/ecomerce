document.addEventListener('DOMContentLoaded', () => {
    const btnAgregarVariante = document.getElementById('btn-agregar-variante-form');
    const contenedorVariantes = document.getElementById('contenedor-variantes-dinamicas');
    const formProducto = document.getElementById('form-cargar-producto');

    // Permitir al administrador añadir múltiples filas de Talles/Colores en caliente
    btnAgregarVariante.addEventListener('click', () => {
        const nuevaFila = document.createElement('div');
        nuevaFila.className = 'fila-variante';
        nuevaFila.innerHTML = `
            <input type="text" placeholder="Talle (Ej: M, L, 42)" required class="v-talle">
            <input type="text" placeholder="Color (Ej: Negro, Azul)" required class="v-color">
            <input type="number" placeholder="Stock" min="0" required class="v-stock">
            <button type="button" onclick="this.parentElement.remove()" style="background:#e74c3c; width:auto; padding:0 0.5rem;">X</button>
        `;
        contenedorVariantes.appendChild(nuevaFila);
    });

    // Interceptar el envío del formulario para enviarlo al Servidor (API Backend)
    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Recolectar datos del producto base
        const nuevoProducto = {
            nombre: document.getElementById('prod-nombre').value,
            descripcion: document.getElementById('prod-descripcion').value,
            precio: parseFloat(document.getElementById('prod-precio').value),
            categoria_id: parseInt(document.getElementById('prod-categoria').value),
            imagen_url: document.getElementById('prod-imagen').value,
            variantes: [] // Aquí meteremos las combinaciones
        };

        // 2. Recolectar todas las variantes cargadas dinámicamente
        const filasVariantes = document.querySelectorAll('.fila-variante');
        filasVariantes.forEach(fila => {
            const talle = fila.querySelector('.v-talle').value;
            const color = fila.querySelector('.v-color').value;
            const stock = parseInt(fila.querySelector('.v-stock').value);

            nuevoProducto.variantes.push({ talle, color, stock });
        });

        console.log("Enviando este objeto estructurado al Backend:", nuevoProducto);

        // 3. Envío Real a la API (Cuando construyas tu archivo de servidor en Node.js o Python)
        
        try {
            const respuesta = await fetch('http://localhost:3000/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto)
            });

            if (respuesta.ok) {
                alert("¡Prenda guardada exitosamente en la Base de Datos!");
                formProducto.reset();
                // Dejar solo una fila de variante limpia
                contenedorVariantes.innerHTML = `
                    <div class="fila-variante">
                        <input type="text" placeholder="Talle" required class="v-talle">
                        <input type="text" placeholder="Color" required class="v-color">
                        <input type="number" placeholder="Stock" min="0" required class="v-stock">
                    </div>
                `;
            } else {
                alert("Hubo un error al guardar.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
        
        
    alert("Simulación de envío: Datos mostrados en la consola del navegador.");
    });
});