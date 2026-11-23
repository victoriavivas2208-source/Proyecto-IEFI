import { productos } from "./productos.js";
import { leerCarrito, guardarCarrito } from "./carrito.js";

function buscarProductoSeleccionado() {
    const idSeleccionado = localStorage.getItem("producto_seleccionado");
    return productos.find(producto => producto.id === idSeleccionado) ?? productos[0];
}

function mostrarDatosProducto(producto) {
    const titulo = document.querySelector(".detalle-producto h1");
    const imagen = document.querySelector(".detalle-producto picture img");
    const descripcion = document.querySelector(".detalle-producto > p");

    document.title = "Racing Garage - " + producto.nombre;
    titulo.textContent = producto.nombre;
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
    descripcion.textContent = producto.descripcionLarga;
}

function mostrarEspecificaciones(producto) {
    const lista = document.querySelector(".detalle-producto > ul");
    const precio = "Precio $ " + producto.precio.toLocaleString("es-AR");
    lista.innerHTML = "";

    for (const detalle of [...producto.especificaciones, precio]) {
        const item = document.createElement("li");
        item.textContent = detalle;
        lista.appendChild(item);
    }
}

function agregarProductoAlCarrito(carrito, producto, cantidad) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
        return;
    }

    carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad
    });
}

function manejarEnvioFormulario(evento, producto) {
    evento.preventDefault();
    const cantidad = evento.currentTarget.elements.namedItem("cantidad").valueAsNumber;

    if (!Number.isInteger(cantidad) || cantidad < 1) {
        alert("La cantidad debe ser un número entero mayor a 0");
        return;
    }

    const carrito = leerCarrito();
    agregarProductoAlCarrito(carrito, producto, cantidad);
    guardarCarrito(carrito);
    alert(cantidad + " unidad(es) de " + producto.nombre + " agregadas al carrito");
}

const formulario = document.querySelector(".formulario-agregar");
const producto = productos === null ? null : buscarProductoSeleccionado();

if (producto) {
    mostrarDatosProducto(producto);
    mostrarEspecificaciones(producto);
    formulario.addEventListener("submit", evento => manejarEnvioFormulario(evento, producto));
} else {
    document.querySelector(".detalle-producto h1").textContent = "Producto no disponible";
    document.querySelector(".detalle-producto picture").hidden = true;
    document.querySelector(".detalle-producto ul").hidden = true;
    document.querySelector(".detalle-producto > p").textContent =
        "No pudimos cargar el producto. Volvé a cargar la página para intentarlo de nuevo.";
    formulario.querySelector("input").disabled = true;
    formulario.querySelector("button").disabled = true;
}

