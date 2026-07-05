import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "analyze" &&
      visualizer({
        filename: "dist/bundle-stats.html",
        gzipSize: true,
        open: false,
      }),
  ].filter(Boolean),
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/highlight.js") || id.includes("node_modules/rehype") || id.includes("node_modules/react-markdown")) {
            return "markdown";
          }
          if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) return "i18n";
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react-router") || id.includes("node_modules/react/")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
