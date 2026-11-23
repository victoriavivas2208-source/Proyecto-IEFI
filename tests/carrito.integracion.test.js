// @vitest-environment jsdom

import { fireEvent, screen, within } from "@testing-library/dom";
import { afterEach, expect, test, vi } from "vitest";
import carritoHtml from "../carrito.html?raw";

vi.mock("../recursos/js/productos.js", () => ({ productos: [] }));

afterEach(() => {
    document.body.replaceChildren();
    window.history.replaceState(null, "", "/");
});

function leerImporte(resumen, etiqueta) {
    const fila = resumen.getByText(etiqueta).closest("li");
    return fila.lastElementChild.textContent;
}

test.each(["correcto", "simulado"])("actualiza los impuestos al cambiar la cantidad (%s)", async (modo) => {
    vi.resetModules();
    window.history.replaceState(null, "", `/carrito.html?impuestos=${modo}`);
    const pagina = new DOMParser().parseFromString(carritoHtml, "text/html");
    document.body.innerHTML = pagina.body.innerHTML;

    await import("../recursos/js/carrito-vista.js");

    const resumen = within(screen.getByRole("heading", { name: "Resumen del pedido" }).closest("section"));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Cantidad" }), { target: { value: "19" } });
    expect(leerImporte(resumen, "Subtotal")).toBe("$ 23.731,00");

    fireEvent.change(screen.getByRole("spinbutton", { name: "Cantidad" }), { target: { value: "20" } });
    expect(leerImporte(resumen, "Subtotal")).toBe("$ 24.980,00");
    expect({
        impuesto: leerImporte(resumen, "Impuestos de ejemplo (21 %)"),
        total: leerImporte(resumen, "Total")
    }).toEqual({
        impuesto: "$ 5.245,80",
        total: "$ 30.225,80"
    });
});
