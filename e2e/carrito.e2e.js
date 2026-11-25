import { expect, test } from "@playwright/test";

async function verificarResumen(pagina) {
    const resumen = pagina.locator(".resumen-pedido");

    function importeDe(etiqueta) {
        return resumen.getByRole("listitem")
            .filter({ has: pagina.getByText(etiqueta, { exact: true }) })
            .locator("span").last();
    }

    await expect(importeDe("Subtotal")).toHaveText("$ 24.000");
    await expect(importeDe("Impuestos (21 %)")).toHaveText("$ 5.040");
    await expect(importeDe("Total")).toHaveText("$ 29.040");
}

test("mantiene el impuesto y el total desde el carrito hasta la confirmación del pedido", async ({ page }) => {
    await page.goto("/");
    const menu = page.getByRole("navigation", { name: "Principal" });
    await menu.getByRole("link", { name: "Catálogo", exact: true }).click();

    const llantas = page.getByRole("article").filter({ hasText: "Llantas Forjadas RS-7" });
    await llantas.getByRole("link", { name: "Ver más", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Cantidad" }).fill("20");
    await page.getByRole("button", { name: "Agregar al carrito" }).click();
    await menu.getByRole("link", { name: "Carrito", exact: true }).click();
    await verificarResumen(page);

    await page.getByRole("link", { name: "Continuar con el pedido" }).click();
    await verificarResumen(page);
    await page.getByLabel("Nombre completo").fill("Cliente de prueba");
    await page.getByLabel("Email").fill("prueba@example.com");
    await page.getByLabel("Teléfono").fill("3511234567");
    await page.getByLabel("Dirección").fill("Calle de prueba 123");
    await page.getByLabel("Ciudad").fill("Córdoba");
    await page.getByLabel("Código postal").fill("5000");
    await page.getByRole("button", { name: "Revisar pedido" }).click();

    const detalle = page.locator(".detalle-orden-confirmada");
    await expect(detalle.locator("[data-subtotal]")).toHaveText("$ 24.000");
    await expect(detalle.locator("[data-impuestos]")).toHaveText("$ 5.040");
    await expect(detalle.locator(".total-orden strong")).toHaveText("$ 29.040");

    const enlace = await page.getByRole("link", { name: "Enviar pedido por WhatsApp" }).getAttribute("href");
    const mensaje = new URL(enlace).searchParams.get("text");
    expect(mensaje).toContain("Impuestos (21 %): $ 5.040");
    expect(mensaje).toContain("Total: $ 29.040");
});
