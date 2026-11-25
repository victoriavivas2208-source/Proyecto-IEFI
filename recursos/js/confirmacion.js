import { leerCarrito, vaciarCarritoSiCoincide, formatearImporte } from "./carrito.js";

const numeroWhatsApp = "5493512031101";
const contenedor = document.querySelector(".mensaje-confirmacion");
const pedidoGuardado = localStorage.getItem("ultimo_pedido");

function crearEnlaceWhatsApp(pedido) {
    const referencia = pedido.codigo ? " " + pedido.codigo : "";
    const mensaje = [
        "¡Hola, Racing Garage! Quiero enviar este pedido" + referencia + ".",
        "",
        ...pedido.productos.map(producto =>
            "• " + producto.nombre + " × " + producto.cantidad + " — " +
            formatearImporte(producto.precio * producto.cantidad)
        ),
        ""
    ];
    if (typeof pedido.impuestos === "number") {
        mensaje.push("Subtotal: " + formatearImporte(pedido.subtotal), "Impuestos (21 %): " + formatearImporte(pedido.impuestos));
    }
    mensaje.push(
        "Total: " + formatearImporte(pedido.total),
        "Nombre: " + pedido.nombre,
        "Dirección de envío: " + pedido.direccion
    );
    if (pedido.metodoPago) mensaje.push("Forma de pago elegida: " + pedido.metodoPago);

    return "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensaje.join("\n"));
}

function configurarEnvio(contenido, pedido) {
    const aviso = contenido.querySelector("[data-estado-pedido]");
    const abrirWhatsApp = contenido.querySelector("[data-abrir-whatsapp]");
    const confirmar = contenido.querySelector("[data-confirmar-envio]");
    const icono = contenido.querySelector(".confirmacion-icono");
    let versionGuardada = pedidoGuardado;

    abrirWhatsApp.href = crearEnlaceWhatsApp(pedido);

    function mostrarEstado() {
        const envioConfirmado = pedido.estadoWhatsApp === "confirmado";
        const chatSeleccionado = pedido.estadoWhatsApp === "en-whatsapp";
        abrirWhatsApp.hidden = envioConfirmado;
        confirmar.hidden = !chatSeleccionado;
        icono.hidden = !envioConfirmado;

        if (envioConfirmado) {
            aviso.textContent = "Marcaste este pedido como enviado. La confirmación de entrega aparece en WhatsApp.";
        } else if (chatSeleccionado) {
            aviso.textContent = "Tocá Enviar en WhatsApp y, al volver, elegí «Ya lo envié».";
        } else {
            aviso.textContent = "Tu pedido está listo para revisar. El botón abre WhatsApp en otra pestaña con el mensaje preparado.";
        }
    }

    function guardarEstado(estado) {
        if (localStorage.getItem("ultimo_pedido") !== versionGuardada) {
            aviso.textContent = "Este pedido cambió en otra pestaña. Recargá la página para ver el estado actualizado.";
            return false;
        }

        pedido.estadoWhatsApp = estado;
        versionGuardada = JSON.stringify(pedido);
        localStorage.setItem("ultimo_pedido", versionGuardada);
        mostrarEstado();
        return true;
    }

    abrirWhatsApp.addEventListener("click", evento => {
        if (!guardarEstado("en-whatsapp")) evento.preventDefault();
    });

    confirmar.addEventListener("click", () => {
        if (pedido.estadoWhatsApp !== "en-whatsapp" || !guardarEstado("confirmado")) return;

        const carritoVaciado = Boolean(pedido.codigo) && vaciarCarritoSiCoincide(pedido.productos);
        if (!carritoVaciado && leerCarrito().length > 0) {
            aviso.textContent += " Conservamos el contenido actual de tu carrito.";
        }
        aviso.focus();
    });

    mostrarEstado();
}

function mostrarPedido(pedido) {
    const plantilla = document.querySelector("#plantilla-pedido");
    contenedor.innerHTML = plantilla.innerHTML;

    contenedor.querySelector("h1").textContent = "Tu pedido, " + pedido.nombre;
    contenedor.querySelector("[data-direccion]").textContent = pedido.direccion;
    contenedor.querySelector(".total-orden strong").textContent = formatearImporte(pedido.total);

    if (typeof pedido.impuestos === "number") {
        const importes = contenedor.querySelector("[data-importes-pedido]");
        importes.querySelector("[data-subtotal]").textContent = formatearImporte(pedido.subtotal);
        importes.querySelector("[data-impuestos]").textContent = formatearImporte(pedido.impuestos);
        importes.hidden = false;
    }

    if (pedido.codigo) {
        const codigoPedido = contenedor.querySelector("[data-codigo-pedido]");
        codigoPedido.querySelector("dd").textContent = pedido.codigo;
        codigoPedido.hidden = false;
    }

    if (pedido.metodoPago) {
        const metodoPago = contenedor.querySelector("[data-metodo-pago]");
        metodoPago.querySelector("dd").textContent = pedido.metodoPago;
        metodoPago.hidden = false;
    }

    const lista = contenedor.querySelector(".lista-items-orden");
    for (const producto of pedido.productos) {
        const fila = document.createElement("li");
        const detalle = document.createElement("span");
        const importe = document.createElement("strong");
        detalle.textContent = producto.nombre + " × " + producto.cantidad;
        importe.textContent = formatearImporte(producto.precio * producto.cantidad);
        fila.append(detalle, importe);
        lista.appendChild(fila);
    }

    configurarEnvio(contenedor, pedido);
}

if (pedidoGuardado) {
    mostrarPedido(JSON.parse(pedidoGuardado));
}

