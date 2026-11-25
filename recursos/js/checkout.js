// Prepara el pedido para que el cliente lo revise antes de enviarlo por WhatsApp.

import { CLAVE_CARRITO, leerCarrito, calcularResumen, formatearImporte } from "./carrito.js";

const formulario = document.querySelector(".formulario");

function actualizarResumen() {
    const { subtotal, impuestos, total } = calcularResumen(leerCarrito());
    document.querySelector("#importe-subtotal").textContent = formatearImporte(subtotal);
    document.querySelector("#importe-impuestos").textContent = formatearImporte(impuestos);
    document.querySelector("#importe-total").textContent = formatearImporte(total);
}

actualizarResumen();
window.addEventListener("pageshow", evento => {
    if (evento.persisted) actualizarResumen();
});
window.addEventListener("storage", evento => {
    if (evento.key === CLAVE_CARRITO || evento.key === null) actualizarResumen();
});

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Leemos los valores del formulario
    const nombre = document.querySelector("#id-nombre").value;
    const email = document.querySelector("#id-email").value;
    const telefono = document.querySelector("#id-telefono").value;
    const direccion = document.querySelector("#id-direccion").value;
    const ciudad = document.querySelector("#id-ciudad").value;
    const codigoPostal = document.querySelector("#id-codigo-postal").value;

    // Verificamos que no haya campos vacíos
    if (!nombre || !email || !telefono || !direccion || !ciudad || !codigoPostal) {
        alert("Por favor completá todos los campos antes de preparar el pedido.");
        return;
    }

    const carrito = leerCarrito();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agregá un producto para preparar el pedido.");
        return;
    }

    const opcionPago = formulario.querySelector('input[name="metodo-pago"]:checked');
    const pedido = {
        codigo: "RG-" + Date.now().toString(36).toUpperCase(),
        nombre: nombre,
        direccion: direccion + ", " + ciudad + " (CP: " + codigoPostal + ")",
        metodoPago: opcionPago?.labels[0]?.textContent.trim(),
        ...calcularResumen(carrito),
        productos: carrito,
        estadoWhatsApp: "pendiente"
    };

    localStorage.setItem("ultimo_pedido", JSON.stringify(pedido));
    window.location.href = "./confirmacion.html";
});
