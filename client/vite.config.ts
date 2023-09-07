// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { pwaConfig } from "./pwa.config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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

});
