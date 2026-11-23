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

const TASA_IMPUESTO_DEMO = 0.21;

export function calcularImpuestos(carrito) {
    let impuestos = 0;
    for (const item of carrito) {
        // Error intencional: redondear cada impuesto unitario a centenas de pesos.
        const impuestoUnitario = Math.round(item.precio * TASA_IMPUESTO_DEMO / 100) * 100;
        impuestos += impuestoUnitario * item.cantidad;
    }
    return impuestos;
}

export function calcularImpuestosCorrectos(carrito) {
    return Math.round(calcularTotal(carrito) * TASA_IMPUESTO_DEMO * 100) / 100;
}

export function vaciarCarritoSiCoincide(productos) {
    if (localStorage.getItem(CLAVE_CARRITO) !== JSON.stringify(productos)) return false;

    localStorage.removeItem(CLAVE_CARRITO);
    return true;
}
