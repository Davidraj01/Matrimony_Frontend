import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      output: {
        // Keep rarely-changing vendor code in its own chunk so it stays
        // cached across deploys instead of being re-downloaded whenever
        // app code changes.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("react-router-dom") || /[\\/]react(-dom)?[\\/]/.test(id)) {
            return "vendor-react";
          }
        },
      },
    },
  },

  server: {
    proxy: {
      // Keep in sync with PORT in Matrimony-server-main/.env
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:3002",
        changeOrigin: true,
        ws: true,
      },
      "/uploads": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
    },
  },
});
