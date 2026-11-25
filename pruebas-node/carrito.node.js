import assert from "node:assert/strict";
import { test } from "node:test";
import { calcularImpuestos, calcularTotal } from "../recursos/js/carrito.js";

const carrito = [{ precio: 1200, cantidad: 20 }];

test("calcularTotal suma el precio de las 20 llantas", () => {
    assert.equal(calcularTotal(carrito), 24000);
});

test("calcularImpuestos aplica el 21 % sobre el subtotal", () => {
    assert.equal(calcularImpuestos(carrito), 5040);
});
