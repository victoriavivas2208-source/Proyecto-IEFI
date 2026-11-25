import { expect, test } from "vitest";
import { calcularImpuestos, calcularTotal } from "../recursos/js/carrito.js";

test("suma el precio de los productos según sus cantidades", () => {
    const carrito = [
        { precio: 10000, cantidad: 2 },
        { precio: 3500, cantidad: 1 }
    ];

    expect(calcularTotal(carrito)).toBe(23500);
});

test("el impuesto del 21 % sobre 24000 pesos es 5040", () => {
    const carrito = [{ precio: 1200, cantidad: 20 }];

    expect(calcularImpuestos(carrito)).toBe(5040);
});

test("redondea a centavos una vez, sobre el subtotal del carrito", () => {
    const carrito = [{ precio: 100.03, cantidad: 2 }];

    expect(calcularImpuestos(carrito)).toBe(42.01);
});
