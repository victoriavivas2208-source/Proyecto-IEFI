// Script del carrito de compras
// Lee los productos guardados en localStorage y los muestra en pantalla

import { productos } from "./productos.js";
import { CLAVE_CARRITO, leerCarrito, guardarCarrito, calcularTotal, calcularImpuestos, calcularImpuestosCorrectos } from "./carrito.js";

const modoImpuestos = new URLSearchParams(window.location.search).get("impuestos");
const esDemostracion = modoImpuestos === "simulado" || modoImpuestos === "correcto";
const simularError = modoImpuestos === "simulado";

let carrito = esDemostracion ? [{
    id: "llantas-rs7",
    nombre: "Llantas Forjadas RS-7",
    precio: 1200,
    cantidad: 20,
    imagen: "./recursos/imagenes/producto/llantas.jpg"
}] : leerCarrito();

// Elementos del HTML
const contenedorProductos = document.querySelector(".carrito-productos");
const listaResumen = document.querySelector(".resumen-pedido ul");

if (esDemostracion) {
    document.querySelector("#continuar-pedido").remove();
    const estadoImpuestos = document.querySelector("#estado-impuestos");
    estadoImpuestos.hidden = false;
    estadoImpuestos.textContent = simularError
        ? "Demostración con error. El impuesto de cada unidad se redondea a centenas de pesos antes de sumarse."
        : "Demostración con cálculo correcto. Se aplica el 21 % al subtotal.";
} else {
    document.querySelector("#volver-carrito-real").remove();
}

function formatearImporte(importe) {
    return "$ " + importe.toLocaleString("es-AR");
}

// Función que dibuja los productos del carrito en el HTML
function mostrarCarrito() {
    contenedorProductos.innerHTML = "";

    if (carrito.length === 0) {
        contenedorProductos.innerHTML = '<div class="mensaje-vacio"><p>Tu carrito está vacío.</p><a class="boton-secundario" href="./catalogo.html">Explorar el catálogo</a></div>';
    } else {
        carrito.forEach(function (item) {
            const articulo = document.createElement("article");
            articulo.className = "item-carrito";

            const imagen = productos?.find(producto => producto.id === item.id)?.imagen ?? item.imagen;
            articulo.innerHTML = `
                <picture>
                    <img src="${imagen}" alt="${item.nombre}">
                </picture>
                <h3>${item.nombre}</h3>
                <div class="campo-formulario">
                    <label for="cant-${item.id}">Cantidad</label>
                    <input type="number" id="cant-${item.id}" class="input-cantidad" data-id="${item.id}" value="${item.cantidad}" min="1">
                </div>
                <p class="item-carrito-precio">$ ${(item.precio * item.cantidad).toLocaleString("es-AR")}</p>
                <button class="boton-secundario" type="button" data-id="${item.id}">Eliminar</button>
            `;

            contenedorProductos.appendChild(articulo);
        });
    }

    const subtotal = calcularTotal(carrito);
    let impuestos = 0;
    if (esDemostracion) {
        impuestos = simularError ? calcularImpuestos(carrito) : calcularImpuestosCorrectos(carrito);
    }
    listaResumen.innerHTML = `
        <li><span>Subtotal</span><span>${formatearImporte(subtotal)}</span></li>
        ${esDemostracion ? `<li><span>Impuestos de ejemplo (21 %)</span><span>${formatearImporte(impuestos)}</span></li>` : ""}
        <li><span>Envío</span><span>Gratis</span></li>
        <li><span>Total</span><span>${formatearImporte(subtotal + impuestos)}</span></li>
    `;
}

// Evento: cuando se modifica la cantidad en el input
contenedorProductos.addEventListener("change", function (evento) {
    if (evento.target.classList.contains("input-cantidad")) {
        const idCambiado = evento.target.dataset.id;
        const nuevaCantidad = parseInt(evento.target.value);

        if (nuevaCantidad >= 1) {
            carrito.forEach(function (item) {
                if (item.id === idCambiado) {
                    item.cantidad = nuevaCantidad;
                }
            });
            if (!esDemostracion) guardarCarrito(carrito);
            mostrarCarrito();
        }
    }
});

// Evento: cuando se hace click en "Eliminar" borramos ese producto del carrito
contenedorProductos.addEventListener("click", function (evento) {
    if (evento.target.tagName === "BUTTON") {
        const idAEliminar = evento.target.dataset.id;

        // Buscamos el índice del producto en el array
        let indice = -1;
        carrito.forEach(function (item, i) {
            if (item.id === idAEliminar) {
                indice = i;
            }
        });

        // Lo eliminamos del array y actualizamos el localStorage
        if (indice !== -1) {
            carrito.splice(indice, 1);
            if (!esDemostracion) guardarCarrito(carrito);
            mostrarCarrito();
        }
    }
});

// Mostramos el carrito al cargar la página
mostrarCarrito();

function actualizarCarrito() {
    if (esDemostracion) return;
    carrito = leerCarrito();
    mostrarCarrito();
}

window.addEventListener("pageshow", evento => {
    if (evento.persisted) actualizarCarrito();
});

window.addEventListener("storage", evento => {
    if (evento.key === CLAVE_CARRITO || evento.key === null) actualizarCarrito();
});
