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

const PORCENTAJE_IMPUESTOS = 21;

export function calcularImpuestos(carrito) {
    return Math.round(calcularTotal(carrito) * PORCENTAJE_IMPUESTOS) / 100;
}

export function calcularResumen(carrito) {
    const subtotal = calcularTotal(carrito);
    const impuestos = calcularImpuestos(carrito);
    const total = Math.round((subtotal + impuestos) * 100) / 100;
    return { subtotal, impuestos, total };
}

export function formatearImporte(importe) {
    return "$ " + importe.toLocaleString("es-AR", { maximumFractionDigits: 2 });
}

export function vaciarCarritoSiCoincide(productos) {
    if (localStorage.getItem(CLAVE_CARRITO) !== JSON.stringify(productos)) return false;

    localStorage.removeItem(CLAVE_CARRITO);
    return true;
}
