import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: { input: { main: resolve(import.meta.dirname, "index.html"), simple: resolve(import.meta.dirname, "simple.html") } },
  },
});
