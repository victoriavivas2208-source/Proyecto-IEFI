import { expect, test } from "vitest";
import { calcularImpuestos, calcularTotal } from "../recursos/js/carrito.js";

test("suma el precio de los productos según sus cantidades", () => {
    const carrito = [
        { precio: 10000, cantidad: 2 },
        { precio: 3500, cantidad: 1 }
    ];

    expect(calcularTotal(carrito)).toBe(23500);
});

test("el impuesto del 21 % sobre 24980 pesos es 5245,80", () => {
    const carrito = [{ precio: 1249, cantidad: 20 }];

    expect(calcularImpuestos(carrito)).toBe(5245.80);
});
