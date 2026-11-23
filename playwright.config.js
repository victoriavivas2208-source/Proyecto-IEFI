import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4175";

export default defineConfig({
    testDir: "./e2e",
    testMatch: "**/*.e2e.js",
    use: { baseURL, browserName: "chromium" },
    webServer: {
        command: "npx --no-install vite --host 127.0.0.1 --port 4175 --strictPort",
        url: baseURL
    }
});
