export const CLAVE_CARRITO = "carrito";

export function leerCarrito() {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");
}

export function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

export function calcularTotal(carrito) {
    let total = 0;
    carrito.forEach(function (item) {
        total = total + item.precio * item.cantidad;
    });
    return total;
}

export function vaciarCarritoSiCoincide(productos) {
    if (localStorage.getItem(CLAVE_CARRITO) !== JSON.stringify(productos)) return false;

    localStorage.removeItem(CLAVE_CARRITO);
    return true;
}
