import { resolve } from "node:path";
import { defineConfig } from "vite";

// In development, send /personal to /personal/ so it opens the personal room, the way Cloudflare Pages does.
const personalSlash = {
  name: "personal-trailing-slash",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/personal" || req.url.startsWith("/personal?")) { res.statusCode = 301; res.setHeader("Location", req.url.replace("/personal", "/personal/")); res.end(); return; }
      next();
    });
  },
};

export default defineConfig({
  plugins: [personalSlash],
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: { input: { main: resolve(import.meta.dirname, "index.html"), simple: resolve(import.meta.dirname, "simple.html"), personal: resolve(import.meta.dirname, "personal/index.html") } },
  },
});
