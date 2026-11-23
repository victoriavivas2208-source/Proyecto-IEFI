// Dibuja las tarjetas del catálogo a partir de la búsqueda y de los filtros.

import { productos } from "./productos.js";

// Elementos del HTML que vamos a usar
const contenedor = document.querySelector(".catalogo-productos");
const inputBusqueda = document.querySelector("#id-busqueda");
const selectMarca = document.querySelector("#id-marca");
const selectModelo = document.querySelector("#id-modelo");
const selectAnio = document.querySelector("#id-anio");
const selectCategoria = document.querySelector("#id-categoria");
const selectores = [selectMarca, selectModelo, selectAnio, selectCategoria];
const formularioFiltros = document.querySelector(".filtros-catalogo");
const estadoResultados = document.querySelector("#estado-resultados");

// Función que recibe una lista de productos y los dibuja en el contenedor
function mostrarProductos(lista) {
    if (lista.length === 0) {
        const mensaje = "No se encontraron productos con esos filtros.";
        contenedor.innerHTML = '<p class="mensaje-vacio">Probá con otra búsqueda o cambiá los filtros.</p>';
        estadoResultados.textContent = mensaje;
        return;
    }

    estadoResultados.textContent = lista.length === 1
        ? "1 producto encontrado."
        : lista.length + " productos encontrados.";

    let productosHTML = "";
    lista.forEach(function (producto) {
        productosHTML += `
        <article class="tarjeta-producto">
            <picture>
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </picture>
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcionCorta}</p>
            <ul>
                <li>${producto.caracteristica}</li>
                <li>Precio $ ${producto.precio.toLocaleString("es-AR")}</li>
            </ul>
            <a class="boton-secundario" href="./producto.html" data-id="${producto.id}">Ver más</a>
        </article>
        `;
    });
    contenedor.innerHTML = productosHTML;
}

function coincideModeloYAnio(producto, modeloElegido, anioElegido) {
    if (!modeloElegido && !anioElegido) return true;

    const coincidencia = producto.vehiculosDemo.find(function (vehiculo) {
        const coincideModelo = !modeloElegido || vehiculo.modelo === modeloElegido;
        const coincideAnio = !anioElegido || vehiculo.anio === Number(anioElegido);
        return coincideModelo && coincideAnio;
    });
    return coincidencia !== undefined;
}

function filtrarProductos() {
    if (productos === null) {
        const mensaje = "No pudimos cargar el catálogo. Volvé a cargar la página para intentarlo de nuevo.";
        estadoResultados.textContent = mensaje;
        return;
    }

    const busqueda = inputBusqueda.value.trim().toLowerCase();
    const marcaElegida = selectMarca.value;
    const modeloElegido = selectModelo.value;
    const anioElegido = selectAnio.value;
    const categoriaElegida = selectCategoria.value;

    const resultado = productos.filter(function (producto) {
        const coincideMarca = marcaElegida === "" || producto.marca === marcaElegida;
        const coincideCategoria = categoriaElegida === "" || producto.categoria === categoriaElegida;
        const texto = (producto.nombre + " " + producto.descripcionCorta + " " + producto.caracteristica).toLowerCase();
        return coincideMarca && coincideCategoria && texto.includes(busqueda)
            && coincideModeloYAnio(producto, modeloElegido, anioElegido);
    });

    mostrarProductos(resultado);
}

// Evento: cuando se envía el formulario de filtros aplicamos el filtro
formularioFiltros.addEventListener("submit", function (evento) {
    evento.preventDefault();
    filtrarProductos();
});

inputBusqueda.addEventListener("input", filtrarProductos);
selectores.forEach(function (select) {
    select.addEventListener("change", filtrarProductos);
});

// Evento: cuando se hace click en "Ver más" guardamos el id del producto en localStorage
// y recién ahí dejamos que el link lleve a producto.html
contenedor.addEventListener("click", function (evento) {
    if (evento.target.tagName === "A") {
        const idProducto = evento.target.dataset.id;
        localStorage.setItem("producto_seleccionado", idProducto);
    }
});

const filtrosDesdeURL = new URLSearchParams(window.location.search);
inputBusqueda.value = filtrosDesdeURL.get(inputBusqueda.name) || "";
for (const select of selectores) {
    const valor = filtrosDesdeURL.get(select.name);
    if (Array.from(select.options).some(opcion => opcion.value === valor)) {
        select.value = valor;
    }
}
filtrarProductos();
