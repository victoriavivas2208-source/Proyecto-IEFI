const URL_PRODUCTOS = "./recursos/datos/productos.json";

async function obtenerDatos(url) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error("Error HTTP " + respuesta.status + " al cargar los productos.");
        }
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("No se pudieron cargar los productos.", error);
        return null;
    }
}

const productos = await obtenerDatos(URL_PRODUCTOS);

export { productos };
