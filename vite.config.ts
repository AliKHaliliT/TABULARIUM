import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  // GitHub Pages serves project sites under /<repo>/; the deploy workflow
  // sets this. Local dev and plain builds stay at "/".
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // A fixed, unique port in the ecosystem (VITA runs on 3000, EPITOMA on
    // 3200). Failing loudly beats hopping ports: localStorage (every content
    // edit) is per-origin, so a silent port change looks like data loss.
    port: 3100,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
