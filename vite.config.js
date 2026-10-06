import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".up.railway.app",
      "iq-test-frontend-production-44cd.up.railway.app",
    ],
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".up.railway.app",
      "iq-test-frontend-production-44cd.up.railway.app",
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});