// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import { pwaConfig } from "./pwa.config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      registerType: "autoUpdate",
      manifest: pwaConfig,
      injectRegister: "auto",
    }),
  ],
  server: {
    host: true,
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
