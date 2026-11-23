// @vitest-environment jsdom

import { fireEvent, screen, within } from "@testing-library/dom";
import { afterEach, expect, test, vi } from "vitest";
import carritoHtml from "../carrito.html?raw";

vi.mock("../recursos/js/productos.js", async () => ({ productos: (await import("../recursos/datos/productos.json")).default }));

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
    expect(leerImporte(resumen, "Subtotal")).toBe("$ 22.800");

    fireEvent.change(screen.getByRole("spinbutton", { name: "Cantidad" }), { target: { value: "20" } });
    expect(leerImporte(resumen, "Subtotal")).toBe("$ 24.000");
    expect({
        impuesto: leerImporte(resumen, "Impuestos de ejemplo (21 %)"),
        total: leerImporte(resumen, "Total")
    }).toEqual({
        impuesto: "$ 5.040",
        total: "$ 29.040"
    });
});
