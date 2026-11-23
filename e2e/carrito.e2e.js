import { expect, test } from "@playwright/test";

const modos = [
    { nombre: "correcto", enlace: "Ver impuestos correctos" },
    { nombre: "simulado", enlace: "Ver error de impuestos" }
];

for (const modo of modos) {
    test(`muestra el impuesto y el total correctos al entrar al carrito (${modo.nombre})`, async ({ page }) => {
        await page.goto("/");
        await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Carrito", exact: true }).click();
        await page.getByRole("link", { name: modo.enlace, exact: true }).click();

        const resumen = page.locator(".resumen-pedido");
        await expect(resumen.getByRole("heading", { name: "Resumen del pedido" })).toBeVisible();
        await expect(page.getByRole("spinbutton", { name: "Cantidad" })).toHaveValue("20");

        function importeDe(etiqueta) {
            return resumen.getByRole("listitem")
                .filter({ has: page.getByText(etiqueta, { exact: true }) })
                .locator("span").last();
        }

        await expect(importeDe("Subtotal")).toHaveText("$ 24.000");
        await expect.soft(importeDe("Impuestos de ejemplo (21 %)")).toHaveText("$ 5.040");
        await expect.soft(importeDe("Total")).toHaveText("$ 29.040");
    });
}
